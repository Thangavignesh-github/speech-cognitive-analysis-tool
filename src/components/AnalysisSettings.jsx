import React, { useState } from 'react';
import { Settings, Info } from 'lucide-react';

const AnalysisSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    
    onSettingsChange({
      ...settings,
      [name]: value
    });
  };

  const handleFeatureWeightChange = (feature, value) => {
    setSettings(prev => ({
      ...prev,
      featureWeights: {
        ...prev.featureWeights,
        [feature]: parseFloat(value)
      }
    }));
    
    onSettingsChange({
      ...settings,
      featureWeights: {
        ...settings.featureWeights,
        [feature]: parseFloat(value)
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Analysis Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anomaly Detection Model
          </label>
          <select
            name="modelType"
            value={settings.modelType}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="isolation_forest">Isolation Forest</option>
            <option value="kmeans">K-Means Clustering</option>
            <option value="both">Both Methods</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Isolation Forest is better at detecting outliers, while K-Means groups similar patterns.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contamination Factor
            <span className="ml-1 text-xs text-gray-500">(For Isolation Forest)</span>
          </label>
          <input
            type="range"
            name="contamination"
            min="0.01"
            max="0.5"
            step="0.01"
            value={settings.contamination}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0.01</span>
            <span className="text-xs font-medium text-blue-600">{settings.contamination}</span>
            <span className="text-xs text-gray-500">0.5</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Expected proportion of outliers in the dataset. Higher values detect more anomalies.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Feature Weights
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.featureWeights).map(([feature, weight]) => (
              <div key={feature} className="relative">
                <label className="block text-sm text-gray-600 mb-1 capitalize">
                  {feature.replace(/_/g, ' ')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={weight}
                  onChange={(e) => handleFeatureWeightChange(feature, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0</span>
                  <span className="text-xs font-medium text-blue-600">{weight.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">2</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Adjust feature weights to customize the importance of each characteristic in the analysis. 
              Higher weights make that feature more significant in detecting cognitive patterns.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transcription Model
          </label>
          <select
            name="transcriptionModel"
            value={settings.transcriptionModel}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="wav2vec2">Wav2Vec2 (Facebook AI)</option>
            <option value="whisper">Whisper (OpenAI)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select the model to use for speech-to-text transcription.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSettings;