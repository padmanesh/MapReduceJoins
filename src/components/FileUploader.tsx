import React, { useCallback } from 'react';
import { Upload, FileText, Users, Star } from 'lucide-react';
import { User, Rating } from '../types/data';

interface FileUploaderProps {
  onUsersUpload: (users: User[]) => void;
  onRatingsUpload: (ratings: Rating[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUsersUpload, onRatingsUpload }) => {
  const parseUsersFile = useCallback((content: string): User[] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
      const parts = line.split('::');
      return {
        userId: parseInt(parts[0]),
        gender: parts[1],
        age: parseInt(parts[2]),
        occupation: parseInt(parts[3]),
        zipCode: parts[4]
      };
    }).filter(user => !isNaN(user.userId));
  }, []);

  const parseRatingsFile = useCallback((content: string): Rating[] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
      const parts = line.split('::');
      return {
        userId: parseInt(parts[0]),
        movieId: parseInt(parts[1]),
        rating: parseInt(parts[2]),
        timestamp: parseInt(parts[3])
      };
    }).filter(rating => !isNaN(rating.userId));
  }, []);

  const handleFileUpload = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'users' | 'ratings'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (fileType === 'users') {
          const users = parseUsersFile(content);
          onUsersUpload(users);
        } else {
          const ratings = parseRatingsFile(content);
          onRatingsUpload(ratings);
        }
      } catch (error) {
        console.error(`Error parsing ${fileType} file:`, error);
        alert(`Error parsing ${fileType} file. Please check the format.`);
      }
    };
    reader.readAsText(file);
  }, [parseUsersFile, parseRatingsFile, onUsersUpload, onRatingsUpload]);

  const generateSampleData = useCallback(() => {
    // Generate sample users data
    const sampleUsers: User[] = [];
    for (let i = 1; i <= 100; i++) {
      sampleUsers.push({
        userId: i,
        gender: Math.random() > 0.5 ? 'M' : 'F',
        age: Math.floor(Math.random() * 50) + 18,
        occupation: Math.floor(Math.random() * 20) + 1,
        zipCode: String(Math.floor(Math.random() * 90000) + 10000)
      });
    }

    // Generate sample ratings data
    const sampleRatings: Rating[] = [];
    for (let i = 0; i < 1000; i++) {
      sampleRatings.push({
        userId: Math.floor(Math.random() * 100) + 1,
        movieId: Math.floor(Math.random() * 500) + 1,
        rating: Math.floor(Math.random() * 5) + 1,
        timestamp: Date.now() - Math.floor(Math.random() * 31536000000) // Random timestamp within last year
      });
    }

    onUsersUpload(sampleUsers);
    onRatingsUpload(sampleRatings);
  }, [onUsersUpload, onRatingsUpload]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Users File Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-purple-400 transition-colors">
          <div className="text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-2">Users Data</h3>
            <p className="text-gray-400 text-sm mb-3">Upload users.dat file</p>
            <input
              type="file"
              accept=".dat,.txt,.csv"
              onChange={(e) => handleFileUpload(e, 'users')}
              className="hidden"
              id="users-upload"
            />
            <label
              htmlFor="users-upload"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>

        {/* Ratings File Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-green-400 transition-colors">
          <div className="text-center">
            <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-2">Ratings Data</h3>
            <p className="text-gray-400 text-sm mb-3">Upload ratings.dat file</p>
            <input
              type="file"
              accept=".dat,.txt,.csv"
              onChange={(e) => handleFileUpload(e, 'ratings')}
              className="hidden"
              id="ratings-upload"
            />
            <label
              htmlFor="ratings-upload"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>
      </div>

      {/* Sample Data Button */}
      <div className="text-center">
        <button
          onClick={generateSampleData}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Generate Sample Data
        </button>
        <p className="text-gray-400 text-sm mt-2">
          Or click here to generate sample data for testing
        </p>
      </div>

      {/* File Format Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
        <h4 className="text-white font-medium mb-2">Expected File Formats:</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>users.dat:</strong> UserID::Gender::Age::Occupation::Zip-code</p>
          <p><strong>ratings.dat:</strong> UserID::MovieID::Rating::Timestamp</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;