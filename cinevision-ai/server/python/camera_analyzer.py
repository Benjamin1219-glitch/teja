import re
import json
from typing import Dict, List

def analyze_camera_requirements(script_text: str) -> Dict:
    analysis = {
        "scenes": [],
        "camera_setups": {
            "primary": {},
            "secondary": {},
            "specialty": {}
        },
        "lighting_setups": [],
        "movement_equipment": [],
        "recommendations": []
    }
    
    # Analyze scenes
    scenes = extract_scenes(script_text)
    for scene in scenes:
        scene_analysis = analyze_scene(scene)
        analysis["scenes"].append(scene_analysis)
        
        # Add camera recommendations based on scene
        add_camera_recommendations(analysis["camera_setups"], scene_analysis)
        
        # Add lighting setup based on scene
        add_lighting_recommendations(analysis["lighting_setups"], scene_analysis)
        
        # Add movement equipment based on scene
        add_movement_recommendations(analysis["movement_equipment"], scene_analysis)
    
    # Generate overall recommendations
    generate_overall_recommendations(analysis)
    
    return analysis

def extract_scenes(script_text: str) -> List[Dict]:
    scenes = []
    
    # Look for scene headings
    scene_pattern = r'(INT\.|EXT\.|INT\/EXT\.)\s+(.+?)(?=\n|$)'
    time_pattern = r'(?:DAWN|DAY|DUSK|NIGHT|MORNING|AFTERNOON|EVENING)'
    
    current_scene = None
    current_scene_text = []
    
    for line in script_text.split('\n'):
        scene_match = re.match(scene_pattern, line)
        if scene_match:
            if current_scene:
                current_scene['content'] = '\n'.join(current_scene_text)
                scenes.append(current_scene)
            
            location_time = scene_match.group(2)
            time_match = re.search(time_pattern, location_time)
            
            current_scene = {
                'location_type': scene_match.group(1),
                'location': location_time.split('-')[0].strip() if '-' in location_time else location_time,
                'time': time_match.group(0) if time_match else 'DAY',
                'content': ''
            }
            current_scene_text = []
        else:
            if current_scene:
                current_scene_text.append(line)
    
    if current_scene:
        current_scene['content'] = '\n'.join(current_scene_text)
        scenes.append(current_scene)
    
    return scenes

def analyze_scene(scene: Dict) -> Dict:
    analysis = {
        'location_type': scene['location_type'],
        'location': scene['location'],
        'time': scene['time'],
        'camera_requirements': [],
        'lighting_requirements': [],
        'movement_requirements': [],
        'special_requirements': []
    }
    
    content = scene['content'].lower()
    
    # Analyze based on location type
    if scene['location_type'] == 'INT.':
        analysis['lighting_requirements'].append({
            'type': 'indoor',
            'setup': get_indoor_lighting_setup(scene['time'])
        })
    else:
        analysis['lighting_requirements'].append({
            'type': 'outdoor',
            'setup': get_outdoor_lighting_setup(scene['time'])
        })
    
    # Check for specific camera requirements
    if any(word in content for word in ['close up', 'closeup', 'close-up']):
        analysis['camera_requirements'].append({
            'type': 'prime lens',
            'suggestion': '50mm or 85mm prime lens for close-up shots'
        })
    
    if any(word in content for word in ['wide', 'establishing', 'landscape']):
        analysis['camera_requirements'].append({
            'type': 'wide lens',
            'suggestion': '16-35mm lens for wide shots'
        })
    
    # Check for movement
    if any(word in content for word in ['follows', 'tracking', 'moving', 'walks', 'runs']):
        analysis['movement_requirements'].append({
            'type': 'tracking',
            'equipment': ['Dolly', 'Steadicam']
        })
    
    # Check for special shots
    if any(word in content for word in ['aerial', 'bird', 'overhead']):
        analysis['special_requirements'].append({
            'type': 'aerial',
            'equipment': ['Drone', 'Crane']
        })
    
    # Check for action sequences
    if any(word in content for word in ['fight', 'chase', 'action', 'explosion']):
        analysis['camera_requirements'].append({
            'type': 'action',
            'suggestion': 'High-speed camera capable of 120fps or higher'
        })
    
    return analysis

