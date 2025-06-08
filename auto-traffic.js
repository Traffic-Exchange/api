 let autoTrafficTemplates = [
    //Test V2
    "https://archive.ph/submit/?anyway=1&url=[ENCODE_URL]",
    "https://web.archive.org/save/[ENCODE_URL]",
    "https://web.archive.org/web/[ENCODE_URL]",
    "https://web.archive.org/web/*/[ENCODE_URL]"
  ];

  // Try loading external JSON
  fetch('https://traffic-exchange.github.io/api/auto-traffic.json')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length) {
        autoTrafficTemplates = data;
        console.log("&#9989; Loaded templates from JSON");
      } else {
        throw new Error("Invalid JSON format");
      }
    })
    .catch(error => {
      console.warn("&#9888;&#65039; Failed to load external templates, using default. Reason:", error.message);
    })
    .finally(() => {
      // Start iframe loading loop after fetch attempt


  //window.onload = function () {
    for (let i = 0; i < 3; i++) {
      const iframe = document.createElement('iframe');
      iframe.classList.add('hidden-iframe', 'auto-iframe');
      iframe.src = 'about:blank'; // Optional: Set source or leave blank
      document.body.appendChild(iframe);
    }
  //};
      
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const iframes = document.querySelectorAll('.auto-iframe');

  function setRandomUrlInIframes() {
    iframes.forEach(iframe => {
      const randomTemplate = autoTrafficTemplates[Math.floor(Math.random() * autoTrafficTemplates.length)];
      let finalUrl;

      if (randomTemplate.includes("[ENCODE_URL]")) {
        finalUrl = randomTemplate.replace("[ENCODE_URL]", encodedUrl);
      } else {
        finalUrl = randomTemplate.replace("[URL", currentUrl);
      }

      iframe.src = finalUrl;
    });
    /*
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    setTimeout(() => {
      window.scrollTo(scrollX, scrollY);
    }, 50);
    */
  }
      setRandomUrlInIframes();
      setInterval(setRandomUrlInIframes, 15000);
    });
