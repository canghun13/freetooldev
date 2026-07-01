/* FreeToolDev — shared header/footer injector
   페이지마다 header.html/footer.html 안 붙여넣어도 되도록,
   <div id="site-header"></div> / <div id="site-footer"></div> 에 자동 주입한다.
   경로 깊이가 다른 페이지(/tools/xxx.html, /blog/xxx.html)에서도 동작하도록
   data-root 속성으로 루트 상대경로를 넘긴다. (예: data-root="../")
*/
(function () {
  function root() {
    var el = document.currentScript || document.querySelector('script[data-root]');
    return (el && el.getAttribute('data-root')) || './';
  }

  var R = root();

  var headerHTML = `
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="${R}index.html">FreeTool<span class="dot">Dev</span></a>
      <nav class="main-nav" id="mainNav">
        <a href="${R}tools/index.html">Tools</a>
        <a href="${R}blog/index.html">Blog</a>
        <a href="${R}index.html#about">About</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu">MENU</button>
    </div>
  </header>`;

  var footerHTML = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="col">
          <h4>Tools</h4>
          <a href="${R}tools/base64.html">Base64 Encode/Decode</a>
          <a href="${R}tools/csv-to-json.html">CSV to JSON (Batch)</a>
          <a href="${R}tools/image-batch.html">Bulk Image Tool</a>
          <a href="${R}tools/rss-generator.html">RSS Generator</a>
          <a href="${R}tools/sitemap-generator.html">Sitemap Generator</a>
          <a href="${R}tools/site-crawler.html">Site Crawler &amp; Audit</a>
        </div>
        <div class="col">
          <h4>Site</h4>
          <a href="${R}tools/index.html">All Tools</a>
          <a href="${R}blog/index.html">Blog</a>
        </div>
        <div class="col">
          <h4>Freetooldev</h4>
          <p style="max-width:240px;">Free bulk/batch utilities for developers &amp; designers. Nothing leaves your browser.</p>
        </div>
      </div>
      <div class="footer-bottom">© <span id="year"></span> FreeToolDev — All tools run locally in your browser.</div>
    </div>
  </footer>`;

  document.addEventListener('DOMContentLoaded', function () {
    var hMount = document.getElementById('site-header');
    var fMount = document.getElementById('site-footer');
    if (hMount) hMount.outerHTML = headerHTML;
    if (fMount) fMount.outerHTML = footerHTML;

    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    // Highlight active nav link
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      if (a.getAttribute('href').indexOf(here) !== -1 && here !== 'index.html') {
        a.classList.add('active');
      }
    });
  });
})();
