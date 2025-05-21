import NavBar from './components/NavBar';
// import Quiz from './components/Quiz'; // Removed
// import Leaderboard from './components/Leaderboard'; // Removed
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
// import { useConnection } from '@arweave-wallet-kit/react'; // connected was not used
import { Routes, Route, Navigate } from 'react-router-dom'; // Link removed as it's no longer used here
import './App.css';

function App() {
  // const { connected } = useConnection(); // Removed as connected is not used

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Quiz and Leaderboard routes removed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
