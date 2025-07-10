import React from 'react';
import { Trophy, User, Hash, Calendar } from 'lucide-react';
import { ProcessedResult } from '../types/data';

interface ResultsDisplayProps {
  results: ProcessedResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <Hash className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRankBadge = (index: number) => {
    const rank = index + 1;
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 2:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Top 10 Users by Rating Count</h2>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map((result, index) => (
          <div
            key={result.userId}
            className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 border transition-all hover:bg-white/10 ${
              index < 3 ? 'border-yellow-400/30' : 'border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex items-center space-x-2">
                  {getRankIcon(index)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getRankBadge(index)}`}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">
                      User ID: {result.userId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-300">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Age: {result.age}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.gender === 'M' 
                        ? 'bg-blue-600/30 text-blue-300' 
                        : 'bg-pink-600/30 text-pink-300'
                    }`}>
                      {result.gender === 'M' ? 'Male' : 'Female'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Count */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {result.ratingCount.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">ratings</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                  style={{
                    width: `${(result.ratingCount / results[0].ratingCount) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
        <h3 className="text-white font-medium mb-3">Processing Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Results</p>
            <p className="text-white font-bold">{results.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Highest Count</p>
            <p className="text-white font-bold">
              {results[0]?.ratingCount.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Average Count</p>
            <p className="text-white font-bold">
              {results.length > 0 
                ? Math.round(results.reduce((sum, r) => sum + r.ratingCount, 0) / results.length).toLocaleString()
                : 0
              }
            </p>
          </div>
          <div>
            <p className="text-gray-400">Total Ratings</p>
            <p className="text-white font-bold">
              {results.reduce((sum, r) => sum + r.ratingCount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;