def get_indoor_lighting_setup(time: str) -> Dict:
    setups = {
        'DAY': {
            'primary': ['Softboxes', 'LED Panels'],
            'fill': ['Reflectors', 'Small LED'],
            'background': ['Window light supplementation']
        },
        'NIGHT': {
            'primary': ['Tungsten lights', 'LED Panels'],
            'fill': ['Small LED spots'],
            'background': ['Practical lights', 'Accent lights']
        },
        'DUSK': {
            'primary': ['Warm LED panels', 'Tungsten'],
            'fill': ['Orange gels', 'Reflectors'],
            'background': ['Practical lights']
        },
        'DAWN': {
            'primary': ['Cool LED panels', 'HMI'],
            'fill': ['Blue gels', 'Reflectors'],
            'background': ['Window light supplementation']
        }
    }
    return setups.get(time, setups['DAY'])

def get_outdoor_lighting_setup(time: str) -> Dict:
    setups = {
        'DAY': {
            'primary': ['Reflectors', 'Diffusion frames'],
            'fill': ['White bounce', 'LED fill'],
            'control': ['Flags', 'Silks']
        },
        'NIGHT': {
            'primary': ['HMI lights', 'LED panels'],
            'fill': ['Reflectors', 'Small LED'],
            'control': ['Flags', 'Diffusion']
        },
        'DUSK': {
            'primary': ['HMI with CTO', 'LED panels'],
            'fill': ['Reflectors', 'LED fill'],
            'control': ['Flags', 'Diffusion']
        },
        'DAWN': {
            'primary': ['HMI with CTB', 'LED panels'],
            'fill': ['Reflectors', 'LED fill'],
            'control': ['Flags', 'Diffusion']
        }
    }
    return setups.get(time, setups['DAY'])

def add_camera_recommendations(camera_setups: Dict, scene_analysis: Dict):
    for req in scene_analysis['camera_requirements']:
        if req['type'] == 'action':
            camera_setups['primary']['high_speed'] = {
                'camera': 'RED Komodo or ARRI Alexa Mini',
                'features': ['High frame rates', '4K or higher resolution']
            }
        elif req['type'] in ['prime lens', 'wide lens']:
            if 'lenses' not in camera_setups['primary']:
                camera_setups['primary']['lenses'] = []
            camera_setups['primary']['lenses'].append(req['suggestion'])

def add_lighting_recommendations(lighting_setups: List, scene_analysis: Dict):
    for req in scene_analysis['lighting_requirements']:
        if req not in lighting_setups:
            lighting_setups.append(req)

def add_movement_recommendations(movement_equipment: List, scene_analysis: Dict):
    for req in scene_analysis['movement_requirements']:
        if req['equipment'] not in movement_equipment:
            movement_equipment.extend(req['equipment'])

def generate_overall_recommendations(analysis: Dict):
    recommendations = []
    
    # Camera recommendations
    if analysis['camera_setups']['primary'].get('high_speed'):
        recommendations.append({
            'category': 'Camera',
            'suggestion': 'Use a high-speed camera for action sequences',
            'details': analysis['camera_setups']['primary']['high_speed']
        })
    
    # Lens recommendations
    if analysis['camera_setups']['primary'].get('lenses'):
        recommendations.append({
            'category': 'Lenses',
            'suggestion': 'Mixed lens package required',
            'details': list(set(analysis['camera_setups']['primary']['lenses']))
        })
    
    # Lighting recommendations
    unique_lighting = set()
    for scene in analysis['scenes']:
        for light in scene['lighting_requirements']:
            setup_type = light['type']
            if setup_type not in unique_lighting:
                unique_lighting.add(setup_type)
                recommendations.append({
                    'category': 'Lighting',
                    'suggestion': f'{setup_type.capitalize()} lighting package required',
                    'details': light['setup']
                })
    
    # Movement equipment recommendations
    if analysis['movement_equipment']:
        recommendations.append({
            'category': 'Movement',
            'suggestion': 'Camera movement equipment required',
            'details': list(set(analysis['movement_equipment']))
        })
    
    analysis['recommendations'] = recommendations

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python camera_analyzer.py <script_file>")
        sys.exit(1)
        
    with open(sys.argv[1], 'r') as f:
        script_text = f.read()
        
    analysis = analyze_camera_requirements(script_text)
    print(json.dumps(analysis, indent=2))
