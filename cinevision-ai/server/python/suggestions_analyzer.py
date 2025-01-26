import re
import json
from typing import Dict, List
from collections import defaultdict

def analyze_production_suggestions(script_text: str) -> Dict:
    analysis = {
        "scheduling": {
            "estimated_days": 0,
            "scene_groupings": [],
            "location_groupings": [],
            "time_of_day_groupings": []
        },
        "crew_requirements": {
            "departments": [],
            "special_crew": []
        },
        "logistics": {
            "location_considerations": [],
            "equipment_logistics": [],
            "talent_logistics": []
        },
        "safety_considerations": [],
        "production_challenges": [],
        "optimization_suggestions": []
    }
    
    # Extract and analyze scenes
    scenes = extract_scenes(script_text)
    
    # Analyze scheduling
    analyze_scheduling(analysis, scenes)
    
    # Analyze crew requirements
    analyze_crew_requirements(analysis, scenes, script_text)
    
    # Analyze logistics
    analyze_logistics(analysis, scenes)
    
    # Analyze safety considerations
    analyze_safety(analysis, scenes, script_text)
    
    # Identify production challenges
    identify_challenges(analysis, scenes, script_text)
    
    # Generate optimization suggestions
    generate_optimization_suggestions(analysis)
    
    return analysis

def extract_scenes(script_text: str) -> List[Dict]:
    scenes = []
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

def analyze_scheduling(analysis: Dict, scenes: List[Dict]):
    # Group scenes by location
    location_groups = defaultdict(list)
    time_groups = defaultdict(list)
    
    for i, scene in enumerate(scenes):
        location_groups[scene['location']].append(i + 1)
        time_groups[scene['time']].append(i + 1)
    
    # Estimate shooting days
    total_scenes = len(scenes)
    estimated_days = max(round(total_scenes / 5), 1)  # Assume average of 5 scenes per day
    
    analysis["scheduling"]["estimated_days"] = estimated_days
    
    # Create location groupings
    for location, scene_numbers in location_groups.items():
        analysis["scheduling"]["location_groupings"].append({
            "location": location,
            "scene_numbers": scene_numbers,
            "suggestion": f"Shoot scenes {', '.join(map(str, scene_numbers))} together at {location}"
        })
    
    # Create time of day groupings
    for time, scene_numbers in time_groups.items():
        analysis["scheduling"]["time_of_day_groupings"].append({
            "time": time,
            "scene_numbers": scene_numbers,
            "suggestion": f"Group scenes {', '.join(map(str, scene_numbers))} for {time.lower()} shoots"
        })

def analyze_crew_requirements(analysis: Dict, scenes: List[Dict], script_text: str):
    # Standard departments
    departments = [
        {
            "name": "Camera",
            "core_crew": ["DP", "Camera Operator", "1st AC", "2nd AC"],
            "required": True
        },
        {
            "name": "Lighting",
            "core_crew": ["Gaffer", "Best Boy", "Electricians"],
            "required": True
        },
        {
            "name": "Sound",
            "core_crew": ["Sound Mixer", "Boom Operator"],
            "required": True
        },
        {
            "name": "Art",
            "core_crew": ["Production Designer", "Art Director", "Set Decorator"],
            "required": True
        }
    ]
    
    # Check for special requirements
    special_crew = []
    
    # Check for stunts
    if re.search(r'fight|explosion|chase|stunt|fall', script_text, re.IGNORECASE):
        special_crew.append({
            "role": "Stunt Coordinator",
            "reason": "Action sequences detected"
        })
    
    # Check for special effects
    if re.search(r'effect|CGI|VFX|explosion|fire|rain', script_text, re.IGNORECASE):
        special_crew.append({
            "role": "Special Effects Supervisor",
            "reason": "Special effects required"
        })
    
    # Check for period pieces
    if re.search(r'century|period|historical|era|ancient|medieval', script_text, re.IGNORECASE):
        special_crew.append({
            "role": "Historical Consultant",
            "reason": "Period-specific content detected"
        })
    
    analysis["crew_requirements"]["departments"] = departments
    analysis["crew_requirements"]["special_crew"] = special_crew

