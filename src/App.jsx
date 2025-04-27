import NavBar from './components/NavBar';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import { useConnection } from '@arweave-wallet-kit/react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

function App() {
  const { connected } = useConnection();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
                <h1 className="text-3xl font-bold mb-6 text-center">
                  Welcome to the AO Quiz App
                </h1>
                
                {connected ? (
                  <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold mb-4">
                      Connected Successfully! 🎉
                    </h2>
                    <p className="text-gray-600 mb-4">Navigate to the Quiz page to test your knowledge!</p>
                    
                    {/* Start Quiz button */}
                    <Link 
                      to="/quiz" 
                      className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Start Quiz
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6 text-center">
                    Connect your wallet to get started and take the quiz.
                  </p>
                )}
                
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-3xl w-full">
                  <h2 className="text-xl font-semibold mb-4 text-center">About This App</h2>
                  <p className="text-gray-700 mb-4">
                    This quiz app is fully deployed on Arweave and AO, showcasing the capabilities of permanent storage and decentralized computing.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-5 mb-2">Technologies Used:</h3>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                      <span className="font-medium">
                        <a href="https://docs.ardrive.io/docs/turbo/turbo-sdk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          ArDrive Turbo SDK
                        </a>
                      </span> - Enables permanent deployment of this application to the Arweave network, ensuring it remains accessible forever without requiring hosting servers.
                    </li>
                    <li>
                      <span className="font-medium">
                        <a href="https://docs.ar.io/ar-io-sdk/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          AR.IO SDK
                        </a>
                      </span> - Powers the human-readable ArNS domain name for this app and displays wallet owner primary names in the navigation bar.
                    </li>
                    <li>
                      <span className="font-medium">
                        <a href="https://cookbook_ao.arweave.dev/guides/aoconnect/aoconnect.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          aoconnect Library
                        </a>
                      </span> - Connects the front-end to AO, which serves as the quiz's backend for storing questions, processing answers, and maintaining the leaderboard.
                    </li>
                    <li>
                      <span className="font-medium">
                        <a href="https://vitejs.dev/guide/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Vite + React
                        </a>
                      </span> - Provides the reactive framework for building the interactive user interface.
                    </li>
                  </ul>
                  
                  <p className="mt-5 text-gray-700 text-sm italic">
                    This demonstrates how decentralized applications can be built today without traditional servers or databases, existing permanently on the permaweb.
                  </p>
                </div>
              </div>
            </main>
          } />
          <Route path="/quiz" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <Quiz />
            </main>
          } />
          <Route path="/leaderboard" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Leaderboard />
            </main>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
