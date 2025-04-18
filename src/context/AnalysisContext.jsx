import React, { createContext, useContext, useState, useReducer } from 'react';

// Create the context
const AnalysisContext = createContext();

// Define the initial state
const initialState = {
  datasetPath: '',
  audioFiles: [],
  settings: {
    modelType: 'isolation_forest',
    contamination: 0.2,
    featureWeights: {
      hesitation_count: 1.0,
      pause_count: 1.0,
      speech_rate: 1.0,
      pitch_variability: 1.0,
      semantic_anomaly: 1.0,
      vague_word_count: 1.0,
      incomplete_sentence: 1.0,
      lost_words: 1.0
    },
    transcriptionModel: 'wav2vec2'
  },
  processing: {
    isProcessing: false,
    currentStep: 0,
    totalSteps: 5,
    stepName: '',
    progress: 0
  },
  results: null,
  error: null
};

// Define the reducer function
function analysisReducer(state, action) {
  switch (action.type) {
    case 'SET_DATASET_PATH':
      return {
        ...state,
        datasetPath: action.payload
      };
    case 'SET_AUDIO_FILES':
      return {
        ...state,
        audioFiles: action.payload
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    case 'START_PROCESSING':
      return {
        ...state,
        processing: {
          ...state.processing,
          isProcessing: true,
          currentStep: 1,
          stepName: 'Preprocessing Audio',
          progress: 0
        },
        error: null
      };
    case 'UPDATE_PROCESSING':
      return {
        ...state,
        processing: {
          ...state.processing,
          ...action.payload
        }
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        processing: {
          ...state.processing,
          isProcessing: false
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        processing: {
          ...state.processing,
          isProcessing: false
        }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Create a provider component
export const AnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  // Define actions
  const setDatasetPath = (path) => {
    dispatch({ type: 'SET_DATASET_PATH', payload: path });
  };

  const setAudioFiles = (files) => {
    dispatch({ type: 'SET_AUDIO_FILES', payload: files });
  };

  const updateSettings = (settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const startProcessing = () => {
    dispatch({ type: 'START_PROCESSING' });
    
    // Simulate processing steps
    simulateProcessing();
  };

  const updateProcessing = (progress) => {
    dispatch({ type: 'UPDATE_PROCESSING', payload: progress });
  };

  const setResults = (results) => {
    dispatch({ type: 'SET_RESULTS', payload: results });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  // Simulate processing steps for demo purposes
  const simulateProcessing = () => {
    const steps = [
      { step: 1, name: 'Preprocessing Audio' },
      { step: 2, name: 'Transcribing Audio' },
      { step: 3, name: 'Extracting Features' },
      { step: 4, name: 'Training Model' },
      { step: 5, name: 'Generating Results' }
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep >= steps.length) {
        // Processing complete, generate mock results
        const mockResults = generateMockResults();
        setResults(mockResults);
        return;
      }

      const step = steps[currentStep];
      let progress = 0;

      updateProcessing({
        currentStep: step.step,
        stepName: step.name,
        progress: progress
      });

      const progressInterval = setInterval(() => {
        progress += 5;
        updateProcessing({
          progress: progress
        });

        if (progress >= 100) {
          clearInterval(progressInterval);
          currentStep++;
          setTimeout(processStep, 500);
        }
      }, 200);
    };

    processStep();
  };

  // Generate mock results for demonstration
  const generateMockResults = () => {
    const mockFiles = state.audioFiles.length > 0 ? 
      state.audioFiles.map(file => file.name) : 
      ['sample1.wav', 'sample2.wav', 'sample3.wav', 'sample4.wav', 'sample5.wav'];
    
    return mockFiles.map((fileName, index) => {
      const isAtRisk = Math.random() > 0.7;
      
      return {
        id: `result-${index}`,
        file_name: fileName,
        risk_status: isAtRisk ? 'At Risk' : 'Normal',
        confidence: 0.7 + Math.random() * 0.25,
        key_indicators: isAtRisk ? 
          ['Hesitation', 'Semantic Anomaly', 'Slow Speech Rate'].slice(0, Math.floor(Math.random() * 3) + 1) : 
          ['Normal Speech Pattern'],
        features: {
          hesitation_count: Math.floor(Math.random() * 10),
          pause_count: Math.floor(Math.random() * 8),
          speech_rate: 2 + Math.random() * 2,
          pitch_variability: 800 + Math.random() * 300,
          semantic_anomaly: 0.1 + Math.random() * 0.2,
          vague_word_count: Math.floor(Math.random() * 3),
          incomplete_sentence: Math.random() > 0.8 ? 1 : 0,
          lost_words: Math.floor(Math.random() * 5)
        },
        transcription: "This is a sample transcription of speech that would normally be generated by the Wav2Vec2 model. In a real application, this would contain the actual transcribed content from the audio file.",
        analysis_notes: isAtRisk ? 
          [
            "Higher than normal hesitation frequency detected",
            "Semantic coherence is below average",
            "Speech patterns show potential cognitive indicators"
          ] : 
          [
            "Speech patterns within normal range",
            "No significant cognitive indicators detected"
          ]
      };
    });
  };

  // Create the value object for the provider
  const value = {
    state,
    setDatasetPath,
    setAudioFiles,
    updateSettings,
    startProcessing,
    updateProcessing,
    setResults,
    setError,
    reset
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Create a custom hook to use the analysis context
export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};