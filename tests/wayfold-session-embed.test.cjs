const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..', 'src', 'wayfold', 'bible-reading-vs-study');
const embedHtml = fs.readFileSync(path.join(root, 'embed', 'index.html'), 'utf8');
const parentHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function domWithClipboard(writeText) {
  return new JSDOM(embedHtml, {
    runScripts: 'dangerously',
    url: 'https://udrwu9c0tjuedqy2.github.io/hla-faith/wayfold/bible-reading-vs-study/embed/',
    beforeParse(window) {
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: writeText ? { writeText } : undefined,
      });
    },
  });
}

(async () => {
  const copied = [];
  const dom = domWithClipboard(async text => copied.push(text));
  const { document } = dom.window;
  assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex,follow');
  assert.equal(document.querySelector('link[rel="canonical"]').href, 'https://udrwu9c0tjuedqy2.github.io/hla-faith/wayfold/bible-reading-vs-study/');
  assert.match(document.querySelector('.store').href, /id6820304462/);
  assert.equal(document.querySelectorAll('#steps li').length, 4);
  assert.equal(document.querySelector('[data-mode="read"]').getAttribute('aria-pressed'), 'true');
  document.querySelector('[data-mode="study"]').click();
  assert.equal(document.querySelector('[data-mode="study"]').getAttribute('aria-pressed'), 'true');
  assert.match(document.querySelector('#plan-title').textContent, /question carefully/i);
  document.querySelector('#copy').click();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(copied.length, 1);
  assert.match(copied[0], /Bible study session/);
  assert.match(copied[0], /Private notes:/);
  assert.equal(document.querySelector('#manual').hidden, true);
  document.querySelector('#reset').click();
  assert.equal(document.querySelector('[data-mode="read"]').getAttribute('aria-pressed'), 'true');
  assert.match(document.querySelector('#status').textContent, /Reset/);

  const denied = domWithClipboard(async () => { throw new Error('denied'); });
  const deniedDocument = denied.window.document;
  deniedDocument.querySelector('#copy').click();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(deniedDocument.querySelector('#manual').hidden, false);
  assert.match(deniedDocument.querySelector('#manual').value, /Bible reading session/);
  assert.match(deniedDocument.querySelector('#status').textContent, /manual copying/i);

  const parent = new JSDOM(parentHtml);
  const parentDocument = parent.window.document;
  assert.equal(parentDocument.querySelector('link[rel="canonical"]').href, 'https://udrwu9c0tjuedqy2.github.io/hla-faith/wayfold/bible-reading-vs-study/');
  const snippet = parentDocument.querySelector('#embed-code').value;
  assert.match(snippet, /\/embed\//);
  assert.match(snippet, /sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"/);
  assert.doesNotMatch(snippet, /allow-same-origin/);
  assert.match(snippet, /referrerpolicy="no-referrer"/);
  assert.doesNotMatch(embedHtml, /localStorage|sessionStorage|fetch\(|XMLHttpRequest|postMessage\(/);
  console.log('Wayfold session embed: 18 assertions passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
