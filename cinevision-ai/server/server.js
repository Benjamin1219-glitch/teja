const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const os = require('os');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to extract character roles from script
async function analyzeRoles(scriptText) {
  const lines = scriptText.split('\n');
  const roles = new Map();
  
  // Regular expressions for detecting character names and dialogues
  const characterLineRegex = /^[A-Z][A-Z\s]+(?:\(.*\))?$/;
  const parentheticalRegex = /^\(.*\)$/;
  
  lines.forEach((line, index) => {
    line = line.trim();
    
    // Skip empty lines and parenthetical lines
    if (!line || parentheticalRegex.test(line)) return;
    
    // If line matches character name pattern
    if (characterLineRegex.test(line)) {
      const characterName = line.split('(')[0].trim();
      
      if (!roles.has(characterName)) {
        roles.set(characterName, {
          name: characterName,
          lines: [],
          lineCount: 0,
          firstAppearance: index + 1
        });
      }
      
      // Look for the next line as dialogue
      if (index + 1 < lines.length) {
        const nextLine = lines[index + 1].trim();
        if (nextLine && !characterLineRegex.test(nextLine) && !parentheticalRegex.test(nextLine)) {
          roles.get(characterName).lines.push(nextLine);
          roles.get(characterName).lineCount++;
        }
      }
    }
  });
  
  // Convert Map to Array and sort by line count
  const characters = Array.from(roles.values())
    .sort((a, b) => b.lineCount - a.lineCount)
    .map(char => ({
      ...char,
      importance: char.lineCount > 20 ? 'Major' : char.lineCount > 5 ? 'Supporting' : 'Minor'
    }));
  
  return {
    characters,
    totalCharacters: characters.length,
    majorCharacters: characters.filter(c => c.importance === 'Major').length,
    supportingCharacters: characters.filter(c => c.importance === 'Supporting').length,
    minorCharacters: characters.filter(c => c.importance === 'Minor').length
  };
}

// Helper function to analyze budget
async function analyzeBudget(scriptText) {
  const analysis = {
    locations: [],
    props: [],
    specialEffects: [],
    estimatedBudget: {
      low: 0,
      high: 0
    }
  };
  
  const lines = scriptText.split('\n');
  const locationRegex = /^(INT\.|EXT\.)\s+(.+?)\s*[-—]?\s*(DAY|NIGHT|MORNING|EVENING|CONTINUOUS)?$/i;
  const propRegex = /\b(gun|car|phone|book|table|chair|computer|laptop|sword|knife|desk|bed)\b/gi;
  const effectsRegex = /\b(explosion|fire|rain|storm|lightning|earthquake|crash|fight|battle)\b/gi;
  
  const locations = new Set();
  const props = new Set();
  const effects = new Set();
  
  lines.forEach(line => {
    line = line.trim();
    
    // Find locations
    const locationMatch = line.match(locationRegex);
    if (locationMatch) {
      locations.add(locationMatch[2].trim());
    }
    
    // Find props
    const propsMatches = line.match(propRegex);
    if (propsMatches) {
      propsMatches.forEach(prop => props.add(prop.toLowerCase()));
    }
    
    // Find special effects
    const effectsMatches = line.match(effectsRegex);
    if (effectsMatches) {
      effectsMatches.forEach(effect => effects.add(effect.toLowerCase()));
    }
  });
  
  analysis.locations = Array.from(locations);
  analysis.props = Array.from(props);
  analysis.specialEffects = Array.from(effects);
  
  // Rough budget estimation
  const locationCost = analysis.locations.length * 5000;
  const propCost = analysis.props.length * 1000;
  const effectsCost = analysis.specialEffects.length * 10000;
  
  analysis.estimatedBudget.low = locationCost + propCost + effectsCost;
  analysis.estimatedBudget.high = analysis.estimatedBudget.low * 2;
  
  return analysis;
}

