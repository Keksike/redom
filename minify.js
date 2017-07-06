const fs = require('fs');
const utf8 = { encoding: 'utf8' };

fs.readFile('dist/redom.js', utf8, (err, src) => {
  if (err) {
    throw new Error(err);
  }
  fs.writeFile('dist/redom.min.js', src.split('\n')[0], utf8, (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Written dist/redom.min.js');
  });
});
