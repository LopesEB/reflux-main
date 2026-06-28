const https = require('https');
const tls = require('tls');

const agent = new https.Agent({
  secureOptions: tls.constants.SSL_OP_LEGACY_SERVER_CONNECT | tls.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
  ciphers: 'DEFAULT:@SECLEVEL=0'
});

https.get('https://redecanais.la/pesquisa/?s=Round+6', { agent, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    if(data.includes('Round 6')) {
      console.log("Found Round 6 in response!");
    } else {
      console.log("Not found in response text.");
    }
  });
}).on('error', (e) => console.error(e));
