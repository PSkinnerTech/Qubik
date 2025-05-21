import { ConnectButton, useConnection, useActiveAddress } from '@arweave-wallet-kit/react';
import { ARIO } from '@ar.io/sdk';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import qubikLogo from '../assets/qubik.svg'; // Removed Qubik logo

function NavBar() {
  const { connected /*, disconnect */ } = useConnection();
  const address = useActiveAddress();
  const location = useLocation();
  const [primaryName, setPrimaryName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function fetchPrimaryName() {
      if (connected && address) {
        setLoading(true);
        setCountdown(3);
        
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        try {
          const ario = ARIO.init();
          const response = await ario.getPrimaryName({
            address: address
          });
          setPrimaryName(response?.name || null);
        } catch (error) {
          console.error('Failed to fetch primary name:', error);
          setPrimaryName(null);
        } finally {
          clearInterval(timer);
          setLoading(false);
        }
      } else {
        setPrimaryName(null);
        setLoading(false);
      }
    }

    fetchPrimaryName();
  }, [connected, address]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex-shrink-0 -ml-3">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              {/* <img src={qubikLogo} alt="Qubik Logo" className="h-16 w-auto object-contain" /> */}
              <span className="font-bold text-xl text-gray-800">Video App</span> {/* Placeholder App Name */}
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
             <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
             >
                 Home
             </Link>
             {/* Quiz and Leaderboard links removed */}
          </div>

          <div className="flex items-center space-x-4">
             {connected && (
                <div className="hidden lg:block text-sm">
                     {loading ? (
                      <span className="text-gray-500 font-medium animate-pulse">
                        Loading name... {countdown > 0 ? `${countdown}s` : ''}
                      </span>
                    ) : primaryName ? (
                      <span className="text-gray-600 font-medium">
                        Name: <span className="text-gray-900 font-bold">{primaryName}</span>
                      </span>
                    ) : (
                      <a 
                        href="https://arns.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Set your primary ArNS name"
                        className="text-blue-500 hover:text-blue-600 text-xs"
                      >
                        Set ArNS Name
                      </a>
                    )}
                 </div>
             )}
            
             <div className="flex items-center space-x-2">
                 <ConnectButton 
                    profileModal={true}
                    showBalance={false}
                    showProfilePicture={true}
                    className="!py-1.5 !px-3 !text-sm !font-medium"
                 />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
