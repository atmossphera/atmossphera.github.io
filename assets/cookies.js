/* Aviso de cookies y carga de Google Analytics solo tras aceptar. */
(function () {
  var ID = 'G-395RX98QRT', KEY = 'atm_cookies';
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  function leer() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function cargarAnalytics() {
    if (window.__atmGA) return;
    window.__atmGA = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ID);
  }

  function banner() {
    var css = document.createElement('style');
    css.textContent =
      '.atm-ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#14332A;color:#F3F6EF;border-radius:14px;padding:18px 20px;box-shadow:0 10px 30px rgba(0,0,0,.25);font:15px/1.5 Montserrat,system-ui,sans-serif}' +
      '.atm-ck p{margin:0 0 14px}.atm-ck div{display:flex;gap:10px;flex-wrap:wrap}' +
      '.atm-ck button{cursor:pointer;border-radius:999px;padding:10px 20px;font:600 14px Montserrat,system-ui,sans-serif;border:1.5px solid #E0A64B}' +
      '.atm-ck .si{background:#E0A64B;color:#20302A}.atm-ck .no{background:transparent;color:#E0A64B}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.className = 'atm-ck';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>Usamos una cookie de analítica (Google Analytics) para entender cómo se usa la web y mejorarla. Solo se activa si aceptas.</p><div><button class="si" type="button">Aceptar</button><button class="no" type="button">Rechazar</button></div>';
    d.querySelector('.si').onclick = function () { guardar('si'); d.remove(); cargarAnalytics(); };
    d.querySelector('.no').onclick = function () { guardar('no'); d.remove(); };
    document.body.appendChild(d);
  }

  var v = leer();
  if (v === 'si') cargarAnalytics();
  else if (v !== 'no') {
    if (document.body) banner(); else document.addEventListener('DOMContentLoaded', banner);
  }
})();
