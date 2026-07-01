// FreeToolDev — Google Analytics 4
// TODO: G-XXXXXXXXXX 를 실제 GA4 측정 ID로 교체
// (측정 ID 확정되면 이 파일 한 곳만 고치면 전체 사이트에 반영됨)
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  if (GA_ID.indexOf('XXXX') !== -1) return; // ID 아직 설정 안 됐으면 로드 안 함

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
