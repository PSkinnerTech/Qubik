-- AO Quiz Process

-- Load JSON library (standard in aos)
local json = require("json")

-- Initial State: Hardcoded questions and answers
Questions = {
  {
    question = "What is the primary purpose of AO?",
    options = {
      "Decentralized file storage",
      "A hyper-parallel computer",
      "A social media platform",
      "A cryptocurrency exchange"
    },
    correctAnswer = "A hyper-parallel computer",
    id = "q1"
  },
  {
    question = "Which language is primarily used for writing AO processes?",
    options = {
      "JavaScript",
      "Python",
      "Lua",
      "Rust"
    },
    correctAnswer = "Lua",
    id = "q2"
  },
  {
    question = "What is the native cryptocurrency of the Arweave network?",
    options = {
      "AR",
      "AWE",
      "ARW",
      "ARWE"
    },
    correctAnswer = "AR",
    id = "q3"
  },
  {
    question = "What does SPoRA stand for in the Arweave ecosystem?",
    options = {
      "Succinct Proofs of Random Access",
      "Shared Protocols of Replication Architecture",
      "Sustainable Proof of Restricted Access",
      "Sequential Processing of Random Assignments"
    },
    correctAnswer = "Succinct Proofs of Random Access",
    id = "q4"
  },
  {
    question = "What is the permaweb?",
    options = {
      "A decentralized version of the internet built on Arweave",
      "A private network for enterprise Arweave users",
      "A protocol for transferring AR tokens",
      "A web interface for accessing Arweave"
    },
    correctAnswer = "A decentralized version of the internet built on Arweave",
    id = "q5"
  },
  {
    question = "What consensus model does Arweave use?",
    options = {
      "Proof of Access (PoA)",
      "Proof of Work (PoW)",
      "Proof of Stake (PoS)",
      "Proof of Authority"
    },
    correctAnswer = "Proof of Access (PoA)",
    id = "q6"
  },
  {
    question = "What is SmartWeave?",
    options = {
      "A smart contract protocol for Arweave",
      "A physical device for Arweave mining",
      "A developer toolkit for Arweave",
      "The mainnet version of Arweave"
    },
    correctAnswer = "A smart contract protocol for Arweave",
    id = "q7"
  },
  {
    question = "What is AR.IO?",
    options = {
      "A decentralized network of Arweave gateways",
      "A stablecoin on Arweave",
      "A mining pool for Arweave",
      "The governing foundation of Arweave"
    },
    correctAnswer = "A decentralized network of Arweave gateways",
    id = "q8"
  },
  {
    question = "What is ArDrive?",
    options = {
      "A permanent, secure, always-on data storage application for a simple, one-time price",
      "A subscription-based cloud storage service built on Arweave",
      "A decentralized marketplace for buying and selling AR tokens",
      "A file compression tool for Arweave uploads"
    },
    correctAnswer = "A permanent, secure, always-on data storage application for a simple, one-time price",
    id = "q9"
  },
  {
    question = "What is ArNS?",
    options = {
      "Arweave Name Service",
      "Arweave Network Security",
      "Arweave Node System",
      "Arweave Native Storage"
    },
    correctAnswer = "Arweave Name Service",
    id = "q10"
  },
  {
    question = "What was the original name of the popular Arweave Wallet App, Wander?",
    options = {
      "ArConnect",
      "ArWeaveWallet",
      "ArVault",
      "Permastore"
    },
    correctAnswer = "ArConnect",
    id = "q11"
  },
  {
    question = "What special day of the year does the Arweave Launch Day (also known as the Arweave Birthday) share with?",
    options = {
      "The Publishing Day of the Popular book '1984'",
      "World Information Society Day",
      "International Blockchain Day",
      "International Open Data Day"
    },
    correctAnswer = "The Publishing Day of the Popular book '1984'",
    id = "q12"
  },
  {
    question = "How many Armstrongs equal 1 $AO?",
    options = {
      "1,000,000,000",
      "1,000,000",
      "1,000,000,000,000",
      "10,000,000"
    },
    correctAnswer = "1,000,000,000",
    id = "q13"
  },
  {
    question = "What is Arlink?",
    options = {
      "A web hosting platform for deploying and hosting websites permanently on Arweave",
      "A token bridge between Arweave and Ethereum",
      "An indexing service for Arweave transactions",
      "A decentralized exchange for trading AR tokens"
    },
    correctAnswer = "A web hosting platform for deploying and hosting websites permanently on Arweave",
    id = "q14"
  },
  {
    question = "What is an ANT in the Arweave ecosystem?",
    options = {
      "Arweave Node Transaction",
      "Arweave Name Token",
      "Arweave Network Token",
      "Automated Network Task"
    },
    correctAnswer = "Arweave Name Token",
    id = "q15"
  },
  {
    question = "What is 'aos' in the context of AO?",
    options = {
      "AO Operating System",
      "Arweave On-chain Services",
      "Autonomous Oracle System",
      "Atomic Operation Shell"
    },
    correctAnswer = "AO Operating System",
    id = "q16"
  },
  {
    question = "What popular movie series are the original AO tutorials created within the AO Cookbook based on?",
    options = {
      "The Matrix",
      "Star Wars",
      "Harry Potter",
      "Lord of the Rings"
    },
    correctAnswer = "The Matrix",
    id = "q17"
  },
  {
    question = "What does a cron message do in AO?",
    options = {
      "Scheduled execution of functions",
      "Cross-process communication",
      "Cryptographic verification",
      "Content retrieval optimization"
    },
    correctAnswer = "Scheduled execution of functions",
    id = "q18"
  },
  {
    question = "What is the \"Processes\" concept in AO?",
    options = {
      "Computational entities that communicate via message passing and can instantiate other processes, creating a holographic state",
      "Individual computational units running Lua code",
      "System utilities for monitoring performance",
      "Filtering mechanisms for data retrieval"
    },
    correctAnswer = "Computational entities that communicate via message passing and can instantiate other processes, creating a holographic state",
    id = "q19"
  },
  {
    question = "What sets data storage on Arweave apart from traditional cloud storage?",
    options = {
      "One-time payment for permanent storage",
      "Monthly subscription model",
      "Storage credit system",
      "Pay-per-retrieval model"
    },
    correctAnswer = "One-time payment for permanent storage",
    id = "q20"
  },
  {
    question = "What economic model does the AO token follow?",
    options = {
      "Bitcoin's economic model",
      "Ethereum's economic model",
      "Solana's economic model",
      "A unique model with no precedent"
    },
    correctAnswer = "Bitcoin's economic model",
    id = "q21"
  },
  {
    question = "What percentage of AO tokens are minted to AR token holders?",
    options = {
      "33.3%",
      "50%",
      "66.6%",
      "100%"
    },
    correctAnswer = "33.3%",
    id = "q22"
  },
  {
    question = "When will AO tokens become transferable?",
    options = {
      "February 8th, 2025",
      "June 18th, 2024",
      "December 31st, 2024",
      "They are already transferable"
    },
    correctAnswer = "February 8th, 2025",
    id = "q23"
  },
  {
    question = "How frequently are AO bridging rewards distributed?",
    options = {
      "Every 24 hours",
      "Every 5 minutes",
      "Every week",
      "Every month"
    },
    correctAnswer = "Every 24 hours",
    id = "q24"
  },
  {
    question = "What was the very first 3D game deployed on AO?",
    options = {
      "The Grid",
      "AO Racer",
      "Hyper Cube",
      "Digital Horizon"
    },
    correctAnswer = "The Grid",
    id = "q25"
  }
}

