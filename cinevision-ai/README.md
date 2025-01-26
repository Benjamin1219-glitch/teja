# CineVision AI

An AI-powered web application that generates storyboards from screenplays.

## Project Structure
```
cinevision-ai/
├── public/                  # Static assets
├── src/                     # React frontend code
├── server/                  # Backend server
│   ├── python/             # Python scripts
│   │   ├── requirements.txt    # Python dependencies
│   │   └── storyboard_generator.py
│   ├── temp/               # Temporary files
│   ├── package.json        # Server dependencies
│   └── server.js           # Express server
├── package.json            # Frontend dependencies
└── .env                    # Environment variables
```

## Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- Hugging Face API token

## Setup Instructions

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install Python dependencies:
   ```bash
   cd server/python
   pip3 install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   HF_API_TOKEN=your_hugging_face_api_token
   ```

5. Start the backend server:
   ```bash
   cd server
   HF_API_TOKEN=your_hugging_face_api_token node server.js
   ```

6. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Features
- Upload and parse screenplays
- Generate storyboards with AI
- Real-time progress updates
- Comic-style panel generation

## Technologies Used
- React
- Node.js/Express
- Python (for storyboard generation)
- Material-UI
- Hugging Face's Stable Diffusion XL