def analyze_logistics(analysis: Dict, scenes: List[Dict]):
    location_considerations = []
    equipment_logistics = []
    talent_logistics = []
    
    # Analyze locations
    unique_locations = set()
    for scene in scenes:
        unique_locations.add(scene['location'])
        
        # Indoor/outdoor considerations
        if scene['location_type'] == 'EXT.':
            location_considerations.append({
                "location": scene['location'],
                "consideration": "Weather contingency plan needed for exterior location",
                "suggestion": "Have backup indoor location or weather coverage insurance"
            })
        
        # Time of day considerations
        if scene['time'] in ['DAWN', 'DUSK']:
            location_considerations.append({
                "location": scene['location'],
                "consideration": f"Limited shooting time for {scene['time'].lower()} scene",
                "suggestion": "Schedule minimal setups during magic hour"
            })
    
    # Equipment logistics
    if len(unique_locations) > 1:
        equipment_logistics.append({
            "type": "Transportation",
            "requirement": "Equipment trucks needed for multiple locations",
            "suggestion": "Schedule locations to minimize company moves"
        })
    
    # Add to analysis
    analysis["logistics"]["location_considerations"] = location_considerations
    analysis["logistics"]["equipment_logistics"] = equipment_logistics
    analysis["logistics"]["talent_logistics"] = talent_logistics

def analyze_safety(analysis: Dict, scenes: List[Dict], script_text: str):
    safety_considerations = []
    
    # Check for dangerous scenes
    dangerous_elements = {
        r'fight|combat': "Combat safety coordinator required",
        r'fire|explosion': "Fire safety officer and permits required",
        r'water|underwater|swimming': "Water safety team required",
        r'height|roof|cliff': "Height safety equipment and coordinator required",
        r'vehicle|car chase': "Vehicle safety coordinator required"
    }
    
    for pattern, consideration in dangerous_elements.items():
        if re.search(pattern, script_text, re.IGNORECASE):
            safety_considerations.append({
                "type": "Safety Personnel",
                "consideration": consideration,
                "priority": "High"
            })
    
    # Check for night shoots
    night_scenes = [scene for scene in scenes if scene['time'] == 'NIGHT']
    if night_scenes:
        safety_considerations.append({
            "type": "Night Shooting",
            "consideration": "Additional lighting and safety personnel for night shoots",
            "priority": "Medium"
        })
    
    analysis["safety_considerations"] = safety_considerations

def identify_challenges(analysis: Dict, scenes: List[Dict], script_text: str):
    challenges = []
    
    # Check for complex scenes
    if re.search(r'crowd|extras|background', script_text, re.IGNORECASE):
        challenges.append({
            "type": "Crowd Management",
            "description": "Scenes requiring large number of extras",
            "suggestion": "Consider hiring crowd coordinator and additional ADs"
        })
    
    # Check for weather-dependent scenes
    weather_scenes = re.findall(r'rain|snow|storm|sunny|weather', script_text, re.IGNORECASE)
    if weather_scenes:
        challenges.append({
            "type": "Weather Dependency",
            "description": "Scenes requiring specific weather conditions",
            "suggestion": "Plan for weather contingencies and consider VFX alternatives"
        })
    
    # Check for complex locations
    complex_locations = re.findall(r'restaurant|hospital|school|public', script_text, re.IGNORECASE)
    if complex_locations:
        challenges.append({
            "type": "Location Permissions",
            "description": "Scenes in complex or public locations",
            "suggestion": "Start location scouting and permitting process early"
        })
    
    analysis["production_challenges"] = challenges

def generate_optimization_suggestions(analysis: Dict):
    suggestions = []
    
    # Schedule optimization
    if analysis["scheduling"]["location_groupings"]:
        suggestions.append({
            "category": "Scheduling",
            "suggestion": "Group scenes by location to minimize company moves",
            "benefit": "Reduces production time and transportation costs"
        })
    
    # Time optimization
    if any(g["time"] in ["DAWN", "DUSK"] for g in analysis["scheduling"]["time_of_day_groupings"]):
        suggestions.append({
            "category": "Timing",
            "suggestion": "Schedule magic hour scenes on separate days",
            "benefit": "Maximizes limited natural light windows"
        })
    
    # Resource optimization
    if analysis["crew_requirements"]["special_crew"]:
        suggestions.append({
            "category": "Crew Planning",
            "suggestion": "Schedule scenes requiring special crew members together",
            "benefit": "Minimizes specialty crew hiring days"
        })
    
    analysis["optimization_suggestions"] = suggestions

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python suggestions_analyzer.py <script_file>")
        sys.exit(1)
        
    with open(sys.argv[1], 'r') as f:
        script_text = f.read()
        
    analysis = analyze_production_suggestions(script_text)
    print(json.dumps(analysis, indent=2))
