const cp = require('child_process');
const fs = require('fs');

const utf8 = { encoding: 'utf8' };

run('watch-es', true); // run forever
run('watch-js', true); // run forever

fs.watch('dist/redom.js', () => {
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
});
fs.watch('dist/doc.md', run('build-doc'));
fs.watch('test/test.js', run('test'));

function run (script, forever) {
  const child = cp.spawn('npm', ['run', script]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  if (forever) {
    child.on('exit', () => setTimeout(() => {
      run(script, true);
    }, 5000));
  }

  return () => run(script);
}
