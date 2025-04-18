"""
Model training module for speech cognitive analysis.

This module handles the training of the speech analysis model using
the provided dataset of audio files and transcripts.
"""

import os
import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import numpy as np
import json
from extract_features import extract_features, process_dataset

class SpeechCognitiveModel:
    def __init__(self, model_path=None):
        # Initialize speech recognition model
        self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.speech_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
        
        # Initialize anomaly detection model
        self.anomaly_detector = IsolationForest(contamination=0.2, random_state=42)
        self.scaler = StandardScaler()
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def extract_audio_features(self, audio_path):
        """Extract features from audio file using the speech recognition model."""
        waveform, sample_rate = torchaudio.load(audio_path)
        
        # Resample if necessary
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)
        
        # Convert to mono if necessary
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        # Extract features using Wav2Vec2
        inputs = self.processor(waveform.squeeze().numpy(), sampling_rate=16000, return_tensors="pt")
        with torch.no_grad():
            outputs = self.speech_model(**inputs)
        
        # Get the hidden states
        hidden_states = outputs.hidden_states[-1]
        pooled_features = torch.mean(hidden_states, dim=1).squeeze().numpy()
        
        return pooled_features
    
    def train(self, dataset_path, save_path=None):
        """Train the model using the provided dataset."""
        print("Processing dataset...")
        features_data = process_dataset(dataset_path)
        
        # Extract features for training
        X_train = []
        for item in features_data:
            audio_path = os.path.join(dataset_path, 'audio', item['file'])
            features = list(item['features'].values())
            
            # Add speech recognition features
            speech_features = self.extract_audio_features(audio_path)
            features.extend(speech_features)
            
            X_train.append(features)
        
        X_train = np.array(X_train)
        
        print("Fitting scaler...")
        X_scaled = self.scaler.fit_transform(X_train)
        
        print("Training anomaly detector...")
        self.anomaly_detector.fit(X_scaled)
        
        if save_path:
            self.save_model(save_path)
            print(f"Model saved to {save_path}")
    
    def predict(self, audio_path, transcript_text=None):
        """Make predictions for a single audio file."""
        # Extract basic features
        features = extract_features(audio_path, transcript_text)
        feature_vector = list(features.values())
        
        # Add speech recognition features
        speech_features = self.extract_audio_features(audio_path)
        feature_vector.extend(speech_features)
        
        # Scale features
        X = self.scaler.transform([feature_vector])
        
        # Get prediction and score
        prediction = self.anomaly_detector.predict(X)[0]
        score = -self.anomaly_detector.score_samples(X)[0]  # Negative score for intuitive interpretation
        
        return {
            'risk_status': 'At Risk' if prediction == -1 else 'Normal',
            'confidence': float(score),
            'features': features
        }
    
    def save_model(self, path):
        """Save the trained model and scaler."""
        model_data = {
            'anomaly_detector': self.anomaly_detector,
            'scaler': self.scaler
        }
        torch.save(model_data, path)
    
    def load_model(self, path):
        """Load a trained model and scaler."""
        model_data = torch.load(path)
        self.anomaly_detector = model_data['anomaly_detector']
        self.scaler = model_data['scaler']

def train_model(dataset_path, model_save_path):
    """Train a new model using the provided dataset."""
    model = SpeechCognitiveModel()
    model.train(dataset_path, model_save_path)
    return model

def load_trained_model(model_path):
    """Load an existing trained model."""
    return SpeechCognitiveModel(model_path)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Train speech cognitive analysis model")
    parser.add_argument("--dataset", required=True, help="Path to dataset directory")
    parser.add_argument("--output", default="trained_model.pt", help="Path to save trained model")
    
    args = parser.parse_args()
    
    model = train_model(args.dataset, args.output)
    print("Model training complete!")