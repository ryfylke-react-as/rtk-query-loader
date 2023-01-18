#!/usr/bin/env zx
try {
  await Promise.all([
    $`yarn build`,
    $`npm version patch --force`,
  ]);
  const version = require("./package.json").version;
  await Promise.all([
    $`git commit --allow-empty -m "version: ${version}"`,
    $`git push`,
    $`npm publish --access public`,
    $`echo "======================"`,
    $`echo "Deployed! 🚀 (${version})"`,
    $`echo "======================"`,
  ]);
} catch (err) {
  await Promise.all([
    $`echo "======================"`,
    $`echo "Deploy failed! 😭"`,
    $`echo "======================"`,
    $`echo "${err}"`,
  ]);
}
