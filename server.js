const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Vault's address and token
const vaultAddress = 'http://127.0.0.1:8200';
const vaultToken = 'hvs.PAq9lRgtMbvFEpkTRcI3qVNb'; // Securely manage this

app.get('/', async (req, res) => {
  try {
    // Request AWS credentials from Vault
    const response = await axios.get(`${vaultAddress}/v1/aws/creds/my-role`, {
      headers: {
        'X-Vault-Token': vaultToken,
      },
    });

    // Extract the AWS Access and Secret keys
    const credentials = response.data.data;

    res.send(`
      <h1>Node.js App with AWS Integration</h1>
      <p>Access Key: ${credentials.access_key}</p>
      <p>Secret Key: ${credentials.secret_key}</p>
      <p>Token: ${credentials.security_token}</p>
    `);
  } catch (error) {
    console.error('Error fetching AWS credentials from Vault:', error);
    res.status(500).send('Error fetching AWS credentials from Vault');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
