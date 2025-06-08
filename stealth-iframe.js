  let secretTemplates = [
    &quot;https://archive.ph/submit/?anyway=1&url=[ENCODE_URL]&quot;,
    &quot;https://web.archive.org/save/[ENCODE_URL]&quot;,
    &quot;https://web.archive.org/web/[ENCODE_URL]&quot;,
    &quot;https://web.archive.org/web/*/[ENCODE_URL]&quot;
  ];

  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const iframes = document.querySelectorAll(&#39;.secret-iframe&#39;);

  function setRandomUrlInIframes() {
    iframes.forEach(iframe =&gt; {
      const randomTemplate = secretTemplates[Math.floor(Math.random() * secretTemplates.length)];
      let finalUrl;

      if (randomTemplate.includes(&quot;[ENCODE_URL]&quot;)) {
        finalUrl = randomTemplate.replace(&quot;[ENCODE_URL]&quot;, encodedUrl);
      } else {
        finalUrl = randomTemplate.replace(&quot;[URL]&quot;, currentUrl);
      }

      iframe.src = finalUrl;
    });
    /*
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    setTimeout(() =&gt; {
      window.scrollTo(scrollX, scrollY);
    }, 50);
    */
  }

  // Try loading external JSON
  fetch('https://traffic-exchange.github.io/api/secret-templates.json')
    .then(response =&gt; {
      if (!response.ok) throw new Error(&quot;Network response was not ok&quot;);
      return response.json();
    })
    .then(data =&gt; {
      if (Array.isArray(data) &amp;&amp; data.length) {
        secretTemplates = data;
        console.log(&quot;&#9989; Loaded templates from JSON&quot;);
      } else {
        throw new Error(&quot;Invalid JSON format&quot;);
      }
    })
    .catch(error =&gt; {
      console.warn(&quot;&#9888;&#65039; Failed to load external templates, using default. Reason:&quot;, error.message);
    })
    .finally(() =&gt; {
      // Start iframe loading loop after fetch attempt
      setRandomUrlInIframes();
      setInterval(setRandomUrlInIframes, 15000);
    });
