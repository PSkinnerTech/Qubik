// import React from 'react'; // React not directly used
import VideoCarousel from './VideoCarousel';

const LandingPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Explore Our Video Collection</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover insights, tutorials, and updates from our latest video content, streamed directly from AO.
        </p>
      </div>
      
      <VideoCarousel />

      {/* You can add more sections to the landing page here if needed */}
      <div className="mt-16 py-10 bg-slate-50 rounded-lg shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">How It Works</h2>
            <p className="text-lg text-gray-700 text-center">
                This video carousel showcases content stored and served via Arweave&apos;s decentralized computing layer, AO. 
                The video links are fetched from an AO process, demonstrating a fully decentralized content delivery approach.
            </p>
        </div>
      </div>
    </main>
  );
};

export default LandingPage; 