-- Store correct answers separately for easier checking
CorrectAnswers = {
  q1 = "A hyper-parallel computer",
  q2 = "Lua",
  q3 = "AR",
  q4 = "Succinct Proofs of Random Access",
  q5 = "A decentralized version of the internet built on Arweave",
  q6 = "Proof of Access (PoA)",
  q7 = "A smart contract protocol for Arweave",
  q8 = "A decentralized network of Arweave gateways",
  q9 = "A permanent, secure, always-on data storage application for a simple, one-time price",
  q10 = "Arweave Name Service",
  q11 = "ArConnect",
  q12 = "The Publishing Day of the Popular book '1984'",
  q13 = "1,000,000,000",
  q14 = "A web hosting platform for deploying and hosting websites permanently on Arweave",
  q15 = "Arweave Name Token",
  q16 = "AO Operating System",
  q17 = "The Matrix",
  q18 = "Scheduled execution of functions",
  q19 = "Computational entities that communicate via message passing and can instantiate other processes, creating a holographic state",
  q20 = "One-time payment for permanent storage",
  q21 = "Bitcoin's economic model",
  q22 = "33.3%",
  q23 = "February 8th, 2025",
  q24 = "Every 24 hours",
  q25 = "The Grid"
}

-- Store results: Mapping User Process ID -> { score = number, timestamp = number, total = number }
Results = Results or {}

-- Helper function to count items in Questions table
local function countQuestions()
  local count = 0
  for i, q in ipairs(Questions) do
    count = count + 1
  end
  return count
end

local totalQuestions = countQuestions()

