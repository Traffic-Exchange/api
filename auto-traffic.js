let autoTrafficTemplates = [
  "https://archive.ph/submit/?anyway=1&url=[ENCODE_URL]",
  "https://web.archive.org/save/[ENCODE_URL]",
  "https://web.archive.org/web/[ENCODE_URL]",
  "https://web.archive.org/web/*/[ENCODE_URL]"
];

let targetUrls = [];

// Load templates and URLs
Promise.all([
  fetch('https://traffic-exchange.github.io/api/auto-traffic.json')
    .then(res => res.ok ? res.json() : Promise.reject("Failed to load templates"))
    .catch(err => {
      console.warn("⚠️ Using default templates. Reason:", err);
      return autoTrafficTemplates;
    }),
  fetch('https://traffic-exchange.github.io/api/auto-traffic-urls.json')
    .then(res => res.ok ? res.json() : Promise.reject("Failed to load target URLs"))
    .catch(err => {
      console.error("❌ Cannot load target URLs. Stopping. Reason:", err);
      return [];
    })
]).then(([templates, urls]) => {
  // Validate both arrays
  if (!Array.isArray(templates) || templates.length === 0) {
    console.error("❌ Templates list is empty. Exiting.");
    return;
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    console.error("❌ Target URLs list is empty. Exiting.");
    return;
  }

  autoTrafficTemplates = templates;
  targetUrls = urls;

  console.log("✅ Loaded templates and target URLs.");

  // Create 3 hidden iframes
  for (let i = 0; i < 3; i++) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('hidden-iframe', 'auto-iframe');
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
  }

  const iframes = document.querySelectorAll('.auto-iframe');

  function setRandomUrlInIframes() {
    iframes.forEach(iframe => {
      const template = autoTrafficTemplates[Math.floor(Math.random() * autoTrafficTemplates.length)];
      const targetUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
      const encodedUrl = encodeURIComponent(targetUrl);

      const finalUrl = template
        .replace(/\[ENCODE_URL\]/g, encodedUrl)
        .replace(/\[URL\]/g, targetUrl);

      iframe.src = finalUrl;
    });
  }

  // Initial and interval update every 30 seconds
  setRandomUrlInIframes();
  setInterval(setRandomUrlInIframes, 30000);
});
