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

      if (/^\d{5}$/.test(current) && next) {
        lines.push(`${current} ${next}`);
        i++;
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

  function styliseQuantiteProduits() {
    document.querySelectorAll('td.cellProductQuantity').forEach(cell => {
      const qty = parseInt(cell.textContent.trim(), 10);
      if (!isNaN(qty) && qty !== 1) {
        cell.style.color = '#a30000';
        cell.style.fontWeight = 'bold';
        cell.style.border = '2px solid #a30000';
        cell.style.borderRadius = '6px';
        cell.style.backgroundColor = '#ffe5e5';
        cell.style.display = 'inline-block';
        cell.style.padding = '4px 8px';
      } else {
        cell.removeAttribute('style');
      }
    });
  }

  function styliseTransporteurNonColissimo() {
    const rows = document.querySelectorAll('.card-body table tbody tr');
    rows.forEach(row => {
      const td = row.querySelector('td:nth-child(3)');
      if (td) {
        const txt = td.textContent.trim().toLowerCase();
        if (!txt.includes('colissimo')) {
          td.style.color = '#a30000';
          td.style.fontWeight = 'bold';
        } else {
          td.removeAttribute('style');
        }
      }
    });
  }

  function marquerPaysSiDifferent() {
    const container = document.querySelector(SHIPPING_SELECTOR);
    if (!container) return;

    const lines = Array.from(container.querySelectorAll('p.mb-0'));
    lines.forEach(p => {
      const txt = p.textContent.trim().toLowerCase();
      if (txt === 'france') {
        p.style.color = ''; // normal
        p.style.fontWeight = '';
      } else if (/^[a-z\s-]+$/i.test(txt) && txt.length > 5) {
        p.style.color = '#a30000';
        p.style.fontWeight = 'bold';
      }
    });
  }

  function clickTabTransporteurs() {
    const tabLink = document.querySelector('#orderShippingTab');
    if (tabLink) tabLink.click();
  }

  function injectPrestaCopyButton() {
    const container = document.querySelector(SHIPPING_SELECTOR);
    if (!container || container.dataset.copyAdded) return;

    container.dataset.copyAdded = 'true';
    const finalText = cleanPrestaAddress(container);
    const button = createCopyBtn(finalText);
    container.appendChild(button);
  }

  const observer = new MutationObserver(() => {
    injectPrestaCopyButton();
    clickTabTransporteurs();
    styliseQuantiteProduits();
    styliseTransporteurNonColissimo();
    marquerPaysSiDifferent();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