// Helper function to analyze camera and lights
async function analyzeCameraAndLights(scriptText) {
  const analysis = {
    scenes: [],
    cameraShots: [],
    lighting: []
  };
  
  const lines = scriptText.split('\n');
  const sceneRegex = /^(INT\.|EXT\.)\s+(.+?)\s*[-—]?\s*(DAY|NIGHT|MORNING|EVENING|CONTINUOUS)?$/i;
  const shotRegex = /\((.*?)\)/;
  
  let currentScene = null;
  
  lines.forEach(line => {
    line = line.trim();
    
    // New scene
    const sceneMatch = line.match(sceneRegex);
    if (sceneMatch) {
      if (currentScene) {
        analysis.scenes.push(currentScene);
      }
      
      currentScene = {
        location: sceneMatch[2].trim(),
        timeOfDay: sceneMatch[3] ? sceneMatch[3].toLowerCase() : 'unknown',
        interior: sceneMatch[1].toUpperCase() === 'INT.',
        shots: [],
        lighting: []
      };
      
      // Add default lighting based on time of day
      if (currentScene.timeOfDay === 'day') {
        currentScene.lighting.push('Natural light');
      } else if (currentScene.timeOfDay === 'night') {
        currentScene.lighting.push('Artificial light');
        if (currentScene.interior) {
          currentScene.lighting.push('Practical lights');
        }
      }
    }
    
    // Camera shots
    const shotMatch = line.match(shotRegex);
    if (shotMatch && currentScene) {
      const shot = shotMatch[1].trim().toLowerCase();
      currentScene.shots.push(shot);
      if (!analysis.cameraShots.includes(shot)) {
        analysis.cameraShots.push(shot);
      }
    }
  });
  
  // Add the last scene
  if (currentScene) {
    analysis.scenes.push(currentScene);
  }
  
  // Aggregate lighting setups
  analysis.lighting = Array.from(new Set(
    analysis.scenes.flatMap(scene => scene.lighting)
  ));
  
  return analysis;
}

// Store storyboard generation progress
const storyboardProgress = new Map();

// Progress endpoint
app.get('/api/generate/storyboard/progress/:id', (req, res) => {
  const id = req.params.id;
  
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Get progress data
  const progress = storyboardProgress.get(id) || {
    status: 'processing',
    message: 'Starting storyboard generation...',
    panels: []
  };
  
  // Send initial progress
  res.write(`data: ${JSON.stringify(progress)}\n\n`);
  
  // Store the response object
  storyboardProgress.set(id, { ...progress, res });
  
  // Handle client disconnect
  req.on('close', () => {
    const progress = storyboardProgress.get(id);
    if (progress && progress.res) {
      progress.res.end();
    }
    storyboardProgress.delete(id);
  });
});

// Update storyboard progress
function updateStoryboardProgress(id, data) {
  const progress = storyboardProgress.get(id);
  if (progress && progress.res) {
    progress.res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (data.status === 'completed' || data.status === 'error') {
      progress.res.end();
      storyboardProgress.delete(id);
    }
  }
}

// File Upload Endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { scriptText } = req.body;
    
    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided' });
    }
    
    // Analyze the script
    const analysis = {
      roles: await analyzeRoles(scriptText),
      budget: await analyzeBudget(scriptText),
      camera: await analyzeCameraAndLights(scriptText)
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: error.message });
  }
});

// Character Analysis Endpoint
app.post('/api/analyze/characters', async (req, res) => {
  try {
    const { scriptText } = req.body;
    
    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided' });
    }
    
    // Create a temporary directory for analysis
    const timestamp = Date.now();
    const tempDir = path.join(__dirname, 'temp', `analysis_${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    // Save the script to a temporary file
    const scriptPath = path.join(tempDir, 'script.txt');
    await fs.writeFile(scriptPath, scriptText);
    
    // Run the Python script for character analysis
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'python', 'character_analyzer.py'),
      '--script', scriptPath
    ]);
    
    let outputData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data;
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Character analysis error: ${data}`);
    });
    
    pythonProcess.on('close', async (code) => {
      try {
        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true });
        
        if (code === 0) {
          const characters = JSON.parse(outputData);
          res.json({ characters });
        } else {
          res.status(500).json({ error: 'Failed to analyze characters' });
        }
      } catch (err) {
        console.error('Error in character analysis:', err);
        res.status(500).json({ error: 'Failed to process character analysis results' });
      }
    });
    
  } catch (error) {
    console.error('Error in character analysis:', error);
    res.status(500).json({ error: 'Error analyzing characters' });
  }
});