-- Handlers for incoming messages
Handlers.add(
  "SubmitQuiz",
  Handlers.utils.hasMatchingTag("Action", "SubmitQuiz"),
  function (msg)
    local user = msg.From
    local answersTable = msg.Data -- Read directly from Data, expecting a Lua table
    local score = 0

    print("==== SubmitQuiz Handler Triggered (Processing Data Payload) ====")
    print("  From: " .. user)
    print("  Timestamp: " .. tostring(msg.Timestamp))

    -- Check if msg.Data is actually a table
    if type(answersTable) ~= "table" then
      print("Error: msg.Data is not a table. Received type: " .. type(answersTable))
      Handlers.utils.reply(json.encode({error = "Invalid data payload format. Expected JSON object."}))(msg)
      return
    end

    print("Processing answers table:")
    -- Iterate directly over the answersTable
    for qId, answer in pairs(answersTable) do
        -- Basic validation
        if type(qId) == "string" and type(answer) == "string" then
             print("  " .. qId .. ": " .. answer)
             if CorrectAnswers[qId] and CorrectAnswers[qId] == answer then
                score = score + 1
             end
        else
            print("  Warning: Skipping invalid entry in answers table - Key: " .. tostring(qId) .. ", Value type: " .. type(answer))
        end
    end

    -- Store the result
    Results[user] = {
      score = score,
      total = totalQuestions,
      timestamp = msg.Timestamp 
    }

    print("Score calculated for " .. user .. ": " .. score .. "/" .. totalQuestions)

    -- Send confirmation reply with the calculated score
    Handlers.utils.reply(json.encode({
      message = "Quiz submitted successfully!",
      score = score,
      total = totalQuestions,
      timestamp = msg.Timestamp
    }))(msg)
    
    print("==== SubmitQuiz Handler Finished (Processing Data Payload) ====")
  end
)

Handlers.add(
  "GetResult",
  Handlers.utils.hasMatchingTag("Action", "GetResult"),
  function (msg)
    local user = msg.From
    local userResult = Results[user]

    print("==== GetResult Handler Triggered ====")
    print("  From: " .. user)

    if userResult then
      print("  Result found for " .. user .. ": Score " .. (userResult.score or 'N/A') .. "/" .. (userResult.total or 'N/A'))
      Handlers.utils.reply(json.encode(userResult))(msg) 
    else
      print("  No result found for " .. user)
      Handlers.utils.reply(json.encode({ message = "No result found for this user." }))(msg)
    end
    print("==== GetResult Handler Finished ====")
  end
)

Handlers.add(
  "GetQuestions",
  Handlers.utils.hasMatchingTag("Action", "GetQuestions"),
  function(msg)
    print("==== GetQuestions Handler Triggered ====")
    print("  From: " .. msg.From)
    local questionsToSend = {}
    for _, q in ipairs(Questions) do
        local questionCopy = {}
        for k, v in pairs(q) do
            if k ~= "correctAnswer" then
                questionCopy[k] = v
            end
        end
        table.insert(questionsToSend, questionCopy)
    end
    Handlers.utils.reply(json.encode(questionsToSend))(msg)
    print("==== GetQuestions Handler Finished ====")
  end
)

-- New handler to fetch all results for leaderboard
Handlers.add(
  "GetLeaderboard",
  Handlers.utils.hasMatchingTag("Action", "GetLeaderboard"),
  function(msg)
    print("==== GetLeaderboard Handler Triggered ====")
    print("  From: " .. msg.From)

    -- Convert Results table (map) to an array for sorting
    local leaderboardEntries = {}
    for userId, result in pairs(Results) do
      table.insert(leaderboardEntries, {
        userId = userId,
        score = result.score,
        total = result.total,
        timestamp = result.timestamp
      })
    end

    -- Sort by score (highest first)
    table.sort(leaderboardEntries, function(a, b) 
      return a.score > b.score  -- Sort descending
    end)

    -- Limit to top 50 if needed
    local maxEntries = 50
    if #leaderboardEntries > maxEntries then
      local trimmedEntries = {}
      for i = 1, maxEntries do
        table.insert(trimmedEntries, leaderboardEntries[i])
      end
      leaderboardEntries = trimmedEntries
    end

    print("  Returning " .. #leaderboardEntries .. " leaderboard entries")
    Handlers.utils.reply(json.encode({
      leaderboard = leaderboardEntries,
      count = #leaderboardEntries,
      totalParticipants = countTableKeys(Results)
    }))(msg)
    print("==== GetLeaderboard Handler Finished ====")
  end
)

-- Helper function to count keys in a table
function countTableKeys(t)
  local count = 0
  for _ in pairs(t) do
    count = count + 1
  end
  return count
end

print("Quiz process loaded (" .. totalQuestions .. " questions). Waiting for messages...")
