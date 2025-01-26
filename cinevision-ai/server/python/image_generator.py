import torch
from diffusers import StableDiffusionPipeline
import os
from PIL import Image
import json

def generate_image_from_scene(scene_metadata, output_path):
    """Generate an image for a scene using Stable Diffusion"""
    # Initialize the pipeline
    model_id = "runwayml/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
    )
    
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
    
    # Construct the prompt based on scene metadata
    location = scene_metadata.get('location', '')
    time_of_day = scene_metadata.get('time_of_day', '')
    mood = scene_metadata.get('mood', 'neutral')
    description = ' '.join(scene_metadata.get('description', []))
    lighting = scene_metadata.get('panel_suggestions', {}).get('lighting', '')
    composition = scene_metadata.get('panel_suggestions', {}).get('composition', '')
    
    # Create a detailed prompt
    prompt = f"{location}, {time_of_day}. {description}"
    if lighting:
        prompt += f" {lighting}."
    if composition:
        prompt += f" {composition}."
    if mood != 'neutral':
        prompt += f" The scene has a {mood} atmosphere."
    
    # Add cinematographic quality keywords
    prompt += " Cinematic, high quality, detailed, film still"
    
    # Generate the image
    image = pipe(
        prompt,
        num_inference_steps=50,
        guidance_scale=7.5
    ).images[0]
    
    # Save the image
    image.save(output_path)
    
    # Save the prompt used
    prompt_path = output_path.rsplit('.', 1)[0] + '_prompt.txt'
    with open(prompt_path, 'w') as f:
        f.write(prompt)
    
    return prompt

def generate_storyboard_images(metadata_dir):
    """Generate images for all scenes in the storyboard"""
    # Create output directory if it doesn't exist
    os.makedirs(metadata_dir, exist_ok=True)
    
    # Process each metadata file
    for filename in sorted(os.listdir(metadata_dir)):
        if filename.endswith('_metadata.json'):
            metadata_path = os.path.join(metadata_dir, filename)
            image_path = os.path.join(
                metadata_dir,
                filename.replace('_metadata.json', '.png')
            )
            
            # Skip if image already exists
            if os.path.exists(image_path):
                continue
            
            # Load metadata
            with open(metadata_path, 'r') as f:
                scene_metadata = json.load(f)
            
            try:
                # Generate image
                prompt = generate_image_from_scene(scene_metadata, image_path)
                print(f"Generated image for scene {scene_metadata.get('scene_number', '?')}")
                print(f"Prompt used: {prompt}")
            except Exception as e:
                print(f"Error generating image for {filename}: {str(e)}")

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python image_generator.py <metadata_directory>")
        sys.exit(1)
    
    generate_storyboard_images(sys.argv[1])
