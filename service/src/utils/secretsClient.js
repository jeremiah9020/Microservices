const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
console.log(credential);

const url = process.env.AZURE_KEYVAULT_RESOURCEENDPOINT;

console.log(url);
const client = new SecretClient(url, credential);

module.exports = client;