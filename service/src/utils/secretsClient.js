const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

let client = null;
if (process.env.ONLINE) {
    const credential = new DefaultAzureCredential();
    const url = process.env.KEYVAULT;
    client = new SecretClient(url, credential);
}

module.exports = client;

