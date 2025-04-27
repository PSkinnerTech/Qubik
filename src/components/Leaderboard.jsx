import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react';
import { dryrun } from '@permaweb/aoconnect';
import { AO_QUIZ_PROCESS_ID } from '../config';

// Add a simple delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Connection warm-up delay in ms (1 second)
const WARM_UP_DELAY = 1000;

function Leaderboard() {
  const { connected } = useConnection();
  const address = useActiveAddress();
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ count: 0, totalParticipants: 0 });
  const [loadingText, setLoadingText] = useState('Initializing connection to AO...');
  const [connectionWarmed, setConnectionWarmed] = useState(false);
  
  // Function to format wallet addresses for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  // Initialize connection to AO network
  const initializeConnection = useCallback(async () => {
    try {
      setLoadingText('Preparing connection to AO network...');
      
      // Make a small "ping" request to warm up the connection
      await dryrun({
        process: AO_QUIZ_PROCESS_ID,
        tags: [{ name: 'Action', value: 'Ping' }],
      }).catch(() => {
        // Ignore errors from this ping, it's just to prime the connection
        console.log('Initial ping sent to warm up connection');
      });
      
      // Wait for connection to warm up
      setLoadingText('Waiting for AO network connection...');
      await delay(WARM_UP_DELAY);
      
      setConnectionWarmed(true);
      setLoadingText('Connection established, loading leaderboard data...');
    } catch (err) {
      console.error('Error initializing connection:', err);
      // Continue anyway, the fetch will retry if needed
      setConnectionWarmed(true);
    }
  }, []);

  // Function to fetch leaderboard data from AO
  const fetchLeaderboard = useCallback(async (isRetry = false) => {
    setIsLoading(true);
    
    if (!isRetry) {
      // Only reset error on fresh starts, not retries
      setError(null);
    }
    
    try {
      setLoadingText('Fetching leaderboard from AO process...');
      
      const result = await dryrun({
        process: AO_QUIZ_PROCESS_ID,
        tags: [{ name: 'Action', value: 'GetLeaderboard' }],
      });
      
      console.log('Leaderboard dryrun result:', result);
      
      if (result.Messages && result.Messages.length > 0 && result.Messages[0].Data) {
        try {
          const leaderboardData = JSON.parse(result.Messages[0].Data);
          console.log('Parsed leaderboard data:', leaderboardData);
          
          if (leaderboardData.leaderboard && Array.isArray(leaderboardData.leaderboard)) {
            setLeaderboard(leaderboardData.leaderboard);
            setStats({
              count: leaderboardData.count || leaderboardData.leaderboard.length,
              totalParticipants: leaderboardData.totalParticipants || leaderboardData.leaderboard.length
            });
          } else {
            throw new Error('Invalid leaderboard data format');
          }
        } catch (err) {
          console.error('JSON parse error:', err);
          throw new Error('Failed to parse leaderboard data');
        }
      } else {
        console.error('No valid messages in dryrun result:', result);
        throw new Error('No leaderboard data received');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(`Failed to fetch leaderboard: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to initialize connection on mount
  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  // Effect to fetch leaderboard after connection is warmed
  useEffect(() => {
    if (connectionWarmed) {
      fetchLeaderboard(false);
    }
  }, [connectionWarmed, fetchLeaderboard]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
        <div className="text-center">
          <div className="mb-3">{loadingText}</div>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
        <p className="mt-2 mb-4 text-sm">
          This could be due to network issues or the AO process taking longer than expected to respond.
        </p>
        <button 
          onClick={() => fetchLeaderboard(true)} // true indicates this is a retry
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">AO Quiz Leaderboard</h1>
      <p className="text-center text-gray-600 mb-8">
        Top {stats.count} scores out of {stats.totalParticipants} participants
      </p>
      
      {/* Your Current Position (if address is found) */}
      {connected && address && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Position</h2>
          {leaderboard.findIndex(entry => entry.userId === address) >= 0 ? (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <p className="font-medium">
                Rank: {leaderboard.findIndex(entry => entry.userId === address) + 1} of {stats.totalParticipants}
              </p>
              <p>
                Score: {leaderboard.find(entry => entry.userId === address)?.score || 0} / 
                {leaderboard.find(entry => entry.userId === address)?.total || 20}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">You haven't taken the quiz yet!</p>
          )}
        </div>
      )}
      
      {/* Leaderboard Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.userId} className={address === entry.userId ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {formatAddress(entry.userId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{entry.score}</span> / {entry.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(Number(entry.timestamp)).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No entries yet. Be the first to take the quiz!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => fetchLeaderboard(true)} // true indicates this is a retry
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Refresh Leaderboard
        </button>
      </div>
    </div>
  );
}

export default Leaderboard; 