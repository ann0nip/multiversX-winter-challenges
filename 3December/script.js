const { Mnemonic, AddressComputer } = require('@multiversx/sdk-core');
const fs = require('fs');

// Number of shards in the network (excluding the meta-shard)
const numberOfShardsWithoutMeta = 3;

// Create an instance of AddressComputer
const addressComputer = new AddressComputer(numberOfShardsWithoutMeta);

// Generate a mnemonic phrase
const mnemonic = Mnemonic.generate();
console.log('Mnemonic Phrase:', mnemonic.toString());

// Function to generate accounts for a specific shard
function generateAccountsForShard(mnemonic, shard, accountsPerShard) {
    const accounts = [];
    let index = 0;

    while (accounts.length < accountsPerShard) {
        const secretKey = mnemonic.deriveKey(index);
        const address = secretKey.generatePublicKey().toAddress();

        // Get the shard of the address using AddressComputer
        const shardOfAddress = addressComputer.getShardOfAddress(address);

        if (shardOfAddress === shard) {
            accounts.push({
                address: address.bech32(),
                privateKey: secretKey.hex(),
            });
        }

        index++;
    }
    return accounts;
}

// Generate 3 accounts per shard
const allAccounts = {};

for (let shard = 0; shard < numberOfShardsWithoutMeta; shard++) {
    allAccounts[`shard${shard}`] = generateAccountsForShard(mnemonic, shard, 3);
}

// Save the results to a JSON file
const results = {
    mnemonic: mnemonic.toString(),
    accounts: allAccounts,
};

fs.writeFile(
    'accounts_results.json',
    JSON.stringify(results, null, 2),
    (err) => {
        if (err) {
            console.error('Error saving the file:', err);
        } else {
            console.log("Results saved to 'accounts_results.json'.");
        }
    }
);
