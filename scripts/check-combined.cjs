const { spawnSync } = require('node:child_process');
for (const file of ['test-login.cjs','test-google.cjs','test-google-application.cjs']) {
 const result = spawnSync(process.execPath, [require('node:path').join(__dirname,file)], {stdio:'inherit'});
 if (result.status !== 0) process.exit(result.status || 1);
}
