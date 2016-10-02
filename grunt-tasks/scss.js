module.exports = {
  dist: {
    options: {
      sourceMap: false,
      outputStyle: 'compressed'
      , includePaths: [
        'node_modules/cartoassets/src/scss'
      ]
    },
    files: [{
      expand: true,
      src: [
        'cartoassets/scss/**/*.scss',
        // 'node_modules/cartoassets/src/scss/**/*.scss',
        'node_modules/perfect-scrollbar/**/*.scss',
        'node_modules/cartodb.js/themes/scss/entry.scss',
        'themes/scss/entry.scss'
      ],
      dest: '.tmp/scss',
      ext: '.css'
    }]
  }
};
