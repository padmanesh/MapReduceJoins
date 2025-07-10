import React, { useState, useCallback } from 'react';
import { Upload, Database, Users, BarChart3, FileText } from 'lucide-react';
import FileUploader from './components/FileUploader';
import DataProcessor from './components/DataProcessor';
import ResultsDisplay from './components/ResultsDisplay';
import { User, Rating, ProcessedResult } from './types/data';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUsersUpload = useCallback((userData: User[]) => {
    setUsers(userData);
    setResults([]); // Clear previous results
  }, []);

  const handleRatingsUpload = useCallback((ratingsData: Rating[]) => {
    setRatings(ratingsData);
    setResults([]); // Clear previous results
  }, []);

  const handleProcessComplete = useCallback((processedResults: ProcessedResult[]) => {
    setResults(processedResults);
    setIsProcessing(false);
  }, []);

  const handleProcessStart = useCallback(() => {
    setIsProcessing(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Database className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">MapReduce Data Processor</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A React implementation of Hadoop MapReduce concepts for processing user ratings data.
            Upload your data files and perform map-side joins to analyze user behavior.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Users Loaded</p>
                <p className="text-white text-2xl font-bold">{users.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Ratings Loaded</p>
                <p className="text-white text-2xl font-bold">{ratings.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Results Generated</p>
                <p className="text-white text-2xl font-bold">{results.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <Upload className="w-6 h-6 text-purple-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Data Upload</h2>
              </div>
              <FileUploader
                onUsersUpload={handleUsersUpload}
                onRatingsUpload={handleRatingsUpload}
              />
            </div>
          </div>

          {/* Data Processing Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <DataProcessor
              users={users}
              ratings={ratings}
              onProcessStart={handleProcessStart}
              onProcessComplete={handleProcessComplete}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <ResultsDisplay results={results} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>Converted from Hadoop MapReduce implementation by pxc130230</p>
          <p className="text-sm mt-2">Demonstrates map-side join operations and distributed data processing concepts</p>
        </div>
      </div>
    </div>
  );
}

export default App;