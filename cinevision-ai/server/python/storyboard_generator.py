import os
import json
import argparse
import time
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv('HF_API_TOKEN')
if not openai.api_key:
    raise ValueError("OpenAI API key not found in environment variables")

def parse_screenplay(script_text):
    """Parse screenplay format to extract scenes with metadata"""
    scenes = []
    current_scene = None
    current_dialogue = []
    current_action = []
    
    lines = script_text.split('\n')
    in_dialogue = False
    in_parenthetical = False
    
    for line in lines:
        line = line.strip()
        
        if line.startswith(('INT.', 'EXT.')):
            if current_scene:
                current_scene['dialogue'] = current_dialogue
                current_scene['action'] = current_action
                scenes.append(current_scene)
            
            # Parse scene heading for more details
            time_of_day = ''
            location = ''
            if ' - ' in line:
                location, time_of_day = line.split(' - ')
            else:
                location = line
            
            current_scene = {
                'heading': line,
                'location': location.strip(),
                'time_of_day': time_of_day.strip(),
                'description': [],
                'dialogue': [],
                'camera_shots': [],
                'action': [],
                'transitions': [],
                'mood': '',
                'characters': set()
            }
            current_dialogue = []
            current_action = []
            in_dialogue = False
            in_parenthetical = False
            
        elif current_scene and line:
            if line.startswith('(') and line.endswith(')'):
                if in_dialogue:
                    # This is a parenthetical for dialogue
                    if current_dialogue:
                        current_dialogue[-1]['parenthetical'] = line[1:-1]
                    in_parenthetical = True
                else:
                    # This is a camera direction or technical note
                    current_scene['camera_shots'].append({
                        'shot': line[1:-1],
                        'position': len(current_scene['description'])
                    })
            elif line.isupper() and not line.startswith(('INT.', 'EXT.')):
                if line.endswith('TO:') or line.endswith('WITH:') or line.endswith('IN:') or line.endswith('OUT:'):
                    current_scene['transitions'].append(line)
                else:
                    in_dialogue = True
                    current_scene['characters'].add(line)
                    current_dialogue.append({
                        'character': line,
                        'text': '',
                        'parenthetical': '',
                        'position': len(current_scene['description'])
                    })
            elif in_dialogue and line and not in_parenthetical:
                if current_dialogue:
                    current_dialogue[-1]['text'] = line
                in_dialogue = False
            elif not in_dialogue and line:
                current_scene['description'].append(line)
                current_action.append({
                    'text': line,
                    'position': len(current_scene['description']) - 1
                })
            
            in_parenthetical = False
    
    if current_scene:
        current_scene['dialogue'] = current_dialogue
        current_scene['action'] = current_action
        current_scene['characters'] = list(current_scene['characters'])  # Convert set to list for JSON serialization
        scenes.append(current_scene)
    
    # Add scene numbers and analyze mood
    for i, scene in enumerate(scenes):
        scene['scene_number'] = i + 1
        
        # Simple mood analysis based on description and dialogue
        mood_keywords = {
            'tense': ['nervous', 'worried', 'scared', 'fear', 'tension', 'anxiety'],
            'happy': ['laugh', 'smile', 'joy', 'happy', 'excited', 'cheerful'],
            'sad': ['cry', 'tears', 'sorrow', 'sad', 'depressed', 'gloomy'],
            'angry': ['shout', 'angry', 'fury', 'rage', 'mad', 'furious'],
            'romantic': ['love', 'kiss', 'embrace', 'romantic', 'tender', 'intimate']
        }
        
        scene_text = ' '.join(scene['description']).lower()
        scene_dialogue = ' '.join(d['text'].lower() for d in scene['dialogue'])
        combined_text = scene_text + ' ' + scene_dialogue
        
        mood_scores = {}
        for mood, keywords in mood_keywords.items():
            score = sum(1 for keyword in keywords if keyword in combined_text)
            if score > 0:
                mood_scores[mood] = score
        
        if mood_scores:
            scene['mood'] = max(mood_scores.items(), key=lambda x: x[1])[0]
        else:
            scene['mood'] = 'neutral'
    
    return scenes

