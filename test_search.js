const axios = require('axios');
const cheerio = require('cheerio');
async function test() {
  try {
    const res = await axios.get('https://doramogo.net/?s=Round+6');
    const $ = cheerio.load(res.data);
    const results = [];
    $('.episode-card').each((i, el) => {
      const a = $(el).find('a').first();
      results.push({ url: a.attr('href'), title: a.attr('title') || a.text().trim() });
    });
    console.log(results);
  } catch(e) { console.error(e.message); }
}
test();
