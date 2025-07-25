window.addEventListener('load', () =>  [
    /*
    "https://archive.today/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.li/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.vn/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.fo/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.md/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.ph/submit/?anyway=1&url=[ENCODE_URL]",
    "https://archive.is/submit/?anyway=1&url=[ENCODE_URL]",
    */
    "https://archive.today/[ENCODE_URL]",
    "https://archive.li/[ENCODE_URL]",
    "https://archive.vn/[ENCODE_URL]",
    "https://archive.fo/[ENCODE_URL]",
    "https://archive.md/[ENCODE_URL]",
    "https://archive.ph/[ENCODE_URL]",
    "https://archive.is/[ENCODE_URL]",
    
    "https://web.archive.org/save/[ENCODE_URL]",
    "https://web.archive.org/web/[ENCODE_URL]",
    "https://web.archive.org/web/*/[ENCODE_URL]",

    "https://ghostarchive.org/search?term=[ENCODE_URL]"
  ];

  let targetUrls = [];
  let iframes = [];

  // Create hidden iframes immediately
  for (let i = 0; i < 3; i++) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('hidden-iframe', 'auto-iframe');
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
    iframes.push(iframe);
  }

  let templatesLoaded = false;
  let urlsLoaded = false;

  function tryStartTraffic() {
    if (templatesLoaded && urlsLoaded && autoTrafficTemplates.length && targetUrls.length) {
      console.log("🚀 Starting traffic loop...");

      function setRandomUrlInIframes() {
        iframes.forEach(iframe => {
          const template = autoTrafficTemplates[Math.floor(Math.random() * autoTrafficTemplates.length)];
          const targetUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
          const encodedUrl = encodeURIComponent(targetUrl);

          const finalUrl = template
            .replace(/\[ENCODE_URL\]|\{\{ENCODE_URL\}\}/g, encodedUrl)
            .replace(/\[URL\]|\{\{URL\}\}/g, targetUrl);

          iframe.src = finalUrl;
        });

        // Prevent unwanted scrolling
        //window.scrollTo(0, 0);
      }

      setRandomUrlInIframes();
      setInterval(setRandomUrlInIframes, 30000);
    }
  }

  // Load Templates
  fetch('https://traffic-exchange.github.io/api/auto-traffic-templates.json')
    .then(res => res.ok ? res.json() : Promise.reject("Template fetch failed"))
    .then(data => {
      if (Array.isArray(data) && data.length) {
        autoTrafficTemplates = data;
        templatesLoaded = true;
        console.log("✅ Templates loaded.");
      }
    })
    .catch(err => {
      console.warn("⚠️ Using default templates. Reason:", err.message);
      templatesLoaded = true;
    })
    .finally(tryStartTraffic);

  // Load Target URLs
  fetch('https://traffic-exchange.github.io/api/auto-traffic-urls.json')
    .then(res => res.ok ? res.json() : Promise.reject("URL fetch failed"))
    .then(data => {
      if (Array.isArray(data) && data.length) {
        targetUrls = data;
        urlsLoaded = true;
        console.log("✅ Target URLs loaded.");
      }
    })
    .catch(err => {
      console.error("❌ Cannot continue: No valid target URLs. Reason:", err.message);
    })
    .finally(tryStartTraffic);
});
