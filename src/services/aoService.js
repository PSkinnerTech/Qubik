import { dryrun } from '@permaweb/aoconnect';
import { AO_VIDEOS_PROCESS_ID, AO_NODES } from '../config';

// Select a gateway. Using the developer gateway as a start.
const GATEWAY_URL = AO_NODES.find(node => node.includes('ao.arweave.dev')) || AO_NODES[0];

/**
 * Fetches video data from the AO process.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of video objects.
 * @throws {Error} If fetching or parsing fails.
 */
export const fetchVideos = async () => {
  try {
    console.log(`Fetching videos from AO Process ID: ${AO_VIDEOS_PROCESS_ID} using Gateway: ${GATEWAY_URL}`);
    const result = await dryrun({
      process: AO_VIDEOS_PROCESS_ID,
      tags: [{ name: 'Action', value: 'GetVideos' }],
      gateway: GATEWAY_URL, // Explicitly set the gateway
    });

    console.log("Dryrun GetVideos result:", result);

    if (result.Messages && result.Messages.length > 0 && result.Messages[0].Data) {
      const jsonData = result.Messages[0].Data;
      try {
        const parsedVideos = JSON.parse(jsonData);
        if (Array.isArray(parsedVideos)) {
          console.log("Parsed videos:", parsedVideos);
          return parsedVideos;
        } else {
          console.error("Parsed video data is not an array:", parsedVideos);
          throw new Error("Invalid video data format received from AO.");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON from GetVideos:", jsonError, "Data:", jsonData);
        throw new Error("Received invalid data format for videos.");
      }
    } else if (result.Error) {
      console.error("Error from AO dryrun (GetVideos):", result.Error);
      let errorMessage = "Error fetching videos from AO.";
      if (typeof result.Error === 'string') {
        errorMessage = result.Error;
      } else if (typeof result.Error === 'object' && result.Error !== null) {
        // Try to extract a more specific message if available
        errorMessage = JSON.stringify(result.Error);
      }
      // Check for rate limit or common network errors in the error string
      if (errorMessage.toLowerCase().includes("too many requests") || errorMessage.includes("429")) {
          throw new Error("AO gateway is rate-limiting requests. Please try again in a few moments.");
      } else if (errorMessage.toLowerCase().includes("failed to fetch")) {
          throw new Error("Network error: Failed to fetch videos from AO. The gateway might be temporarily unavailable or check your internet connection.");
      }
      throw new Error(errorMessage);
    } else {
      console.error("No messages or data in dryrun result for GetVideos", result);
      throw new Error("No videos received from AO process.");
    }
  } catch (error) {
    console.error("Error in fetchVideos:", error);
    throw error; 
  }
};

// If you need to fetch quiz questions or other data from another process,
// you can add more functions here, e.g.:
// export const fetchQuizData = async () => { ... } 