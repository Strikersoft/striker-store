const fsbx = require('fuse-box');

fsbx.FuseBox.init({
  package: "striker-store",
  modulesFolder: "./lib/",
  homeDir: "./lib",
  outFile: "./build/bundle.js",
  globals: { default: "strikerStore" },
  sourceMap: {
    bundleReference: "sourcemaps.js.map",
    outFile: "./build/sourcemaps.js.map"
  }
}).bundle("> index.ts [**/*.ts]");
