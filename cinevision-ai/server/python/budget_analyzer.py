import re
import json
from typing import Dict, List, Tuple

def analyze_budget(script_text: str) -> Dict:
    # Initialize budget categories
    budget = {
        "cast": {"details": [], "total": 0},
        "locations": {"details": [], "total": 0},
        "props": {"details": [], "total": 0},
        "special_effects": {"details": [], "total": 0},
        "costumes": {"details": [], "total": 0},
        "equipment": {"details": [], "total": 0},
        "post_production": {"details": [], "total": 0}
    }
    
    # Extract scene locations
    locations = extract_locations(script_text)
    for loc in locations:
        cost = estimate_location_cost(loc)
        budget["locations"]["details"].append({
            "name": loc,
            "cost": cost,
            "days": 1  # Default to 1 day, can be adjusted
        })
        budget["locations"]["total"] += cost

    # Extract characters for cast budget
    characters = extract_characters(script_text)
    for char in characters:
        cost = estimate_cast_cost(char["importance"])
        budget["cast"]["details"].append({
            "name": char["name"],
            "role": char["importance"],
            "cost_per_day": cost,
            "days": 5  # Default to 5 days, can be adjusted
        })
        budget["cast"]["total"] += cost * 5

    # Analyze props and special effects
    props, effects = analyze_props_and_effects(script_text)
    
    for prop in props:
        cost = estimate_prop_cost(prop)
        budget["props"]["details"].append({
            "name": prop,
            "cost": cost
        })
        budget["props"]["total"] += cost

    for effect in effects:
        cost = estimate_effect_cost(effect)
        budget["special_effects"]["details"].append({
            "name": effect,
            "cost": cost
        })
        budget["special_effects"]["total"] += cost

    # Estimate costume costs based on characters
    for char in characters:
        cost = estimate_costume_cost(char["importance"])
        budget["costumes"]["details"].append({
            "character": char["name"],
            "cost": cost
        })
        budget["costumes"]["total"] += cost

    # Equipment costs (basic package)
    equipment_list = [
        ("Camera Package", 2000),
        ("Lighting Package", 1500),
        ("Sound Equipment", 1000),
        ("Grip Package", 1000)
    ]
    
    for item, cost in equipment_list:
        budget["equipment"]["details"].append({
            "name": item,
            "cost_per_day": cost,
            "days": 5  # Default to 5 days
        })
        budget["equipment"]["total"] += cost * 5

    # Post-production costs
    post_production_items = [
        ("Editing", 5000),
        ("Color Grading", 3000),
        ("Sound Mixing", 2000),
        ("Visual Effects", len(effects) * 1000)
    ]
    
    for item, cost in post_production_items:
        budget["post_production"]["details"].append({
            "name": item,
            "cost": cost
        })
        budget["post_production"]["total"] += cost

    # Calculate total budget
    total_budget = sum(category["total"] for category in budget.values())
    budget["total"] = total_budget

    return budget

def extract_locations(script_text: str) -> List[str]:
    # Look for scene headings (INT./EXT.)
    location_pattern = r'(INT\.|EXT\.|INT/EXT\.)\s([A-Z0-9\s\-\']+)[-\s]*?[—\-]'
    locations = set()
    
    for match in re.finditer(location_pattern, script_text, re.MULTILINE):
        location = match.group(2).strip()
        locations.add(location)
    
    return list(locations)

def extract_characters(script_text: str) -> List[Dict]:
    # Find character names (in ALL CAPS) followed by dialogue
    character_pattern = r'^([A-Z][A-Z\s\-\']+)$'
    characters = {}
    
    for match in re.finditer(character_pattern, script_text, re.MULTILINE):
        name = match.group(1).strip()
        if name not in ['INT', 'EXT', 'INT/EXT']:
            if name not in characters:
                characters[name] = 1
            else:
                characters[name] += 1

    # Categorize characters by importance based on dialogue count
    character_list = []
    for name, count in characters.items():
        if count > 20:
            importance = "lead"
        elif count > 10:
            importance = "supporting"
        else:
            importance = "minor"
            
        character_list.append({
            "name": name,
            "importance": importance,
            "dialogue_count": count
        })
    
    return character_list

def analyze_props_and_effects(script_text: str) -> Tuple[List[str], List[str]]:
    # Common props and effects keywords
    prop_keywords = [
        r'holds|holding|picks up|carrying|puts down|using|uses|with a|wearing',
        r'gun|sword|phone|book|car|vehicle|weapon|computer|laptop'
    ]
    
    effect_keywords = [
        r'explosion|fire|rain|storm|lightning|smoke|fog|snow',
        r'CGI|VFX|special effect|stunt|fight scene|chase scene'
    ]
    
    props = set()
    effects = set()
    
    # Search for props
    prop_pattern = '|'.join(prop_keywords)
    for match in re.finditer(prop_pattern, script_text, re.IGNORECASE):
        props.add(match.group(0).strip())
    
    # Search for effects
    effect_pattern = '|'.join(effect_keywords)
    for match in re.finditer(effect_pattern, script_text, re.IGNORECASE):
        effects.add(match.group(0).strip())
    
    return list(props), list(effects)

def estimate_location_cost(location: str) -> int:
    # Basic location cost estimation
    if any(word in location.lower() for word in ['house', 'apartment', 'room']):
        return 1000
    elif any(word in location.lower() for word in ['street', 'park', 'road']):
        return 2000
    elif any(word in location.lower() for word in ['restaurant', 'bar', 'cafe']):
        return 3000
    elif any(word in location.lower() for word in ['office', 'building']):
        return 4000
    else:
        return 2500  # Default cost

def estimate_cast_cost(importance: str) -> int:
    # Basic cast cost estimation per day
    if importance == "lead":
        return 1000
    elif importance == "supporting":
        return 500
    else:
        return 200

def estimate_prop_cost(prop: str) -> int:
    # Basic prop cost estimation
    if any(word in prop.lower() for word in ['car', 'vehicle']):
        return 1000
    elif any(word in prop.lower() for word in ['gun', 'weapon']):
        return 500
    elif any(word in prop.lower() for word in ['computer', 'laptop']):
        return 800
    else:
        return 200

def estimate_effect_cost(effect: str) -> int:
    # Basic special effect cost estimation
    if any(word in effect.lower() for word in ['explosion', 'fire']):
        return 5000
    elif any(word in effect.lower() for word in ['rain', 'storm', 'snow']):
        return 3000
    elif any(word in effect.lower() for word in ['fight scene', 'chase scene']):
        return 4000
    else:
        return 2000

def estimate_costume_cost(importance: str) -> int:
    # Basic costume cost estimation
    if importance == "lead":
        return 1000
    elif importance == "supporting":
        return 500
    else:
        return 200

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python budget_analyzer.py <script_file>")
        sys.exit(1)
        
    with open(sys.argv[1], 'r') as f:
        script_text = f.read()
        
    budget = analyze_budget(script_text)
    print(json.dumps(budget, indent=2))
