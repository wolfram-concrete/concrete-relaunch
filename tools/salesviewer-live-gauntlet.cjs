#!/usr/bin/env node
// Read-only production check: records the SalesViewer request chain without submitting forms.
const { chromium } = require('playwright');

const target = process.argv[2] || 'https://www.concrete-designs.de/?sv_gauntlet=20261002';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'de-DE',
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  const events = [];

  const relevant = (url) => /salesviewer|slsnlytcs/i.test(url);
  page.on('request', (request) => {
    if (relevant(request.url())) events.push({ type: 'request', method: request.method(), url: request.url() });
  });
  page.on('response', (response) => {
    if (relevant(response.url())) {
      const headers = response.headers();
      events.push({
        type: 'response',
        status: response.status(),
        contentType: headers['content-type'] || null,
        salesViewerError: headers['x-error-code'] || null,
        url: response.url(),
      });
    }
  });
  page.on('requestfailed', (request) => {
    if (relevant(request.url())) events.push({ type: 'failed', error: request.failure()?.errorText || 'unknown', url: request.url() });
  });
  page.on('console', (message) => {
    const text = message.text();
    if (/salesviewer|cors|content security/i.test(text)) events.push({ type: 'console', level: message.type(), text });
  });

  const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForTimeout(5_000);
  if (process.argv.includes('--probe-fallback-pixel')) {
    await page.evaluate(() => {
      const image = new Image();
      image.alt = '';
      image.src = 'https://salesviewer.org/o9H9o8a1U5l3.gif';
      document.body.appendChild(image);
    });
    await page.waitForTimeout(2_000);
  }
  const currentResponses = events.filter((event) =>
    event.type === 'response' && event.url.includes('slsnlytcs.com/stm.js')
  );
  const result = {
    target,
    pageStatus: response?.status(),
    currentTrackerHealthy: currentResponses.some((event) =>
      event.status === 200 && event.salesViewerError === '200' && /javascript/i.test(event.contentType || '')
    ),
    events,
  };
  console.log(JSON.stringify(result, null, 2));
  if (process.argv.includes('--expect-current') && !result.currentTrackerHealthy) process.exitCode = 2;
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
