import React, { useState, useEffect, useCallback } from 'react';
import { useConnection } from '@arweave-wallet-kit/react';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect';
import { AO_QUIZ_PROCESS_ID } from '../config';

// Add a simple delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Connection warm-up delay in ms (1 seconds)
const WARM_UP_DELAY = 1000;

// Shorter retry delay (3 seconds)
const RETRY_DELAY = 3000;

function Quiz() {
  const { connected, connect } = useConnection();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // Store answers as { qId: answerText }
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(''); // To show status during/after submission
  const [finalResult, setFinalResult] = useState(null); // Confirmed result from AO {score, total, timestamp}
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission process
  const [loadingText, setLoadingText] = useState('Initializing connection to AO...');
  const [connectionWarmed, setConnectionWarmed] = useState(false);

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
      setLoadingText('Connection established, loading quiz data...');
    } catch (err) {
      console.error('Error initializing connection:', err);
      // Continue anyway, the fetch will retry if needed
      setConnectionWarmed(true);
    }
  }, []);

  // Fetch questions from AO process
  const fetchQuestions = useCallback(async (isRetry = false) => {
    setIsLoading(true);
    
    if (!isRetry) {
      // Only reset the entire state on fresh starts, not retries
      setError(null);
      setQuizFinished(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setSelectedAnswer(null);
      setFinalResult(null);
      setSubmitStatus('');
      setIsSubmitting(false);
    }

    try {
      // If this is not a manual retry and connection isn't warmed yet,
      // wait for a shorter time
      if (!isRetry && !connectionWarmed) {
        setLoadingText('Preparing connection to AO...');
        await delay(RETRY_DELAY);
      }
      
      setLoadingText('Fetching questions from AO process...');
      
      const fetchResult = await dryrun({
        process: AO_QUIZ_PROCESS_ID,
        tags: [{ name: 'Action', value: 'GetQuestions' }],
      });

      console.log("Dryrun GetQuestions result:", fetchResult);

      if (fetchResult.Messages && fetchResult.Messages.length > 0 && fetchResult.Messages[0].Data) {
        const jsonData = fetchResult.Messages[0].Data;
        try {
          const parsedQuestions = JSON.parse(jsonData);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
              setQuestions(parsedQuestions);
          } else {
              console.error("Parsed questions data is not a valid array:", parsedQuestions);
              throw new Error("Invalid question data format received.");
          }
        } catch (jsonError) {
           console.error("Failed to parse JSON from GetQuestions:", jsonError, "Data:", jsonData);
           throw new Error("Received invalid data format for questions.");
        }
      } else {
        console.error("No messages or data in dryrun result for GetQuestions", fetchResult);
        throw new Error("No questions received from AO process.");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(`Failed to fetch quiz questions: ${err.message || 'Unknown error'}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, [connectionWarmed]);

  // Effect to initialize connection on mount
  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  // Effect to fetch questions after connection is warmed
  useEffect(() => {
    if (connectionWarmed) {
      fetchQuestions(false);
    }
  }, [connectionWarmed, fetchQuestions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    if (!currentQuestion) return;
    setSelectedAnswer(option);
    // Store the selected answer with its question ID
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  // Update pollForResult to expect the score object again
  const pollForResult = useCallback(async (messageId) => {
    if (!messageId) {
        setSubmitStatus("Failed to get submission message ID.");
        setIsSubmitting(false);
        return;
    }
    setSubmitStatus("Waiting for quiz result confirmation from AO...");
    try {
        const resultData = await result({ process: AO_QUIZ_PROCESS_ID, message: messageId });
        console.log("Poll Result Data:", resultData);
        if (resultData.Messages && resultData.Messages.length > 0) {
            const handlerReply = resultData.Messages[0];
            try {
                const parsedReply = JSON.parse(handlerReply.Data);
                // Check for the actual score data
                if (parsedReply && typeof parsedReply.score !== 'undefined') {
                    setFinalResult(parsedReply); // Store { message, score, total, timestamp }
                    setSubmitStatus("Quiz graded successfully!");
                } else if (parsedReply && parsedReply.error) {
                     setError(`Submission Error from AO: ${parsedReply.error}`);
                     setSubmitStatus("Submission failed.");
                } else {
                    console.warn("Unexpected reply structure:", parsedReply);
                    setSubmitStatus("Received unexpected result format.");
                }
            } catch (e) {
                console.error("Failed to parse reply message JSON:", e, handlerReply.Data);
                setSubmitStatus("Failed to read result message.");
            }
        } else if (resultData.Error) {
             console.error("Error during result polling:", resultData.Error);
             setError(`AO Error processing submission: ${resultData.Error}`);
             setSubmitStatus("Submission processing failed.");
        } else {
            console.warn("No messages/error in result:", resultData);
            setSubmitStatus("Could not confirm submission processing.");
        }
    } catch (error) {
        console.error("Error polling for result:", error);
        setError(`Error confirming result: ${error.message || 'Unknown error'}`);
        setSubmitStatus("Failed to confirm result.");
    } finally {
        setIsSubmitting(false); 
    }
  }, []);

  const handleSubmitQuiz = async () => {
    if (!connected) {
      setError("Please connect your wallet to submit the quiz.");
      return;
    }
    if (!window.arweaveWallet || typeof window.arweaveWallet.sign !== 'function') {
        setError("Wallet signature function (sign) is unavailable. Cannot submit.");
        return;
    }

    setIsSubmitting(true); 
    setSubmitStatus("Preparing submission...");
    setError(null); 
    setFinalResult(null); 

    try {
      const answersJson = JSON.stringify(userAnswers); // Stringify the answers
      console.log("Sending Answers JSON in Data field:", answersJson); // Log what we are sending
      const signer = createDataItemSigner(window.arweaveWallet);

      setSubmitStatus("Sending answers to AO via Data payload...");

      const messageId = await message({
        process: AO_QUIZ_PROCESS_ID,
        tags: [
          { name: 'Action', value: 'SubmitQuiz' },
          { name: 'Content-Type', value: 'application/json' } // Still useful to indicate data type
        ],
        data: answersJson, // JSON string as data payload
        signer: signer, 
      });

      console.log("SubmitQuiz message sent (Message ID):", messageId);
      setSubmitStatus(`Submission sent (${messageId.substring(0, 6)}...). Waiting for processing confirmation...`);

      await pollForResult(messageId);

    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError(`Failed to submit quiz: ${err.message || 'Unknown error'}`);
      setSubmitStatus("Submission failed.");
      setIsSubmitting(false); 
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null); // Reset selection for the next question

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Last question answered, mark as finished and trigger submission
      setQuizFinished(true);
      handleSubmitQuiz(); 
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="text-center mt-10 p-6">
        <div className="mb-3">{loadingText}</div>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (error && !quizFinished && !isSubmitting) { // Show setup/loading errors
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
            <p>Error: {error}</p>
            <p className="mt-2 text-sm">
              This could be due to network issues or the AO process taking longer than expected to respond.
            </p>
            <button 
                onClick={() => fetchQuestions(true)} // true indicates this is a retry
                className="mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
            >
                Retry Loading Questions
            </button>
        </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Submitted!</h2>
        <p className={`text-lg text-center mb-4 ${isSubmitting ? 'animate-pulse' : ''}`}>
            {submitStatus}
        </p>
        {error && <p className="text-red-600 text-center mb-4">Error: {error}</p>} 

        {/* Display final score once confirmed */} 
        {finalResult && typeof finalResult.score !== 'undefined' && (
             <div className="text-center p-4 bg-green-100 rounded mt-4">
                <h3 className="text-xl font-semibold">Your Confirmed Score:</h3>
                <p className="text-2xl font-bold">{finalResult.score} / {finalResult.total}</p>
                <p className="text-sm text-gray-600">Recorded at: {new Date(Number(finalResult.timestamp)).toLocaleString()}</p>
            </div>
        )}
        
        {!isSubmitting && (
             <button 
                onClick={() => fetchQuestions(true)} // true indicates this is a retry
                className="mt-6 w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
                Retake Quiz
            </button>
        )}
      </div>
    );
  }

  if (!currentQuestion) {
    // This might happen if questions array is empty after load or during reset
    return (
      <div className="text-center mt-10 p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
        <p>Waiting for questions or quiz reset...</p>
        <button 
          onClick={() => fetchQuestions(true)} // true indicates this is a retry
          className="mt-4 py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors"
        >
          Retry Loading Questions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {!connected && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md text-center">
              Connect your wallet to submit the quiz.
              <button onClick={connect} className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Connect</button>
          </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="text-lg mb-6">{currentQuestion.question}</p>
      
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isSubmitting} // Disable options during submission
            className={`
              block w-full text-left p-3 rounded-md border transition-colors duration-150
              ${selectedAnswer === option 
                ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-300'}
              ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}
            `}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer || !connected || isSubmitting} // Disable button during submission
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & Submit Quiz')}
      </button>
    </div>
  );
}

export default Quiz; 