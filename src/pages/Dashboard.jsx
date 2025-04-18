import React, { useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import DatasetInput from '../components/DatasetInput';
import AudioUploader from '../components/AudioUploader';
import AnalysisSettings from '../components/AnalysisSettings';
import ProcessingIndicator from '../components/ProcessingIndicator';
import AnalysisResults from '../components/AnalysisResults';
import { Play, AlertCircle, HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { 
    state, 
    setDatasetPath, 
    setAudioFiles, 
    updateSettings, 
    startProcessing,
    setResults 
  } = useAnalysis();
  const [showHelp, setShowHelp] = useState(false);

  const handleDatasetPathSubmit = (path) => {
    setDatasetPath(path);
  };

  const handleAudioUploaded = (files) => {
    setAudioFiles(files);
  };

  const handleSettingsChange = (settings) => {
    updateSettings(settings);
  };

  const handleStartAnalysis = () => {
    startProcessing();
  };

  const handleDownloadResults = () => {
    // In a real application, this would generate and download a CSV/JSON file
    console.log('Downloading results...');
    
    // Create a JSON blob and trigger download
    const jsonData = JSON.stringify(state.results, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognitive_analysis_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canStartAnalysis = state.datasetPath || state.audioFiles.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Speech Cognitive Analysis</h1>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">How to Use This Tool</h2>
          <ol className="list-decimal list-inside text-blue-700 space-y-2">
            <li>Provide the path to your dataset containing audio files and optional transcripts</li>
            <li>Or upload audio files directly using the file uploader</li>
            <li>Adjust analysis settings as needed for your specific use case</li>
            <li>Click "Start Analysis" to begin processing</li>
            <li>Review the results and download the analysis report</li>
          </ol>
          <p className="mt-3 text-sm text-blue-600">
            This tool uses unsupervised machine learning to analyze speech patterns and identify potential cognitive indicators.
          </p>
        </div>
      )}
      
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">An error occurred</h3>
            <p className="mt-1 text-sm text-red-700">{state.error}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DatasetInput onDatasetPathSubmit={handleDatasetPathSubmit} />
          <AudioUploader onAudioUploaded={handleAudioUploaded} />
          
          {canStartAnalysis && !state.processing.isProcessing && !state.results && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <button
                onClick={handleStartAnalysis}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Analysis
              </button>
            </div>
          )}
          
          {state.processing.isProcessing && (
            <ProcessingIndicator 
              currentStep={state.processing.currentStep}
              totalSteps={state.processing.totalSteps}
              stepName={state.processing.stepName}
              progress={state.processing.progress}
            />
          )}
        </div>
        
        <div>
          <AnalysisSettings onSettingsChange={handleSettingsChange} />
        </div>
      </div>
      
      {state.results && (
        <AnalysisResults 
          results={state.results} 
          onDownloadResults={handleDownloadResults}
        />
      )}
    </div>
  );
};

export default Dashboard;