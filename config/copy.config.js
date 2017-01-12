// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/**/*'],
    dest: '{{WWW}}/assets'
  },
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyPolyfills: {
    src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
    dest: '{{BUILD}}'
  },
  copySwToolbox: {
    src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js'],
    dest: '{{BUILD}}'
  },
  copyThirdPartyLibs: {
    src: ['{{ROOT}}/libs/**/*.js'],
    dest: '{{BUILD}}'
  },
  copyThirdPartyCss: {
    src: ['{{ROOT}}/libs/**/*.css'],
    dest: '{{BUILD}}'
  }
}

/*var fs = require('fs-extra')

var dependencies = [
    ['node_modules/jquery/dist/jquery.min.js','www/libs/jquery.min.js'],
    ['node_modules/js-md5/build/md5.min.js','www/libs/md5.min.js'],
    ['node_modules/moment/min/moment.min.js','www/libs/moment.min.js'],
    ['node_modules/font-awesome/css/font-awesome.min.css','www/libs/fa/font-awesome.min.css'],
    ['node_modules/font-awesome/fonts','www/libs/fonts']
];

dependencies.forEach(function(value) {
    fs.copy(value[0],value[1]);
});*/
