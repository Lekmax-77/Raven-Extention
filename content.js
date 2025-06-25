(function () {
  const SHIPPING_SELECTOR = '#addressShipping';

  function cleanPrestaAddress(container) {
    const rawLines = Array.from(container.querySelectorAll('p.mb-0'))
      .map(p => p.textContent.trim())
      .filter(line =>
        line.length > 0 &&
        line.toLowerCase() !== 'france'
      );

    const lines = [];
    for (let i = 0; i < rawLines.length; i++) {
      const current = rawLines[i];
      const next = rawLines[i + 1];

      // Fusion code postal + ville
      if (/^\d{5}$/.test(current) && next) {
        lines.push(`${current} ${next}`);
        i++; // skip ville
      } else {
        lines.push(current);
      }
    }

    return lines.join('\n');
  }

  function createCopyBtn(text) {
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '10px';

    const btn = document.createElement('button');
    btn.textContent = '📋 Copier l’adresse';
    btn.style.background = '#25b9d7';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '13px';

    btn.onclick = () => {
      navigator.clipboard.writeText(text)
        .then(() => {
          btn.textContent = '✅ Adresse copiée';
          setTimeout(() => { btn.textContent = '📋 Copier l’adresse'; }, 1500);
        })
        .catch(() => alert('Erreur lors de la copie.'));
    };

    wrapper.appendChild(btn);
    return wrapper;
  }

  function injectPrestaCopyButton() {
    const container = document.querySelector(SHIPPING_SELECTOR);
    if (!container || container.dataset.copyAdded) return;

    container.dataset.copyAdded = 'true';

    const finalText = cleanPrestaAddress(container);
    const button = createCopyBtn(finalText);
    container.appendChild(button);
  }

  // Observer PrestaShop admin loading
  const observer = new MutationObserver(() => {
    injectPrestaCopyButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
