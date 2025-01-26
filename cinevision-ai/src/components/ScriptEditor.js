import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Add as AddIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Chat as DialogueIcon,
  Movie as SceneIcon,
  Lightbulb as SuggestIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  height: calc(100vh - 100px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const EditorToolbar = styled(Box)`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
  border-radius: 25px;
  border: 0;
  color: white;
  padding: 8px 16px;
  box-shadow: 0 3px 5px 2px rgba(33, 203, 243, .3);
  text-transform: none;
  
  &:hover {
    background: linear-gradient(45deg, #1976D2 30%, #00BCD4 90%);
  }
`;

const StyledSelect = styled(Select)`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border-radius: 8px;
  
  .MuiSelect-icon {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    color: white;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.Mui-focused fieldset {
      border-color: #2196F3;
    }
  }
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #2196F3;
    }
  }
`;

const ElementTypes = {
  SCENE_HEADING: 'SCENE HEADING',
  ACTION: 'ACTION',
  CHARACTER: 'CHARACTER',
  DIALOGUE: 'DIALOGUE',
  PARENTHETICAL: 'PARENTHETICAL',
  TRANSITION: 'TRANSITION',
};

function ScriptEditor() {
  const [currentElement, setCurrentElement] = useState(ElementTypes.SCENE_HEADING);
  const [scriptElements, setScriptElements] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleAddElement = () => {
    if (currentText.trim()) {
      setScriptElements([...scriptElements, { type: currentElement, content: currentText }]);
      setCurrentText('');
      // Request AI suggestions for next element
      generateSuggestions(currentElement);
    }
  };

  const generateSuggestions = async (elementType) => {
    // TODO: Implement AI suggestions based on current script context
    const mockSuggestions = {
      [ElementTypes.SCENE_HEADING]: ['INT. COFFEE SHOP - DAY', 'EXT. CITY STREET - NIGHT'],
      [ElementTypes.ACTION]: ['John nervously taps his fingers on the table', 'Sarah glances at her watch'],
      [ElementTypes.CHARACTER]: ['JOHN', 'SARAH'],
      [ElementTypes.DIALOGUE]: ['This can\'t be happening...', 'We need to move fast.'],
    };
    setSuggestions(mockSuggestions[elementType] || []);
  };

  const formatElementContent = (element) => {
    switch (element.type) {
      case ElementTypes.SCENE_HEADING:
        return element.content.toUpperCase();
      case ElementTypes.CHARACTER:
        return element.content.toUpperCase();
      default:
        return element.content;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, color: 'white' }}>
      <StyledPaper>
        <EditorToolbar>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Element Type</InputLabel>
            <StyledSelect
              value={currentElement}
              onChange={(e) => setCurrentElement(e.target.value)}
              label="Element Type"
            >
              {Object.values(ElementTypes).map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
          
          <StyledButton
            startIcon={<AddIcon />}
            onClick={handleAddElement}
          >
            Add Element
          </StyledButton>
          
          <StyledButton
            startIcon={<SaveIcon />}
          >
            Save Script
          </StyledButton>

          <StyledButton
            startIcon={<SuggestIcon />}
          >
            Get AI Suggestions
          </StyledButton>
        </EditorToolbar>

        <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid item xs={8} sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              {scriptElements.map((element, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    pl: element.type === ElementTypes.DIALOGUE ? 4 : 0,
                    pr: element.type === ElementTypes.DIALOGUE ? 4 : 0
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Courier New',
                      fontSize: '14px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {formatElementContent(element)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder={`Enter ${currentElement.toLowerCase()}...`}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={4} sx={{ height: '100%', overflow: 'auto' }}>
            <Paper
              sx={{
                p: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                AI Suggestions
              </Typography>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    color: 'white',
                    mb: 1,
                    textAlign: 'left',
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                  onClick={() => setCurrentText(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}

export default ScriptEditor;
