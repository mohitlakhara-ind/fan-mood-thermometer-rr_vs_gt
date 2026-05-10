# IPL Fan Sentiment Analyzer (RR vs GT)

An AI-powered web application that acts as a Fan-Mood Thermometer for the Rajasthan Royals (RR) vs Gujarat Titans (GT) IPL match. It analyzes fan sentiment from tweets and delivers witty, cricket-commentator-style summaries using the Gemini 2.5 Flash API.

## Features
- **Real-time Sentiment Analysis**: Processes fan tweets and gauges the current mood for each team.
- **Witty Commentary**: Uses Gemini 2.5 Flash with a custom persona to generate cricket-commentator-style insights.
- **Secure Architecture**: Backend API proxy (`server.ts`) keeps the Gemini API key secure and off the client.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a dynamic, responsive experience.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, tsx
- AI: `@google/genai` (Gemini 2.5 Flash)

## Getting Started

### Prerequisites
- Node.js installed
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory (you can copy from `.env.example`) and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the Development Server**
   Start both the frontend Vite server and the backend API simultaneously:
   ```bash
   npm run dev
   ```

4. **Open the App**
   Navigate to the local URL provided in your terminal (usually `http://localhost:5173/`).

## Deployment
This project is containerized and ready to be deployed to **Google Cloud Run**. Ensure you set the `GEMINI_API_KEY` as a secret or environment variable in your Cloud Run service configuration.
