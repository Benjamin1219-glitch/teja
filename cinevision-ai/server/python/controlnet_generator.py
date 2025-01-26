import torch
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
from controlnet_aux import CannyDetector, OpenposeDetector
from diffusers.utils import load_image
import numpy as np
import cv2
from PIL import Image, ImageDraw
import os
import json

class StoryboardImageGenerator:
    def __init__(self):
        # Initialize the canny edge detector
        self.canny = CannyDetector()
        
        # Initialize the pose detector
        self.pose = OpenposeDetector()
        
        # Load ControlNet models
        self.controlnet_canny = ControlNetModel.from_pretrained(
            "lllyasviel/sd-controlnet-canny",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        self.controlnet_pose = ControlNetModel.from_pretrained(
            "lllyasviel/sd-controlnet-openpose",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        # Initialize the pipeline
        self.pipe = StableDiffusionControlNetPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            controlnet=[self.controlnet_canny, self.controlnet_pose],
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        # Use more efficient attention
        self.pipe.enable_xformers_memory_efficient_attention()
        
        # Use better scheduler
        self.pipe.scheduler = UniPCMultistepScheduler.from_config(self.pipe.scheduler.config)
        
        # Move to GPU if available
        if torch.cuda.is_available():
            self.pipe = self.pipe.to("cuda")
    
    def create_composition_guide(self, scene_metadata, width=512, height=512):
        """Create a basic composition guide image based on scene description"""
        image = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(image)
        
        # Draw basic composition based on number of characters
        num_characters = len(scene_metadata.get('characters', []))
        
        if num_characters == 1:
            # Single character composition
            draw.rectangle([width//3, height//4, 2*width//3, 3*height//4], outline='black', width=2)
        elif num_characters == 2:
            # Two character composition
            draw.rectangle([width//4, height//4, width//2-20, 3*height//4], outline='black', width=2)
            draw.rectangle([width//2+20, height//4, 3*width//4, 3*height//4], outline='black', width=2)
        else:
            # Group composition
            draw.rectangle([width//6, height//3, 5*width//6, 3*height//4], outline='black', width=2)
        
        # Convert to numpy array for edge detection
        image_np = np.array(image)
        return image_np
    
    def create_pose_guide(self, scene_metadata, width=512, height=512):
        """Create a basic pose guide image based on scene description"""
        image = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(image)
        
        # Draw stick figures based on number of characters
        num_characters = len(scene_metadata.get('characters', []))
        
        def draw_stick_figure(x, y, size=100):
            # Head
            draw.ellipse([x-10, y-10, x+10, y+10], outline='black', width=2)
            # Body
            draw.line([x, y+10, x, y+50], fill='black', width=2)
            # Arms
            draw.line([x-30, y+30, x+30, y+30], fill='black', width=2)
            # Legs
            draw.line([x, y+50, x-20, y+90], fill='black', width=2)
            draw.line([x, y+50, x+20, y+90], fill='black', width=2)
        
        if num_characters == 1:
            # Single character in center
            draw_stick_figure(width//2, height//3)
        elif num_characters == 2:
            # Two characters facing each other
            draw_stick_figure(width//3, height//3)
            draw_stick_figure(2*width//3, height//3)
        else:
            # Group of characters
            spacing = width // (num_characters + 1)
            for i in range(num_characters):
                draw_stick_figure((i+1)*spacing, height//3)
        
        # Convert to numpy array
        image_np = np.array(image)
        return image_np
    
    def generate_image(self, scene_metadata, output_path):
        """Generate an image for a scene using ControlNet"""
        # Create control images
        composition_guide = self.create_composition_guide(scene_metadata)
        pose_guide = self.create_pose_guide(scene_metadata)
        
        # Process control images
        canny_image = self.canny(composition_guide)
        pose_image = self.pose(pose_guide)
        
        # Construct the prompt
        location = scene_metadata.get('location', '')
        time_of_day = scene_metadata.get('time_of_day', '')
        mood = scene_metadata.get('mood', 'neutral')
        description = ' '.join(scene_metadata.get('description', []))
        lighting = scene_metadata.get('panel_suggestions', {}).get('lighting', '')
        composition = scene_metadata.get('panel_suggestions', {}).get('composition', '')
        
        prompt = f"{location}, {time_of_day}. {description}"
        if lighting:
            prompt += f" {lighting}."
        if composition:
            prompt += f" {composition}."
        if mood != 'neutral':
            prompt += f" The scene has a {mood} atmosphere."
        
        # Add cinematographic quality keywords
        prompt += " Cinematic, high quality, detailed, film still, professional lighting"
        
        # Generate the image
        image = self.pipe(
            prompt,
            image=[canny_image, pose_image],
            num_inference_steps=30,
            guidance_scale=7.5,
            controlnet_conditioning_scale=[0.5, 0.5]
        ).images[0]
        
        # Save the image
        image.save(output_path)
        
        # Save the control images and prompt for reference
        base_path = output_path.rsplit('.', 1)[0]
        canny_image.save(f"{base_path}_canny.png")
        pose_image.save(f"{base_path}_pose.png")
        with open(f"{base_path}_prompt.txt", 'w') as f:
            f.write(prompt)
        
        return prompt

def generate_storyboard_images(metadata_dir):
    """Generate images for all scenes in the storyboard"""
    # Create output directory if it doesn't exist
    os.makedirs(metadata_dir, exist_ok=True)
    
    # Initialize the generator
    generator = StoryboardImageGenerator()
    
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
                prompt = generator.generate_image(scene_metadata, image_path)
                print(f"Generated image for scene {scene_metadata.get('scene_number', '?')}")
                print(f"Prompt used: {prompt}")
            except Exception as e:
                print(f"Error generating image for {filename}: {str(e)}")

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python controlnet_generator.py <metadata_directory>")
        sys.exit(1)
    
    generate_storyboard_images(sys.argv[1])
