import argparse
import json
import re
from collections import defaultdict

def analyze_characters(script_text):
    """Analyze characters from the screenplay"""
    characters = defaultdict(lambda: {
        'name': '',
        'role': 'Supporting Character',  # Default role
        'description': '',
        'dialogueCount': 0,
        'sampleDialogues': [],
        'scenes': set(),
        'interactions': set()
    })
    
    current_character = None
    in_dialogue = False
    scene_count = 0
    
    # Split script into lines
    lines = script_text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Skip empty lines
        if not line:
            continue
            
        # Detect scene headings
        if line.startswith(('INT.', 'EXT.')):
            scene_count += 1
            continue
            
        # Detect character names (in all caps, not scene headings)
        if line.isupper() and not line.startswith(('INT.', 'EXT.')):
            # Check if it's a character name (not scene description or transition)
            next_line = lines[i + 1].strip() if i + 1 < len(lines) else ''
            if next_line and not next_line.isupper() and not next_line.startswith('('):
                current_character = line
                in_dialogue = True
                
                if current_character not in characters:
                    characters[current_character]['name'] = current_character
                
                characters[current_character]['dialogueCount'] += 1
                continue
        
        # Capture dialogue
        if in_dialogue and current_character and line:
            if not line.startswith('('):  # Skip parentheticals
                if len(characters[current_character]['sampleDialogues']) < 3:
                    characters[current_character]['sampleDialogues'].append(line)
            in_dialogue = False
            continue
            
        # Try to capture character descriptions
        if not in_dialogue and any(char in line.upper() for char in characters.keys()):
            for char in characters.keys():
                if char in line.upper():
                    if not characters[char]['description']:
                        characters[char]['description'] = line
    
    # Determine main characters (those with most dialogue)
    dialogue_counts = [(char, data['dialogueCount']) for char, data in characters.items()]
    dialogue_counts.sort(key=lambda x: x[1], reverse=True)
    
    # Mark top 3 characters as main characters
    for i, (char, _) in enumerate(dialogue_counts[:3]):
        if i == 0:
            characters[char]['role'] = 'Protagonist'
        else:
            characters[char]['role'] = 'Main Character'
    
    # Convert to list and clean up
    character_list = []
    for char_data in characters.values():
        # Remove set() for JSON serialization
        char_data.pop('scenes')
        char_data.pop('interactions')
        # Add default description if none found
        if not char_data['description']:
            char_data['description'] = f"Character appearing in the screenplay with {char_data['dialogueCount']} lines of dialogue."
        character_list.append(char_data)
    
    # Sort by dialogue count
    character_list.sort(key=lambda x: x['dialogueCount'], reverse=True)
    
    return character_list

def main():
    parser = argparse.ArgumentParser(description='Analyze characters in a screenplay')
    parser.add_argument('--script', required=True, help='Path to the script file')
    
    args = parser.parse_args()
    
    try:
        # Read script
        with open(args.script, 'r') as f:
            script_content = f.read()
        
        # Analyze characters
        characters = analyze_characters(script_content)
        
        # Output JSON to stdout
        print(json.dumps(characters))
        
    except Exception as e:
        print(f"Error analyzing characters: {str(e)}", file=sys.stderr)
        exit(1)

if __name__ == "__main__":
    main()
