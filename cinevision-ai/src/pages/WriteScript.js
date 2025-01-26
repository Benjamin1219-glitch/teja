import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Lightbulb as LightbulbIcon,
  LocationOn as LocationIcon,
  DirectionsRun as ActionIcon,
  Person as CharacterIcon,
  Chat as DialogueIcon,
  TextFields as ParentheticalIcon,
  Transform as TransitionIcon,
  Home as InteriorIcon,
  Landscape as ExteriorIcon,
  CompareArrows as IntExtIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& fieldset': {
      borderColor: 'rgba(33, 150, 243, 0.3)',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: '#2196f3',
      boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196f3',
      borderWidth: '2px',
      boxShadow: '0 0 15px rgba(33, 150, 243, 0.7)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#2196f3',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(0, 10, 25, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(33, 150, 243, 0.2)',
    boxShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
  },
  '& .MuiMenuItem-root': {
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      color: '#2196f3',
      boxShadow: 'inset 0 0 8px rgba(33, 150, 243, 0.3)',
    },
    '& .MuiListItemIcon-root': {
      color: '#2196f3',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  color: 'white',
  padding: '10px 20px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
    boxShadow: '0 0 15px rgba(33, 203, 243, .5)',
    transform: 'scale(1.02)',
  },
}));

const WriteScript = () => {
  const [sceneHeading, setSceneHeading] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [elementAnchorEl, setElementAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [selectedElement, setSelectedElement] = useState('SCENE HEADING');
  const [selectedLocation, setSelectedLocation] = useState('INT');
  const [scriptElements, setScriptElements] = useState([]);
  const [isAddElementDialogOpen, setIsAddElementDialogOpen] = useState(false);
  const [newElement, setNewElement] = useState({ text: '', content: '' });

  const handleElementMenuClick = (event) => {
    setElementAnchorEl(event.currentTarget);
  };

  const handleElementMenuClose = () => {
    setElementAnchorEl(null);
  };

  const handleLocationMenuClick = (event) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleLocationMenuClose = () => {
    setLocationAnchorEl(null);
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
    handleElementMenuClose();
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    handleLocationMenuClose();
  };

  const handleAddElementClick = () => {
    setIsAddElementDialogOpen(true);
  };

  const handleAddElementClose = () => {
    setIsAddElementDialogOpen(false);
    setNewElement({ text: '', content: '' });
  };

  const handleAddElement = () => {
    if (newElement.text && newElement.content) {
      const newScriptElement = {
        type: selectedElement,
        text: newElement.text,
        content: newElement.content,
        timestamp: new Date().getTime()
      };
      setScriptElements([...scriptElements, newScriptElement]);
      handleAddElementClose();
    }
  };

  const menuItems = [
    { text: 'SCENE HEADING', icon: <LocationIcon /> },
    { text: 'ACTION', icon: <ActionIcon /> },
    { text: 'CHARACTER', icon: <CharacterIcon /> },
    { text: 'DIALOGUE', icon: <DialogueIcon /> },
    { text: 'PARENTHETICAL', icon: <ParentheticalIcon /> },
    { text: 'TRANSITION', icon: <TransitionIcon /> },
  ];

  const locationItems = [
    { text: 'INT', icon: <InteriorIcon />, description: 'Interior' },
    { text: 'EXT', icon: <ExteriorIcon />, description: 'Exterior' },
    { text: 'INT/EXT', icon: <IntExtIcon />, description: 'Interior/Exterior' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: 'rgba(0, 0, 0, 0.7)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(33, 150, 243, 0.1)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Button
              onClick={handleElementMenuClick}
              sx={{
                color: '#2196f3',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  border: '1px solid #2196f3',
                  boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                },
              }}
            >
              {selectedElement} ▼
            </Button>

            <StyledMenu
              anchorEl={elementAnchorEl}
              open={Boolean(elementAnchorEl)}
              onClose={handleElementMenuClose}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.text} 
                  onClick={() => handleElementSelect(item.text)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
            </StyledMenu>

            <Button
              onClick={handleLocationMenuClick}
              sx={{
                color: '#2196f3',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                minWidth: '120px',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  border: '1px solid #2196f3',
                  boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                },
              }}
            >
              {selectedLocation} ▼
            </Button>

            <StyledMenu
              anchorEl={locationAnchorEl}
              open={Boolean(locationAnchorEl)}
              onClose={handleLocationMenuClose}
            >
              {locationItems.map((item) => (
                <MenuItem 
                  key={item.text} 
                  onClick={() => handleLocationSelect(item.text)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    secondary={item.description}
                    secondaryTypographyProps={{
                      sx: { color: 'rgba(255, 255, 255, 0.5)' }
                    }}
                  />
                </MenuItem>
              ))}
            </StyledMenu>

            <StyledButton
              startIcon={<SaveIcon />}
              onClick={() => {}}
            >
              Save Script
            </StyledButton>

            <StyledButton
              startIcon={<LightbulbIcon />}
              onClick={() => {}}
            >
              Get AI Suggestions
            </StyledButton>

            <StyledButton
              startIcon={<AddIcon />}
              onClick={handleAddElementClick}
            >
              Add Element
            </StyledButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {scriptElements.map((element, index) => (
              <Box 
                key={element.timestamp}
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  borderRadius: 1,
                }}
              >
                <Typography sx={{ color: '#2196f3', mb: 1 }}>
                  {element.type}: {element.text}
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  {element.content}
                </Typography>
              </Box>
            ))}
          </Box>

          <StyledTextField
            fullWidth
            variant="outlined"
            value={sceneHeading}
            onChange={(e) => setSceneHeading(e.target.value)}
            placeholder={`${selectedLocation} - Enter location...`}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#2196f3', mb: 2 }}>
            AI Suggestions
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
            borderRadius: 1
          }}>
            {suggestions.length === 0 ? (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                AI suggestions will appear here...
              </Typography>
            ) : (
              suggestions.map((suggestion, index) => (
                <Typography key={index} sx={{ color: 'white', mb: 1 }}>
                  {suggestion}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      </Paper>

      {/* Add Element Dialog */}
      <Dialog 
        open={isAddElementDialogOpen} 
        onClose={handleAddElementClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 10, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
            boxShadow: '0 0 20px rgba(33, 150, 243, 0.3)',
            minWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#2196f3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add New {selectedElement}
          <IconButton 
            onClick={handleAddElementClose}
            sx={{ 
              color: 'rgba(33, 150, 243, 0.7)',
              '&:hover': { color: '#2196f3' } 
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            fullWidth
            label="Title"
            value={newElement.text}
            onChange={(e) => setNewElement({ ...newElement, text: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <StyledTextField
            fullWidth
            label="Content"
            value={newElement.content}
            onChange={(e) => setNewElement({ ...newElement, content: e.target.value })}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleAddElementClose}
            sx={{ 
              color: 'rgba(33, 150, 243, 0.7)',
              '&:hover': { color: '#2196f3' } 
            }}
          >
            Cancel
          </Button>
          <StyledButton onClick={handleAddElement}>
            Add Element
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WriteScript;
