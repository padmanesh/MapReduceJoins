import React, { useCallback } from 'react';
import { Play, Loader2, Database, TrendingUp } from 'lucide-react';
import { User, Rating, ProcessedResult, UserRatingCount } from '../types/data';

interface DataProcessorProps {
  users: User[];
  ratings: Rating[];
  onProcessStart: () => void;
  onProcessComplete: (results: ProcessedResult[]) => void;
  isProcessing: boolean;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  users,
  ratings,
  onProcessStart,
  onProcessComplete,
  isProcessing
}) => {
  // Simulates the MapReduce map-side join operation
  const performMapSideJoin = useCallback(() => {
    onProcessStart();

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Step 1: Create user lookup map (simulates distributed cache)
        const userMap = new Map<number, User>();
        users.forEach(user => {
          userMap.set(user.userId, user);
        });

        // Step 2: Count ratings per user (simulates map phase)
        const userRatingCounts = new Map<number, number>();
        ratings.forEach(rating => {
          const currentCount = userRatingCounts.get(rating.userId) || 0;
          userRatingCounts.set(rating.userId, currentCount + 1);
        });

        // Step 3: Join user data with rating counts (simulates join operation)
        const joinedResults: ProcessedResult[] = [];
        userRatingCounts.forEach((count, userId) => {
          const user = userMap.get(userId);
          if (user) {
            joinedResults.push({
              userId: userId,
              age: user.age,
              gender: user.gender,
              ratingCount: count
            });
          }
        });

        // Step 4: Sort by rating count descending (simulates sorting)
        joinedResults.sort((a, b) => b.ratingCount - a.ratingCount);

        // Step 5: Take top 10 results (simulates cleanup phase)
        const topResults = joinedResults.slice(0, 10);

        onProcessComplete(topResults);
      } catch (error) {
        console.error('Error processing data:', error);
        onProcessComplete([]);
      }
    }, 2000); // Simulate processing time
  }, [users, ratings, onProcessStart, onProcessComplete]);

  const canProcess = users.length > 0 && ratings.length > 0 && !isProcessing;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-green-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">MapReduce Processing</h2>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mr-3">
            1
          </div>
          <span>Load users data into distributed cache</span>
        </div>
        <div className="flex items-center text-gray-300">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mr-3">
            2
          </div>
          <span>Map phase: Count ratings per user</span>
        </div>
        <div className="flex items-center text-gray-300">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mr-3">
            3
          </div>
          <span>Join user data with rating counts</span>
        </div>
        <div className="flex items-center text-gray-300">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mr-3">
            4
          </div>
          <span>Sort by rating count and return top 10</span>
        </div>
      </div>

      {/* Process Button */}
      <div className="text-center">
        <button
          onClick={performMapSideJoin}
          disabled={!canProcess}
          className={`inline-flex items-center px-8 py-4 rounded-lg font-medium transition-all ${
            canProcess
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Data...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start MapReduce Job
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {!canProcess && !isProcessing && (
        <div className="text-center">
          <p className="text-gray-400">
            {users.length === 0 && ratings.length === 0
              ? 'Please upload both users and ratings data files'
              : users.length === 0
              ? 'Please upload users data file'
              : 'Please upload ratings data file'}
          </p>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300">
              Processing {ratings.length.toLocaleString()} ratings from {users.length.toLocaleString()} users...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProcessor;