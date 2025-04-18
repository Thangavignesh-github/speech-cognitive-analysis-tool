import React, { useState } from 'react';
import { FolderOpen, Upload, Check, AlertCircle } from 'lucide-react';

const DatasetInput = ({ onDatasetPathSubmit }) => {
  const [datasetPath, setDatasetPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datasetPath.trim()) {
      setUploadError(true);
      setErrorMessage('Please enter a valid dataset path');
      return;
    }

    setIsUploading(true);
    setUploadError(false);

    // Simulate API call for dataset validation
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      onDatasetPathSubmit(datasetPath);
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Dataset Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="datasetPath" className="block text-sm font-medium text-gray-700 mb-1">
            Dataset Path
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="datasetPath"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 p-2 border"
                placeholder="/path/to/dataset (contains audio and transcripts folders)"
                value={datasetPath}
                onChange={(e) => setDatasetPath(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white 
                ${isUploading ? 'bg-gray-600' : uploadSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Validated
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Validate Path
                </>
              )}
            </button>
          </div>
          
          {uploadError && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage}
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
            Specify the path to your dataset folder. The folder should contain 'audio' and 'transcripts' subfolders.
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Dataset Structure:</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
{`dataset/
├── audio/
│   ├── sample1.wav
│   └── sample2.wav
└── transcripts/
    ├── sample1.txt (optional)
    └── sample2.txt (optional)`}
          </pre>
        </div>
      </form>
    </div>
  );
};

export default DatasetInput;