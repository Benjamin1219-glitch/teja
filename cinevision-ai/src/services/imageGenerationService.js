import axios from 'axios';

const STABLE_HORDE_API_KEY = process.env.REACT_APP_STABLE_HORDE_API_KEY;
const STABLE_HORDE_API_URL = 'https://stablehorde.net/api/v2';

export const generateImage = async (prompt) => {
  try {
    // First, submit the generation request
    const generateResponse = await axios.post(`${STABLE_HORDE_API_URL}/generate/async`, {
      prompt: prompt,
      params: {
        width: 512,
        height: 512,
        steps: 30,
        sampler_name: "k_euler_ancestral",
        cfg_scale: 7.5,
      },
      nsfw: false,
      trusted_workers: true,
      models: ["stable_diffusion"]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': STABLE_HORDE_API_KEY
      }
    });

    const { id } = generateResponse.data;

    // Poll for the status until the image is ready
    let status;
    do {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
      const statusResponse = await axios.get(`${STABLE_HORDE_API_URL}/generate/check/${id}`);
      status = statusResponse.data;
    } while (!status.done);

    // Get the result
    const resultResponse = await axios.get(`${STABLE_HORDE_API_URL}/generate/status/${id}`);
    
    if (resultResponse.data.generations && resultResponse.data.generations.length > 0) {
      return resultResponse.data.generations[0].img; // Base64 image data
    }
    
    throw new Error('No image generated');
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
