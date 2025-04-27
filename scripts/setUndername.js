import fs from 'fs';
import { ANT, ArweaveSigner } from '@ar.io/sdk';

async function setUndername() {
    try {
        // Check for wallet.json
        if (!fs.existsSync('./wallet.json')) {
            throw new Error('wallet.json not found in the root of your project');
        }
        
        // Use the specific transaction ID provided
        const manifestId = 'YOUR MANIFEST ID / DEPLOYMENT TRANSACTION ID HERE';
        console.log(`Using manifest ID: ${manifestId}`);

        const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
        
        const ant = ANT.init({
            signer: new ArweaveSigner(jwk),
            processId: 'YOUR PROCESS ID HERE'
        });

        const { id: txId } = await ant.setUndernameRecord({
            undername: 'quiz',
            transactionId: manifestId,
            ttlSeconds: 900 // 15 minutes
        });

        console.log('\nUndername Record Update Complete! 🎉');
        console.log(`Transaction ID: ${txId}`);
        console.log(`Go to the undername page you deployed to to view it live.\n`);
    } catch (error) {
        console.error('Failed to update undername record:', error);
        process.exit(1);
    }
}

setUndername();
