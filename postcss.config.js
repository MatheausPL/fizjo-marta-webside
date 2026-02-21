const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    purgecss({
      content: ['./index.html', './pages/**/*.html', './script.js']
    }),
    cssnano({
      preset: 'default',
    })
  ]
}
