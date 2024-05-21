// eslint-disable-next-line import/no-cycle
/* eslint-disable no-undef */
import { sampleRUM } from './aem.js';

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
