// Копирование команд + тост.
(function () {
  const toast = document.getElementById('toast');
  const toastText = toast ? (toast.querySelector('span') || toast) : null;
  let toastTimer;

  function showToast(msg) {
    if (!toast) return;
    if (toastText && toastText !== toast) toastText.textContent = msg;
    else toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback для http/non-secure контекста
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  }

  document.querySelectorAll('.cmd').forEach((block) => {
    const btn = block.querySelector('.copy');
    const code = block.querySelector('code');
    if (!btn || !code) return;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await copyText(code.innerText.replace(/\u00a0/g, ' '));
      if (!ok) { showToast('НЕ УДАЛОСЬ СКОПИРОВАТЬ'); return; }
      btn.classList.add('done');
      showToast('СКОПИРОВАНО');
      setTimeout(() => btn.classList.remove('done'), 1400);
    });
  });
})();
