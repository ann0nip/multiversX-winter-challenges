const {
    UserSecretKey,
    UserSigner,
    Address,
    Transaction,
    TransactionPayload,
    TransactionComputer,
} = require('@multiversx/sdk-core');
const { ApiNetworkProvider } = require('@multiversx/sdk-network-providers');

// Load accounts object, in this case the results from the 3December challenge
const accountsObject = require('../3December/accounts_results.json');

// API provider for testnet
const provider = new ApiNetworkProvider('https://testnet-api.multiversx.com');

// Token details
const TOKEN_NAME = 'WINTER';
const TOKEN_TICKER = 'WINTER';
const TOKEN_SUPPLY = BigInt(100_000_000) * BigInt(10 ** 8); // 100 million with 8 decimals
const DECIMALS = 8;

// Address of the system contract for issuing tokens
const SYSTEM_SMART_CONTRACT_ADDRESS =
    'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

// Helper function: Convert string to hexadecimal
function stringToHex(str) {
    return Buffer.from(str, 'utf8').toString('hex');
}

// Helper function: Convert number to hexadecimal with even-length padding
function numberToHex(num) {
    let hex = num.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return hex;
}

// Function to issue a fungible token
async function issueToken(address, privateKeyHex) {
    try {
        // Initialize UserSecretKey and UserSigner
        console.log('Initializing UserSecretKey and UserSigner...');
        const secretKey = UserSecretKey.fromString(privateKeyHex);
        const signer = new UserSigner(secretKey);

        // Verify public address from the private key
        const generatedAddress = secretKey.generatePublicKey().toAddress();
        if (generatedAddress.bech32() !== address) {
            throw new Error(
                'The private key does not match the provided address.'
            );
        }
        console.log(`Address verified: ${generatedAddress.bech32()}`);

        // Fetch account nonce
        const account = await provider.getAccount(new Address(address));
        const nonce = account.nonce.valueOf();

        // Convert parameters to hexadecimal
        const tokenNameHex = stringToHex(TOKEN_NAME);
        const tokenTickerHex = stringToHex(TOKEN_TICKER);
        const tokenSupplyHex = numberToHex(TOKEN_SUPPLY);
        const decimalsHex = numberToHex(DECIMALS);

        // Build the payload
        const payload = new TransactionPayload(
            `issue@${tokenNameHex}@${tokenTickerHex}@${tokenSupplyHex}@${decimalsHex}`
        );

        // Create transaction
        const tx = new Transaction({
            nonce,
            value: '50000000000000000', // 0.05 EGLD in denomination
            receiver: new Address(SYSTEM_SMART_CONTRACT_ADDRESS), // Use the system contract address
            gasLimit: 150_000_000, // Adjusted gas limit
            data: payload,
            chainID: 'T', // Testnet chain ID
            sender: new Address(address),
        });

        // Compute bytes for signing
        const transactionComputer = new TransactionComputer();
        const serializedTransaction =
            transactionComputer.computeBytesForSigning(tx);

        // Sign the transaction
        console.log('Signing transaction...');
        const signature = await signer.sign(serializedTransaction);
        tx.signature = signature;

        // Verify signature
        console.log(
            `Signature generated: ${Buffer.from(signature).toString('hex')}`
        );

        // Send the transaction
        const txHash = await provider.sendTransaction(tx);
        console.log(`Token issued from ${address} with hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error(`Error issuing token for ${address}: ${error.message}`);
        throw error;
    }
}

// Function to process accounts and issue tokens
async function processAccounts() {
    for (const shardKey in accountsObject.accounts) {
        const accounts = accountsObject.accounts[shardKey];

        for (const account of accounts) {
            try {
                const txHash = await issueToken(
                    account.address,
                    account.privateKey
                );
                console.log(
                    `Transaction hash for ${account.address}: ${txHash}`
                );
            } catch (error) {
                console.error(
                    `Error processing ${account.address}: ${error.message}`
                );
            }
        }
    }
}

// Run the script - In this case, I ran the script three times to fulfill the challenge
processAccounts().catch((error) => {
    console.error('Error processing accounts:', error.message);
});
