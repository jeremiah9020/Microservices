const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
const url = process.env.AZURE_KEYVAULT_RESOURCEENDPOINT;
const client = new SecretClient(url, credential);

module.exports = client;