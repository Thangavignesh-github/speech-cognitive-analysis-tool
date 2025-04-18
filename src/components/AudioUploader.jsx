import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, File, Play, Pause, Headphones } from 'lucide-react';

const AudioUploader = ({ onAudioUploaded }) => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const audioRefs = useRef({});

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const newFiles = [...files];
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.includes('audio')) {
          newFiles.push({
            file,
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            status: 'ready',
            progress: 0
          });
        }
      });
      
      setFiles(newFiles);
      if (onAudioUploaded) {
        onAudioUploaded(newFiles);
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...files];
      
      Array.from(e.target.files).forEach(file => {
        if (file.type.includes('audio')) {
          newFiles.push({
            file,
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            status: 'ready',
            progress: 0
          });
        }
      });
      
      setFiles(newFiles);
      if (onAudioUploaded) {
        onAudioUploaded(newFiles);
      }
    }
  };

  const removeFile = (id) => {
    const newFiles = files.filter(file => file.id !== id);
    setFiles(newFiles);
    if (onAudioUploaded) {
      onAudioUploaded(newFiles);
    }
  };

  const togglePlayPause = (id, index) => {
    if (currentPlayingIndex === index) {
      // Currently playing this file, so pause it
      audioRefs.current[id].pause();
      setCurrentPlayingIndex(null);
    } else {
      // Pause any currently playing audio
      if (currentPlayingIndex !== null && audioRefs.current[files[currentPlayingIndex]?.id]) {
        audioRefs.current[files[currentPlayingIndex].id].pause();
      }
      
      // Play the new file
      audioRefs.current[id].play();
      setCurrentPlayingIndex(index);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Audio Files</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-blue-500 mb-3" />
          <p className="text-gray-700 mb-2">Drag and drop audio files here</p>
          <p className="text-gray-500 text-sm mb-4">Or click to browse files</p>
          <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer transition-colors">
            <span>Select Files</span>
            <input 
              type="file" 
              multiple 
              accept="audio/*" 
              onChange={handleFileInputChange}
              className="hidden" 
            />
          </label>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Selected Files</h3>
          <ul className="space-y-3">
            {files.map((file, index) => (
              <li 
                key={file.id} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <Headphones className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => togglePlayPause(file.id, index)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {currentPlayingIndex === index ? (
                      <Pause className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Play className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  <audio 
                    ref={el => audioRefs.current[file.id] = el} 
                    src={URL.createObjectURL(file.file)}
                    onEnded={() => setCurrentPlayingIndex(null)}
                  />
                  
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;