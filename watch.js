const cp = require('child_process');
const fs = require('fs');

run('watch-es', true); // run forever
run('watch-js', true); // run forever

fs.watch('dist/redom.js', () => run('minify'));
fs.watch('dist/doc.md', () => run('build-doc'));
fs.watch('test/test.js', () => run('test'));

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
