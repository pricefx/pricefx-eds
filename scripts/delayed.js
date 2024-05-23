// eslint-disable-next-line import/no-cycle
/* eslint-disable no-undef */
import { sampleRUM } from './aem.js';
import { environmentMode } from './global-functions.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// MARKETO SANDBOX INTEGRATION SCRIPT
(function () {
  let didInit = false;
  function initMunchkin() {
    if (didInit === false) {
      didInit = true;
      Munchkin.init('542-QYC-710');
    }
  }
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '//munchkin.marketo.net/munchkin.js';
  s.onreadystatechange = function () {
    if (this.readyState === 'complete' || this.readyState === 'loaded') {
      initMunchkin();
    }
  };
  s.onload = initMunchkin;
  document.getElementsByTagName('head')[0].appendChild(s);
})();

// MARKETO PRODUCTION INTEGRATION SCRIPT
(function () {
  let didInit = false;
  function initMunchkin() {
    if (didInit === false) {
      didInit = true;
      Munchkin.init('289-DOX-852');
    }
  }
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '//munchkin.marketo.net/munchkin-beta.js';
  s.onreadystatechange = function () {
    if (this.readyState === 'complete' || this.readyState === 'loaded') {
      initMunchkin();
    }
  };
  s.onload = initMunchkin;
  document.getElementsByTagName('head')[0].appendChild(s);
})();

// add more delayed functionality here

// Google tag manager
function loadGTM() {
  const scriptTag = document.createElement('script');
  if (window.location.hostname.includes('pricefx.com')) {
    // Live GTM
    scriptTag.innerHTML = `
    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=_SvHD1Iq6OnKV7OhtoDPLw&gtm_preview=env-2&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PXDNMZ7');`;
  } else {
    // Dev GTM
    scriptTag.innerHTML = `
    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
     'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=BiAH_CzfSizwS7DgUhlD8A&gtm_preview=env-169&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
     })(window,document,'script','dataLayer','GTM-PXDNMZ7');`;
  }
  document.head.prepend(scriptTag);
}

if (!window.location.hostname.includes('localhost') && environmentMode() === 'publish') {
  // Load GTM
  loadGTM();
}
