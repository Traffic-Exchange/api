let autoTrafficTemplates = [
  "https://archive.ph/submit/?anyway=1&url=[ENCODE_URL]",
  "https://web.archive.org/save/[ENCODE_URL]",
  "https://web.archive.org/web/[ENCODE_URL]",
  "https://web.archive.org/web/*/[ENCODE_URL]"
];

let targetUrls = [];

// Load both templates and target URLs
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
  if (Array.isArray(templates) && templates.length) {
    autoTrafficTemplates = templates;
    console.log("✅ Loaded templates.");
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    console.error("❌ No valid target URLs found.");
    return;
  }

  targetUrls = urls;
  console.log("✅ Loaded target URLs.");

  // Create 3 iframes
  for (let i = 0; i < 3; i++) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('hidden-iframe', 'auto-iframe');
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
  }

  const iframes = document.querySelectorAll('.auto-iframe');

  function setRandomUrlInIframes() {
    iframes.forEach(iframe => {
      const randomTemplate = autoTrafficTemplates[Math.floor(Math.random() * autoTrafficTemplates.length)];
      const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
      const encodedTarget = encodeURIComponent(randomUrl);

      const finalUrl = randomTemplate.replace("[ENCODE_URL]", encodedTarget);
      iframe.src = finalUrl;
    });
  }

  // Initial load and loop
  setRandomUrlInIframes();
  setInterval(setRandomUrlInIframes, 15000);
});
