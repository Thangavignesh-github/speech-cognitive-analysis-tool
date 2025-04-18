"""
Analysis module for speech cognitive indicators.

This module uses unsupervised machine learning to detect potential
cognitive indicators in speech features.
"""

import argparse
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def load_features(features_file):
    """Load feature data from JSON file."""
    with open(features_file, 'r') as f:
        data = json.load(f)
    
    # Convert to DataFrame for easier processing
    return pd.DataFrame(data)

def preprocess_features(df, feature_weights=None):
    """
    Preprocess features for analysis.
    
    Args:
        df: DataFrame with features
        feature_weights: Optional dictionary of weights for features
        
    Returns:
        X: Preprocessed feature matrix
        feature_names: List of feature names
    """
    # Select numerical features
    feature_cols = [
        'hesitation_count', 'pause_count', 'speech_rate', 'pitch_variability',
        'semantic_anomaly', 'vague_word_count', 'incomplete_sentence', 'lost_words'
    ]
    
    # Ensure all selected features exist in the DataFrame
    feature_cols = [col for col in feature_cols if col in df.columns]
    
    # Scale features
    X = df[feature_cols].values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply weights if provided
    if feature_weights:
        weights = np.array([feature_weights.get(col, 1.0) for col in feature_cols])
        X_scaled = X_scaled * weights
    
    return X_scaled, feature_cols

def isolation_forest_analysis(X, contamination=0.2):
    """
    Perform Isolation Forest anomaly detection.
    
    Args:
        X: Feature matrix
        contamination: Expected proportion of outliers
        
    Returns:
        predictions: Array with -1 for outliers and 1 for inliers
        scores: Anomaly scores
    """
    model = IsolationForest(contamination=contamination, random_state=42)
    predictions = model.fit_predict(X)
    scores = model.decision_function(X)
    
    # Convert scores to a more intuitive scale (higher = more anomalous)
    scores = -scores
    
    return predictions, scores

def kmeans_analysis(X, n_clusters=2):
    """
    Perform K-means clustering.
    
    Args:
        X: Feature matrix
        n_clusters: Number of clusters
        
    Returns:
        labels: Cluster labels
        distances: Distance to cluster centers
    """
    model = KMeans(n_clusters=n_clusters, random_state=42)
    labels = model.fit_predict(X)
    
    # Calculate distance to assigned cluster center
    distances = np.zeros(X.shape[0])
    for i in range(X.shape[0]):
        distances[i] = np.linalg.norm(X[i] - model.cluster_centers_[labels[i]])
    
    return labels, distances

def determine_risk_cluster(df, labels):
    """Determine which cluster corresponds to 'at risk' samples."""
    # Use hesitation and semantic anomaly as heuristics
    cluster_risks = {}
    for cluster in np.unique(labels):
        cluster_df = df[labels == cluster]
        risk_score = (
            cluster_df['hesitation_count'].mean() +
            cluster_df['semantic_anomaly'].mean() * 10 +
            cluster_df['lost_words'].mean()
        )
        cluster_risks[cluster] = risk_score
    
    # Cluster with highest risk score is 'at risk'
    risk_cluster = max(cluster_risks, key=cluster_risks.get)
    return risk_cluster

def analyze_features(features_file, output_file=None, method='both', contamination=0.2, feature_weights=None):
    """
    Analyze features to detect cognitive indicators.
    
    Args:
        features_file: Path to JSON file with extracted features
        output_file: Optional path to save the results as JSON
        method: Analysis method ('isolation_forest', 'kmeans', or 'both')
        contamination: Expected proportion of outliers (for Isolation Forest)
        feature_weights: Optional dictionary of weights for features
        
    Returns:
        List of dictionaries containing file info and analysis results
    """
    # Load and preprocess features
    df = load_features(features_file)
    X, feature_names = preprocess_features(df, feature_weights)
    
    results = []
    
    # Isolation Forest analysis
    if method in ['isolation_forest', 'both']:
        predictions, scores = isolation_forest_analysis(X, contamination)
        df['isof_risk'] = predictions
        df['isof_score'] = scores
        df['isof_label'] = df['isof_risk'].apply(lambda x: 'At Risk' if x == -1 else 'Normal')
    
    # K-means analysis
    if method in ['kmeans', 'both']:
        labels, distances = kmeans_analysis(X)
        df['kmeans_cluster'] = labels
        df['kmeans_distance'] = distances
        
        # Determine which cluster corresponds to 'at risk'
        risk_cluster = determine_risk_cluster(df, labels)
        df['kmeans_label'] = df['kmeans_cluster'].apply(
            lambda x: 'At Risk' if x == risk_cluster else 'Normal')
    
    # Combine results if using both methods
    if method == 'both':
        df['risk_status'] = df.apply(
            lambda row: 'At Risk' if row['isof_label'] == 'At Risk' or row['kmeans_label'] == 'At Risk' else 'Normal',
            axis=1
        )
    elif method == 'isolation_forest':
        df['risk_status'] = df['isof_label']
    else:  # kmeans
        df['risk_status'] = df['kmeans_label']
    
    # Generate key indicators for at-risk samples
    for idx, row in df.iterrows():
        result = {
            'file': row['file'],
            'risk_status': row['risk_status'],
            'confidence': row['isof_score'] if 'isof_score' in row else 0.5
        }
        
        # Add raw features
        feature_data = {}
        for feature in feature_names:
            feature_data[feature] = row[feature]
        result['features'] = feature_data
        
        # Determine key indicators
        if row['risk_status'] == 'At Risk':
            indicators = []
            if row['hesitation_count'] > 3:
                indicators.append('Hesitation')
            if row['semantic_anomaly'] > 0.15:
                indicators.append('Semantic Anomaly')
            if row['speech_rate'] < 2.0:
                indicators.append('Slow Speech')
            if row['lost_words'] > 2:
                indicators.append('Word Finding Difficulty')
            if row['vague_word_count'] > 1:
                indicators.append('Vague Language')
            
            if not indicators:
                indicators = ['Statistical Anomaly']
            
            result['key_indicators'] = indicators
        else:
            result['key_indicators'] = ['Normal Speech Pattern']
        
        results.append(result)
    
    # Save results if output file specified
    if output_file:
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze speech features for cognitive indicators")
    parser.add_argument("--features", required=True, help="Path to JSON file with extracted features")
    parser.add_argument("--output", default="analysis_results.json", help="Output JSON file to save results")
    parser.add_argument("--method", default="both", choices=['isolation_forest', 'kmeans', 'both'],
                        help="Analysis method to use")
    parser.add_argument("--contamination", type=float, default=0.2, 
                        help="Expected proportion of outliers (for Isolation Forest)")
    
    args = parser.parse_args()
    
    results = analyze_features(
        args.features, 
        args.output, 
        method=args.method,
        contamination=args.contamination
    )
    
    print(f"Analysis complete. Results saved to {args.output}")
    print(f"Detected {sum(1 for r in results if r['risk_status'] == 'At Risk')} potential cognitive indicators out of {len(results)} files.")