const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
const url = process.env.KEYVAULT;
const client = new SecretClient(url, credential);

module.exports = client;