def analyze_scene(scene_text):
    """Analyze a scene to determine camera angles, shot types, and descriptions."""
    prompt = f"""Analyze this scene and provide:
1. Scene heading (INT/EXT, location, time)
2. A brief description of what happens
3. Recommended camera angles and shot types
4. Key visual elements to focus on
5. Any special notes for filming

Scene:
{scene_text}"""

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": "You are a professional cinematographer and storyboard artist. Analyze scenes and provide detailed shot descriptions."
        }, {
            "role": "user",
            "content": prompt
        }],
        temperature=0.7
    )

    return {
        "description": response.choices[0].message.content,
        "original_text": scene_text
    }

def generate_storyboard(script_path, output_dir):
    """Generate storyboard from script"""
    try:
        # Read script file
        with open(script_path, 'r', encoding='utf-8') as f:
            script_text = f.read()
        
        # Parse screenplay
        scenes = parse_screenplay(script_text)
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Process each scene
        processed_scenes = []
        total_scenes = len(scenes)
        
        for i, scene in enumerate(scenes, 1):
            try:
                # Update progress
                progress = {
                    'status': 'processing',
                    'message': f'Processing scene {i}/{total_scenes}',
                    'progress': (i / total_scenes) * 100,
                    'scenes': processed_scenes
                }
                print(json.dumps(progress))
                
                # Generate scene description using OpenAI
                prompt = f"Generate a detailed visual description for a storyboard frame of this scene:\n\nScene: {scene['heading']}\n\nDescription: {' '.join(scene['description'])}\n\nFocus on the key visual elements, camera angles, and mood. Keep it concise but vivid."
                
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a professional storyboard artist and cinematographer."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                
                scene_description = response.choices[0].message.content.strip()
                
                processed_scene = {
                    'id': f'scene_{i}',
                    'scene_number': i,
                    'heading': scene['heading'],
                    'description': scene_description,
                    'original_description': ' '.join(scene['description']),
                    'time_of_day': scene['time_of_day'],
                    'location': scene['location']
                }
                
                processed_scenes.append(processed_scene)
                
                # Save progress to file
                with open(os.path.join(output_dir, 'storyboard.json'), 'w', encoding='utf-8') as f:
                    json.dump({
                        'scenes': processed_scenes,
                        'total_scenes': total_scenes,
                        'current_scene': i
                    }, f, indent=2)
                
            except Exception as e:
                print(json.dumps({
                    'status': 'error',
                    'message': f'Error processing scene {i}: {str(e)}',
                    'scenes': processed_scenes
                }))
        
        # Final update
        print(json.dumps({
            'status': 'complete',
            'message': 'Storyboard generation complete',
            'scenes': processed_scenes
        }))
        
    except Exception as e:
        print(json.dumps({
            'status': 'error',
            'message': f'Error generating storyboard: {str(e)}'
        }))
        raise

def main():
    parser = argparse.ArgumentParser(description='Generate storyboard from screenplay')
    parser.add_argument('--script', required=True, help='Path to the script file')
    parser.add_argument('--output', required=True, help='Output directory for storyboard panels')
    
    args = parser.parse_args()
    
    try:
        # Create output directory
        os.makedirs(args.output, exist_ok=True)
        
        # Read script
        with open(args.script, 'r') as f:
            script_content = f.read()
        
        # Parse scenes
        scenes = parse_screenplay(script_content)
        print(f"Found {len(scenes)} scenes")
        
        # Process each scene
        storyboard = generate_storyboard(args.script, args.output)
        
        # Save final storyboard
        with open(os.path.join(args.output, 'storyboard.json'), 'w') as f:
            json.dump(storyboard, f, indent=2)
            
        print(json.dumps({
            "status": "completed",
            "message": "Storyboard generation completed",
            "scenes": storyboard
        }))
        
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
        exit(1)

if __name__ == "__main__":
    main()
