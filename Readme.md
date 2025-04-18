# Speech Cognitive Analysis Tool

A modern web application for analyzing speech patterns to detect potential cognitive indicators using unsupervised machine learning. This tool enables users to upload or select datasets of audio files, extract linguistic and acoustic features, and identify "at risk" speech patterns through interactive dashboards and visualizations.

---
# deployment link 
https://ornate-stroopwafel-7dad8f.netlify.app/


## Features

- **Audio Upload & Dataset Selection:** Upload individual audio files or specify a dataset folder containing audio and transcript files.
- **Speech-to-Text Transcription:** Supports Wav2Vec2 (Facebook AI) and Whisper (OpenAI) models (backend integration required).
- **Feature Extraction:** Calculates features such as hesitation count, pause count, speech rate, pitch variability, semantic anomaly, vague word count, incomplete sentences, and lost words.
- **Unsupervised Analysis:** Uses Isolation Forest and K-Means clustering to detect anomalies and group similar speech patterns.
- **Interactive Dashboard:** Visualizes results with pie charts, bar charts, and detailed tables. Allows users to expand for feature-level and transcription details.
- **Customizable Settings:** Adjust model type, contamination factor, and feature weights for tailored analysis.
- **Export Results:** Download analysis results as a JSON file.
- **Beautiful UI:** Built with React, Tailwind CSS, and Lucide React icons for a clean, modern look.

---

## Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (for backend ML processing, see below)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/speech-cognitive-analysis.git
   cd speech-cognitive-analysis/project
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Project Structure

```
project/
├── src/
│   ├── api/                # Frontend API stubs (replace with real backend calls)
│   ├── components/         # Reusable React components (Header, Footer, Dashboard, etc.)
│   ├── context/            # React context for analysis state management
│   ├── pages/              # Main dashboard page
│   ├── utils/              # Audio and feature utility functions
│   ├── python/             # Python backend scripts for ML processing
│   ├── index.css           # Tailwind CSS styles
│   └── main.jsx            # App entry point
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts / .js
└── ...
```

---

## Dataset Structure

Your dataset folder should look like:

```
dataset/
├── audio/
│   ├── sample1.wav
│   └── sample2.wav
└── transcripts/
    ├── sample1.txt (optional)
    └── sample2.txt (optional)
```

---

## Python Backend

The backend scripts for feature extraction and model training are in [`src/python/`](src/python/):

- `extract_features.py`: Extracts features from audio and transcripts.
- `analyze_features.py`: Runs unsupervised analysis (Isolation Forest, K-Means).
- `train_model.py`: (Optional) For advanced model training and prediction.

**Example usage:**
```sh
python src/python/extract_features.py --dataset /path/to/dataset --output features.json
python src/python/analyze_features.py --features features.json --output analysis_results.json
```

> **Note:** The frontend currently uses mock data and simulated processing. To enable real ML analysis, connect the frontend API stubs in `src/api/` to a Python backend (e.g., Flask, FastAPI) that runs these scripts.

---

## Customization

- **UI:** Built with React, Tailwind CSS, and Lucide React icons.
- **Charts:** Uses [Recharts](https://recharts.org/) for data visualization.
- **Settings:** Adjust model type, contamination, and feature weights in the dashboard.

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code with ESLint

---

## Credits

- **Speech-to-Text Models:** [Wav2Vec2 (Facebook AI)](https://huggingface.co/facebook/wav2vec2-base-960h), [Whisper (OpenAI)](https://github.com/openai/whisper)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Stock Photos:** [Pexels](https://www.pexels.com/)

---

## License

MIT License

---

## Screenshots

![image](https://github.com/user-attachments/assets/5d086394-bd0a-468b-8aa1-5efe306614df)
![image](https://github.com/user-attachments/assets/612011a9-3e79-48ec-9eb9-1fe5f709c96d)
![image](https://github.com/user-attachments/assets/eff51872-0ace-4a8c-9a88-7e40bc554e7e)
![image](https://github.com/user-attachments/assets/e39f7936-1eaa-4f33-9b15-0af5cb95d44e)
![image](https://github.com/user-attachments/assets/c19ba9ce-3464-4d47-b992-d6592713d3a3)
![image](https://github.com/user-attachments/assets/2425c602-346b-40d9-9386-b38cfb84cc9d)





---

## Contact

For questions or support, please open an issue or contact the project maintainer.
