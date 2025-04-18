import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const AnalysisResults = ({ results, onDownloadResults }) => {
  const [expandedFile, setExpandedFile] = useState(null);

  const toggleExpand = (fileId) => {
    if (expandedFile === fileId) {
      setExpandedFile(null);
    } else {
      setExpandedFile(fileId);
    }
  };

  // Prepare summary data for pie chart
  const summaryData = [
    { name: 'Normal', value: results.filter(r => r.risk_status === 'Normal').length },
    { name: 'At Risk', value: results.filter(r => r.risk_status === 'At Risk').length }
  ];
  
  const COLORS = ['#4ade80', '#f87171'];

  // Handle download of results
  const handleDownload = () => {
    if (onDownloadResults) {
      onDownloadResults();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Risk Assessment Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} files`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Feature Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="file_name" tick={false} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hesitation_count" name="Hesitations" fill="#8884d8" />
                <Bar dataKey="pause_count" name="Pauses" fill="#82ca9d" />
                <Bar dataKey="speech_rate" name="Speech Rate" fill="#ffc658" />
                <Bar dataKey="lost_words" name="Lost Words" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-700 mb-3">Individual File Analysis</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Indicators</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <React.Fragment key={result.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.file_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.risk_status === 'At Risk' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {result.risk_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(result.confidence * 100).toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {result.key_indicators.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleExpand(result.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center ml-auto"
                    >
                      {expandedFile === result.id ? (
                        <>
                          <span>Hide Details</span>
                          <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedFile === result.id && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Analysis</h4>
                          <div className="space-y-2">
                            {Object.entries(result.features).map(([feature, value]) => (
                              <div key={feature} className="flex justify-between">
                                <span className="text-sm text-gray-600 capitalize">{feature.replace(/_/g, ' ')}:</span>
                                <span className="text-sm font-medium text-gray-800">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription</h4>
                          <div className="bg-white p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                            <p className="text-sm text-gray-600">{result.transcription}</p>
                          </div>

                          <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Analysis Notes</h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {result.analysis_notes.map((note, index) => (
                                <li key={index}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisResults;