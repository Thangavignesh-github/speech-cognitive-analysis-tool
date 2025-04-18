"""
Feature extraction module for speech cognitive analysis.

This module extracts various linguistic and acoustic features from audio files
and their transcriptions to detect potential cognitive indicators.
"""

import os
import argparse
import json
import numpy as np
import librosa
import re

def count_hesitations(text):
    """Count hesitation markers in the transcript."""
    hesitation_words = ['uh', 'um', 'er', 'ah', 'hmm', 'ehm']
    words = text.lower().split()
    return sum(1 for word in words if word in hesitation_words)

def count_pauses(text):
    """Count pause markers in the transcript."""
    # Count ellipses, sequences of periods/commas, and dashes as pauses
    pause_regex = r'\.{2,}|,{2,}|\.\.\.|--+'
    matches = re.findall(pause_regex, text)
    return len(matches)

def speech_rate(text, duration_sec):
    """Calculate speech rate (words per minute)."""
    if duration_sec <= 0:
        return 0
    words = [w for w in text.split() if w.strip()]
    return len(words) / (duration_sec / 60)

def calculate_pitch_variability(audio_path):
    """Calculate pitch variability from audio."""
    try:
        y, sr = librosa.load(audio_path, sr=None)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        
        # Get the most prominent pitches
        pitches_filtered = []
        for i in range(pitches.shape[1]):
            index = magnitudes[:, i].argmax()
            pitch = pitches[index, i]
            if pitch > 0:  # Filter out zero pitches
                pitches_filtered.append(pitch)
        
        if pitches_filtered:
            return np.std(pitches_filtered)
        return 0
    except Exception as e:
        print(f"Error calculating pitch variability: {e}")
        return 0

def count_vague_words(text):
    """Count vague or placeholder words."""
    vague_words = ['thing', 'stuff', 'something', 'somewhere', 'somehow', 'whatever', 'whatsoever']
    words = text.lower().split()
    return sum(1 for word in words if word in vague_words)

def is_incomplete_sentence(text):
    """Detect incomplete sentences."""
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    incomplete_count = 0
    for sentence in sentences:
        # Consider a sentence incomplete if it's too short or ends with certain words
        if (len(sentence.split()) < 3 or 
            re.search(r'\b(and|but|or|so|because|if|when)\s*$', sentence.strip())):
            incomplete_count += 1
    
    return 1 if incomplete_count > 0 else 0

def count_lost_words(text):
    """Count phrases indicating word finding difficulty."""
    lost_words_patterns = [
        r'\b(that thing|you know|like|what\'s it called|what do you call it)\b',
        r'\bI (can\'t remember|forgot|don\'t recall)\b'
    ]
    
    count = 0
    for pattern in lost_words_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        count += len(matches)
    
    return count

def calculate_semantic_anomaly(text):
    """
    Calculate semantic coherence or detect anomalies in speech.
    
    In a real implementation, this would use a language model or embedding similarity.
    For this example, we use a simplified heuristic based on sentence length variance.
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) < 2:
        return 0.1  # Low anomaly for very short text
    
    # Analyze sentence length variation
    lengths = [len(s.split()) for s in sentences]
    mean_length = np.mean(lengths)
    std_length = np.std(lengths)
    
    # Higher variance in sentence length can indicate semantic anomalies
    coefficient_of_variation = std_length / mean_length if mean_length > 0 else 0
    
    # Scale to a reasonable range (0.0 to 0.3)
    return min(0.3, max(0.0, coefficient_of_variation * 0.15))

def extract_features(audio_path, transcript_text=None):
    """
    Extract all features from audio file and transcript.
    
    Args:
        audio_path: Path to the audio file
        transcript_text: Optional transcript text; if None, attempts to find matching transcript file
        
    Returns:
        Dictionary of extracted features
    """
    # If transcript not provided, try to load it from a file
    if transcript_text is None:
        base_name = os.path.splitext(os.path.basename(audio_path))[0]
        transcript_path = os.path.join(os.path.dirname(audio_path), '..', 'transcripts', f"{base_name}.txt")
        
        if os.path.exists(transcript_path):
            with open(transcript_path, 'r') as f:
                transcript_text = f.read()
        else:
            print(f"Warning: No transcript found for {audio_path}")
            transcript_text = ""
    
    # Get audio duration
    try:
        y, sr = librosa.load(audio_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
    except Exception as e:
        print(f"Error loading audio: {e}")
        duration = 0
    
    # Extract features
    features = {
        "hesitation_count": count_hesitations(transcript_text),
        "pause_count": count_pauses(transcript_text),
        "speech_rate": speech_rate(transcript_text, duration),
        "pitch_variability": calculate_pitch_variability(audio_path),
        "semantic_anomaly": calculate_semantic_anomaly(transcript_text),
        "vague_word_count": count_vague_words(transcript_text),
        "incomplete_sentence": is_incomplete_sentence(transcript_text),
        "lost_words": count_lost_words(transcript_text)
    }
    
    return features

def process_dataset(dataset_path, output_file=None):
    """
    Process all audio files in a dataset directory and extract features.
    
    Args:
        dataset_path: Path to the dataset directory containing audio/ and transcripts/ folders
        output_file: Optional path to save the results as JSON
        
    Returns:
        List of dictionaries containing file info and extracted features
    """
    audio_dir = os.path.join(dataset_path, 'audio')
    
    if not os.path.exists(audio_dir):
        raise ValueError(f"Audio directory not found: {audio_dir}")
    
    results = []
    
    for filename in os.listdir(audio_dir):
        if filename.endswith('.wav'):
            audio_path = os.path.join(audio_dir, filename)
            base_name = os.path.splitext(filename)[0]
            
            # Try to find matching transcript
            transcript_path = os.path.join(dataset_path, 'transcripts', f"{base_name}.txt")
            transcript_text = None
            
            if os.path.exists(transcript_path):
                with open(transcript_path, 'r') as f:
                    transcript_text = f.read()
            
            # Extract features
            features = extract_features(audio_path, transcript_text)
            
            results.append({
                "file": filename,
                **features
            })
    
    # Save results if output file specified
    if output_file:
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract features from speech audio for cognitive analysis")
    parser.add_argument("--dataset", required=True, help="Path to dataset directory with audio/ and transcripts/ folders")
    parser.add_argument("--output", default="features.json", help="Output JSON file to save results")
    
    args = parser.parse_args()
    
    results = process_dataset(args.dataset, args.output)
    print(f"Processed {len(results)} files. Results saved to {args.output}")