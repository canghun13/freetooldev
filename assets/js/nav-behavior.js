/* FreeToolDev — nav behavior only.
   Header/footer markup is now static HTML in every page (so crawlers and
   search engines see the real link structure without running JS). This
   script only handles the bits that genuinely need JS: the mobile menu
   toggle, the footer year, and highlighting the active nav link. */
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    if (a.getAttribute('href').indexOf(here) !== -1 && here !== 'index.html') {
      a.classList.add('active');
    }
  });
});
