const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

async function test() {
  const url = 'https://doramogo.net';
  const configs = [
    { name: 'Default Axios', config: {} },
    { name: 'Chrome UA', config: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } } },
    { name: 'rejectUnauthorized', config: { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } },
    { name: 'No UA + rejectUnauthorized', config: { headers: { 'User-Agent': '' }, httpsAgent: new https.Agent({ rejectUnauthorized: false }) } },
    { name: 'Legacy Server Connect', config: { httpsAgent: new https.Agent({ rejectUnauthorized: false, secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }) } },
    { name: 'Legacy Server Connect + Chrome UA', config: { headers: { 'User-Agent': 'Mozilla/5.0' }, httpsAgent: new https.Agent({ rejectUnauthorized: false, secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }) } }
  ];

  for (const c of configs) {
    console.log(`\nTesting ${c.name}...`);
    try {
      const res = await axios.get(url, c.config);
      console.log(`SUCCESS: ${res.status}`);
      return;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
}

test();
