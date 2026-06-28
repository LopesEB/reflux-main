const axios = require('axios');
async function test() {
  const urls = [
    'https://doramogo.net/series/round-6',
    'https://doramogo.net/series/round-6-2021',
    'https://doramogo.net/series/round-6-legendado',
    'https://doramogo.net/series/round-6-2021-legendado',
    'https://doramogo.net/series/squid-game',
    'https://doramogo.net/series/squid-game-2021',
    'https://doramogo.net/series/squid-game-legendado'
  ];
  for (let u of urls) {
    try {
      const res = await axios.head(u);
      console.log(u, '=>', res.status);
    } catch(e) { console.log(u, '=>', e.response ? e.response.status : e.message); }
  }
}
test();
