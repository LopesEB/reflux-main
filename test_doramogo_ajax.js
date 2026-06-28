const axios = require('axios');
const fs = require('fs');
async function test() {
  try {
    const res = await axios.get('https://doramogo.net/');
    fs.writeFileSync('doramogo.html', res.data);
    console.log('HTML saved.');
  } catch(e) { console.error(e.message); }
}
test();
