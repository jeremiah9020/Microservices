const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

/** @type { Promise<null | SecretClient } */
const client = new Promise((res) => {
    if (!process.env.ONLINE) {
        res(null)
    }
    
    const credential = new DefaultAzureCredential();
    const url = process.env.KEYVAULT;
    res(new SecretClient(url, credential));
});

module.exports = client;

