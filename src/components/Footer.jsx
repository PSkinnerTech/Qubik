import React from 'react';
import qubikLogo from '../assets/qubik.svg';

const Footer = () => {
  return (
    <footer className="py-6 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <a href="https://github.com/PSkinnerTech/Qubik" target="_blank" rel="noopener noreferrer">
            <img src={qubikLogo} alt="Qubik Logo" className="h-8" />
          </a>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a 
            href="https://github.com/PSkinnerTech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            Created by Patrick Skinner
          </a>
          
          <span className="hidden md:inline">•</span>
          
          <a 
            href="https://zerotoarweave.ar.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            This is a ZeroToArweave project
          </a>
          
          <span className="hidden md:inline">•</span>
          
          <a 
            href="https://github.com/PSkinnerTech/Qubik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
