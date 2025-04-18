import React from 'react';

const ProcessingIndicator = ({ currentStep, totalSteps, stepName, progress }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Processing Status</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-blue-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">Step {currentStep} of {totalSteps}</div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Step: {stepName}</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <StepIndicator 
          step={1} 
          title="Preprocessing Audio" 
          currentStep={currentStep} 
          completed={currentStep > 1}
          description="Converting audio to required format and normalizing"
        />
        <StepIndicator 
          step={2} 
          title="Transcribing Audio" 
          currentStep={currentStep} 
          completed={currentStep > 2}
          description="Converting speech to text using selected model"
        />
        <StepIndicator 
          step={3} 
          title="Extracting Features" 
          currentStep={currentStep} 
          completed={currentStep > 3}
          description="Analyzing speech patterns and linguistic features"
        />
        <StepIndicator 
          step={4} 
          title="Training Model" 
          currentStep={currentStep} 
          completed={currentStep > 4}
          description="Running unsupervised learning algorithms"
        />
        <StepIndicator 
          step={5} 
          title="Generating Results" 
          currentStep={currentStep} 
          completed={currentStep > 5}
          description="Creating visualizations and analysis report"
        />
      </div>
    </div>
  );
};

const StepIndicator = ({ step, title, description, currentStep, completed }) => {
  let status;
  
  if (completed) {
    status = "completed";
  } else if (step === currentStep) {
    status = "current";
  } else {
    status = "upcoming";
  }
  
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          status === "completed" ? "bg-green-100 text-green-600" :
          status === "current" ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-400"
        }`}>
          {status === "completed" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <span>{step}</span>
          )}
        </div>
      </div>
      <div className="ml-4">
        <h3 className={`text-sm font-medium ${
          status === "completed" ? "text-green-600" :
          status === "current" ? "text-blue-600" :
          "text-gray-500"
        }`}>
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export default ProcessingIndicator;