// Budget Analysis Endpoint
app.post('/api/analyze/budget', async (req, res) => {
  try {
    const { scriptText } = req.body;
    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided' });
    }

    // Save script to temporary file
    const scriptFile = path.join(os.tmpdir(), `script_${Date.now()}.txt`);
    await fs.writeFile(scriptFile, scriptText);

    // Run budget analysis
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'python', 'budget_analyzer.py'),
      scriptFile
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Budget analysis failed: ${error}`));
        } else {
          resolve();
        }
      });
    });

    // Clean up temporary file
    await fs.unlink(scriptFile);

    // Parse and send the result
    const budget = JSON.parse(result);
    res.json(budget);

  } catch (error) {
    console.error('Error in budget analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Camera Analysis Endpoint
app.post('/api/analyze/camera', async (req, res) => {
  try {
    const { scriptText } = req.body;
    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided' });
    }

    // Save script to temporary file
    const scriptFile = path.join(os.tmpdir(), `script_${Date.now()}.txt`);
    await fs.writeFile(scriptFile, scriptText);

    // Run camera analysis
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'python', 'camera_analyzer.py'),
      scriptFile
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Camera analysis failed: ${error}`));
        } else {
          resolve();
        }
      });
    });

    // Clean up temporary file
    await fs.unlink(scriptFile);

    // Parse and send the result
    const analysis = JSON.parse(result);
    res.json(analysis);

  } catch (error) {
    console.error('Error in camera analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Production Suggestions Endpoint
app.post('/api/analyze/suggestions', async (req, res) => {
  try {
    const { scriptText } = req.body;
    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided' });
    }

    // Save script to temporary file
    const scriptFile = path.join(os.tmpdir(), `script_${Date.now()}.txt`);
    await fs.writeFile(scriptFile, scriptText);

    // Run suggestions analysis
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'python', 'suggestions_analyzer.py'),
      scriptFile
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Suggestions analysis failed: ${error}`));
        } else {
          resolve();
        }
      });
    });

    // Clean up temporary file
    await fs.unlink(scriptFile);

    // Parse and send the result
    const analysis = JSON.parse(result);
    res.json(analysis);

  } catch (error) {
    console.error('Error in suggestions analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Storyboard Generation Endpoint
app.post('/api/generate/storyboard', async (req, res) => {
  try {
    const { scriptText } = req.body;
    
    if (!scriptText) {
      console.error('No script text provided');
      return res.status(400).json({ error: 'No script text provided' });
    }
    
    console.log('Received script text length:', scriptText.length);
    
    // Create a temporary directory for this generation
    const timestamp = Date.now();
    const tempDir = path.join(__dirname, 'temp', `storyboard_${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    // Save the script to a temporary file
    const scriptPath = path.join(tempDir, 'script.txt');
    await fs.writeFile(scriptPath, scriptText);
    
    // Create output directory
    const outputDir = path.join(tempDir, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Send initial response
    res.json({ message: 'Analysis started', id: timestamp });
    
    // Run the Python script
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'python', 'storyboard_generator.py'),
      scriptPath,
      outputDir
    ]);
    
    pythonProcess.stdout.on('data', (data) => {
      try {
        const message = data.toString().trim();
        if (message.startsWith('{')) {
          const progressData = JSON.parse(message);
          updateStoryboardProgress(timestamp, progressData);
        }
      } catch (err) {
        console.error('Error parsing Python output:', err);
      }
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
      updateStoryboardProgress(timestamp, {
        status: 'error',
        message: 'Error analyzing script: ' + data.toString()
      });
    });
    
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        updateStoryboardProgress(timestamp, {
          status: 'error',
          message: `Script analysis failed with code ${code}`
        });
      }
      
      // Clean up temp files
      try {
        await fs.rm(tempDir, { recursive: true });
      } catch (err) {
        console.error('Error cleaning up temp files:', err);
      }
    });
    
  } catch (error) {
    console.error('Error in storyboard generation:', error);
    res.status(500).json({ error: 'Failed to analyze script' });
  }
});

// User data persistence
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Load users from file or create empty array
const loadUsers = async () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Try to read the users file
    try {
      const data = await fs.readFile(usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // If file doesn't exist, create it with empty array
        await fs.writeFile(usersFilePath, '[]');
        return [];
      }
      throw err;
    }
  } catch (error) {
    console.error('Error in loadUsers:', error);
    return [];
  }
};

// Save users to file
const saveUsers = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save user data');
  }
};

// Initialize users array
let users = [];
loadUsers().then(loadedUsers => {
  users = loadedUsers;
}).catch(error => {
  console.error('Error loading users:', error);
});

// Helper function to generate token
const generateToken = (user) => {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');
};

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateToken(user);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Case-insensitive email check
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await saveUsers(users);
    
    const token = generateToken(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
