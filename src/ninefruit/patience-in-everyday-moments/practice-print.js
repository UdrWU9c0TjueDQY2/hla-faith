(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const controls = get('patience-print');
  if (!controls) return;
  const sheet = get('patience-print-workspace');
  const cards = get('patience-print-cards');
  const status = get('patience-print-status');
  const heading = get('patience-print-heading');
  const notes = get('patience-print-notes');
  const includeNotes = get('patience-print-include-notes');
  let prepared = false;
  function clear(message) {
    prepared = false;
    sheet.hidden = true;
    cards.replaceChildren();
    notes.hidden = true;
    get('patience-print-now').disabled = true;
    document.body.classList.remove('patience-print-ready');
    status.textContent = message || '';
  }
  function readCard(detail) {
    const title = detail.querySelector('summary');
    const lines = Array.from(detail.querySelectorAll('p'));
    if (!title || lines.length !== 3) throw new Error('A complete practice card could not be read. Use the six cards above instead.');
    return { title: title.textContent.trim(), lines: lines.map(line => line.textContent.trim()) };
  }
  function addCard(card) {
    const article = document.createElement('article');
    article.className = 'patience-print-card';
    const title = document.createElement('h3');
    title.textContent = card.title;
    article.append(title);
    card.lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      article.append(p);
    });
    cards.append(article);
  }
  function prepare(all) {
    clear();
    try {
      const details = Array.from(document.querySelectorAll('details[data-patience-card]'));
      const selected = all ? details : details.filter(detail => detail.dataset.patienceCard === get('moment').value);
      if (details.length !== 6 || selected.length !== (all ? 6 : 1)) throw new Error('Select one of the six situations above, then prepare the sheet again.');
      const completeCards = selected.map(readCard);
      completeCards.forEach(addCard);
      heading.textContent = all ? 'Six ordinary moments. Six small responses.' : completeCards[0].title;
      get('patience-print-subtitle').textContent = all ? 'Cut apart the six cards, or keep the sheet together. No score, order or target is required.' : 'One practice card from the six-card guide. Rehearse only what fits this situation.';
      notes.hidden = !includeNotes.checked;
      sheet.hidden = false;
      get('patience-print-now').disabled = false;
      document.body.classList.add('patience-print-ready');
      prepared = true;
      status.textContent = (all ? 'All six cards are ready below.' : 'The selected card is ready below.') + (includeNotes.checked ? ' A separate facilitator page is included.' : ' Facilitator notes are not included.');
      heading.focus();
    } catch (error) {
      clear(error.message);
    }
  }
  get('patience-print-one').addEventListener('click', () => prepare(false));
  get('patience-print-all').addEventListener('click', () => prepare(true));
  get('patience-print-clear').addEventListener('click', () => clear('Prepared sheet cleared. The original cards are unchanged.'));
  function invalidate() {
    if (prepared) clear('Situation changed. Prepare a fresh sheet before printing.');
  }
  get('moment').addEventListener('input', invalidate);
  get('moment').addEventListener('change', invalidate);
  get('restore').addEventListener('click', invalidate);
  includeNotes.addEventListener('change', () => {
    if (!prepared) return;
    notes.hidden = !includeNotes.checked;
    status.textContent = includeNotes.checked ? 'Separate facilitator page included in the prepared sheet.' : 'Facilitator notes removed from the prepared sheet.';
  });
  get('patience-print-now').addEventListener('click', () => {
    if (!prepared) return;
    try { window.print(); }
    catch { status.textContent = 'Print is unavailable here. Select the prepared text, or use your browser menu.'; }
  });
  clear();
})();
