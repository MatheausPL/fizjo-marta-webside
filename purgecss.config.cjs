module.exports = {
  // PurgeCSS sprawdzi index.html, wszystkie pliki w /pages oraz skrypt JS
  content: [
    'index.html',
    'script.js',
    'pages/**/*.html'
  ],
  
  // Ścieżka do Twojego konkretnego pliku CSS
  css: ['css/sidebar-elegance-soft.css'],
  
  // Wynikowy plik pojawi się w tym samym folderze /css
  output: 'css/sidebar-elegance-soft.purged.css',

  // Opcjonalnie: dodaj tu klasy, których używasz dynamicznie w script.js
  // np. safelist: ['active', 'open']
}
