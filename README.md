# QUBIK - AO Quiz App

QUBIK is a fully decentralized quiz application built on Arweave and AO. This demonstration app showcases how to build a permanent web application with a decentralized backend.

## Features

- 🧠 **Quiz System** - Multiple-choice quiz powered by AO's decentralized compute environment
- 🏆 **Leaderboard** - Global leaderboard storing scores on AO
- 🔗 **Decentralized Backend** - Utilizes AO as the backend for storing questions, processing answers, and maintaining scores
- 🌐 **Permanent Deployment** - Deployed on Arweave's permaweb for permanent availability
- 👤 **Wallet Integration** - Uses Arweave Wallet Kit for simple wallet connection
- 📝 **ArNS Integration** - Human-readable domain names through the AR.IO name system

## Technology Stack

- **Frontend**: React + Vite
- **Deployment**: ArDrive Turbo SDK
- **Name System**: AR.IO SDK
- **Backend**: AO Process (Lua)
- **Wallet Connection**: Arweave Wallet Kit

## Prerequisites

- Node.js 16+
- pnpm (recommended package manager)
- Arweave wallet (JSON keyfile)
- Turbo credits for deployment ([purchase here](https://turbo-topup.com))
- $ARIO tokens for ArNS ([purchase here](https://arns.app))
- AOS installed for AO process management

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/qubik-quiz-app.git
cd qubik-quiz-app
pnpm install
```

### 2. Setting Up the AO Backend Process

#### Install AOS (AO Operating System)

```bash
# Install AOS globally
npm install -g aos
```

#### Create a New AO Process

```bash
# Initialize a new AO process
aos create
```

This will output a Process ID. **Save this Process ID** as you'll need it for your frontend configuration.

#### Load the Quiz Process

1. Copy the Process ID from the previous step
2. Load the quiz.lua file into your process:

```bash
aos load <YOUR_PROCESS_ID> ./lua/quiz.lua
```

You should see a confirmation message that the process has been loaded with the quiz.lua code.

### 3. Configure Your Frontend

Update your AO Process ID in the frontend configuration:

```bash
# Edit the environment file
vi .env
```

Add or modify the following line:

```
VITE_AO_PROCESS_ID=<YOUR_PROCESS_ID>
```

### 4. Local Development

```bash
pnpm dev
```

Visit `http://localhost:5173` to see your app in action.

## Customizing the Quiz

The quiz questions and logic are stored in `lua/quiz.lua`. You can modify this file to change:

- Quiz questions and answer options
- The number of questions
- The scoring logic
- Leaderboard behavior

After making changes to the quiz.lua file, reload it to your AO process:

```bash
aos load <YOUR_PROCESS_ID> ./lua/quiz.lua
```

## Deployment to Arweave

### 1. Prepare Your Wallet

1. Export your wallet JSON file from [Wander](https://wander.app) (formerly ArConnect)
2. Place the wallet JSON file in the root of your project
3. Rename it to `wallet.json`

### 2. Build and Deploy

```bash
# Build the application
pnpm build

# Deploy to Arweave
pnpm run deploy
```

After successful deployment, you'll receive a **Transaction ID** (manifest ID). **Save this ID** as you'll need it for the next steps.

> ⚠️ **Note**: You must have sufficient Turbo credits in your wallet for deployment. Purchase them at [turbo-topup.com](https://turbo-topup.com) if needed.

### 3. Setting Up Your ArNS Name

#### Option 1: Setting a Base ArNS Name

1. Purchase an ArNS name from [arns.app](https://arns.app) (requires $ARIO tokens)
2. From the ArNS app, find your name's Process ID (under Manage Assets → Settings)
3. Edit `scripts/setBaseArns.js`:
   - Update the `processId` value to your ArNS Process ID
   - Ensure the `manifest.id` is correctly read from your deployment

4. Run the command:
```bash
pnpm run set-base
```

Your app will now be accessible at `https://{your-name}.ar.io`

#### Option 2: Setting an Undername

1. Complete the base name setup above
2. Edit `scripts/setUndername.js`:
   - Update the `processId` to your ArNS Process ID
   - Set the `undername` value (default is "quiz")
   - Update the `manifestId` to your deployment Transaction ID

3. Run:
```bash
pnpm run set-undername
```

Your app will now be accessible at `https://{undername}_{your-name}.ar.io`

## Understanding the Application Architecture

### Frontend (React/Vite)

The frontend is responsible for:
- Displaying the quiz interface
- Connecting to user wallets
- Sending answers to the AO process
- Displaying scores and leaderboard

### Backend (AO Process)

The AO process (`quiz.lua`) handles:
- Storing quiz questions and correct answers
- Processing user submissions
- Calculating and storing scores
- Generating the leaderboard

### Data Flow

1. User connects their Arweave wallet
2. Frontend fetches questions from the AO process
3. User submits answers
4. AO process validates answers and calculates score
5. Score is stored in the AO process state
6. Leaderboard is updated with the new score

## Scripts Reference

- `pnpm dev` - Run local development server
- `pnpm build` - Build for production
- `pnpm run deploy` - Deploy to Arweave
- `pnpm run set-base` - Set your base ArNS name
- `pnpm run set-undername` - Set an undername for your ArNS
- `pnpm run records` - View your ArNS records

## Important Notes

- Your wallet.json file contains your private keys - **NEVER commit it to version control**
- ArNS updates take a few minutes to propagate across the network
- Always keep your deployment Transaction IDs for future reference
- $ARIO tokens are required for any ArNS operations
- Turbo credits are required for deployment to Arweave

## Troubleshooting

- **Deployment Fails**: Check your Turbo credit balance
- **ArNS Updates Fail**: Verify your ArNS ownership and $ARIO balance
- **AO Process Issues**: Check process ID and ensure the Lua code was loaded correctly
- **Wallet Connection Issues**: Ensure the Wander extension is installed and accessible

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Arweave](https://arweave.org) - Permanent storage layer
- [AO](https://ao.arweave.dev) - Decentralized compute environment
- [AR.IO](https://ar.io) - Gateway and name system
- [ArDrive](https://ardrive.io) - Permanent storage solution
