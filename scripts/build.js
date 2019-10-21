const fs = require('fs-extra');
const util = require("../config/util")
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
measureFileSizesBeforeBuild(util.resolve('../dist'))
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(util.resolve('../dist'));
    // Merge with the public folder
    copyPublicFolder();

    // Start the webpack build
    // return build(previousFileSizes);
  })
function copyPublicFolder() {
    fs.copySync(util.resolve('../src/assets/babylon'), util.resolve('../dist/static/babylon'), {
      dereference: true,
      filter: file => {
          console.log('copyfile---', file)
        if(file.includes("/babylon")){
          return true
        }
        return true
      },
    });
  }
