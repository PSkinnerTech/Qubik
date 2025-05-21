// import React, { useState, useEffect, useRef, useCallback } from 'react'; // React not directly used
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchVideos } from '../services/aoService';
// import { Marquee } from 'magic-ui-react'; // Old import
import Marquee from './magicui/marquee'; // Corrected import path to local component

const MIN_LOADING_TIME = 2000; // Reduced for faster visual feedback during dev, can be 5000 for prod
const VIDEO_ITEM_WIDTH = 355; // px, keep in sync with style
const VIDEO_ITEM_GAP = 16; // px, equivalent to 1rem, keep in sync with marquee gap

const VideoCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const marqueeRef = useRef(null); // Ref for the Marquee component's scrollable div
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef(null);

  useEffect(() => {
    let dataFetchComplete = false;
    let timerExpired = false;

    const attemptSetLoadingFalse = () => {
      if (dataFetchComplete && timerExpired) {
        setIsLoading(false);
      }
    };

    const dataLoader = async () => {
      try {
        const videoData = await fetchVideos();
        setVideos(videoData);
        setError(null);
      } catch (err) {
        console.error("Failed to load videos for carousel:", err);
        setError(
          `Failed to load videos: ${err.message || 'Unknown error'}. Please try again later.`,
        );
        setVideos([]);
      } finally {
        dataFetchComplete = true;
        attemptSetLoadingFalse();
      }
    };

    setIsLoading(true);
    dataLoader();

    const timerId = setTimeout(() => {
      timerExpired = true;
      attemptSetLoadingFalse();
    }, MIN_LOADING_TIME);

    return () => {
      clearTimeout(timerId);
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleManualScroll = useCallback((direction) => {
    if (marqueeRef.current) {
      setIsManuallyScrolling(true);
      // Clear any existing timeout to reset the auto-resume period
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }

      const scrollAmount = (VIDEO_ITEM_WIDTH + VIDEO_ITEM_GAP) * direction;
      marqueeRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });

      // Set a timeout to resume automatic scrolling after a period of inactivity
      manualScrollTimeoutRef.current = setTimeout(() => {
        setIsManuallyScrolling(false);
      }, 2500); // Resume auto scroll after 2.5 seconds of no manual scroll
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10 h-[280px]"> 
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-10 p-4 bg-red-100 text-red-700 rounded-lg shadow-md text-center h-[280px]">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600 h-[280px]">
        No videos available at the moment.
      </p>
    );
  }

  return (
    <div className="relative flex h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <button 
        onClick={() => handleManualScroll(-1)} 
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 font-bold p-2 rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100"
        aria-label="Scroll Left"
      >
        &lt;
      </button>
      <Marquee 
        ref={marqueeRef} 
        pauseOnHover 
        className="[--duration:60s] [--gap:1rem]" 
        isManuallyScrolling={isManuallyScrolling}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-item mx-2 flex-shrink-0"
            style={{ width: `${VIDEO_ITEM_WIDTH}px`, height: '200px' }}
          >
            <h3
              className="text-sm font-semibold mb-1 text-center truncate"
              title={video.title}
            >
              {video.title}
            </h3>
            <iframe
              id={`odysee-iframe-${video.id}`}
              style={{ width: '100%', height: 'calc(100% - 24px)' }}
              src={video.embedUrl}
              allowFullScreen
              title={video.title}
              className="rounded-md shadow-lg"
            ></iframe>
          </div>
        ))}
      </Marquee>
      <button 
        onClick={() => handleManualScroll(1)} 
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 font-bold p-2 rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100"
        aria-label="Scroll Right"
      >
        &gt;
      </button>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white dark:from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white dark:from-background to-transparent"></div>
    </div>
  );
};

export default VideoCarousel; 