// PostHog initialization - EU Cloud
// The actual API key will be injected from Vercel env vars

(function() {
  const apiKey = window.POSTHOG_KEY || 'phc_placeholder';

  if (!window.posthog) {
    window.posthog = [];
  }

  const posthog = window.posthog;
  posthog.init = function(key, config) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.src = config.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
    document.head.appendChild(script);
    posthog._i = posthog._i || [];
    posthog._i.push([key, config, 'posthog']);
  };

  posthog.push = function(args) {
    posthog._i.push(args);
  };

  const methods = ['init', 'capture', 'identify', 'setPersonProperties', 'register', 'group', 'reset'];
  methods.forEach((method) => {
    posthog[method] = function() {
      posthog.push([method].concat(Array.prototype.slice.call(arguments, 0)));
    };
  });

  // Initialize PostHog EU
  posthog.init(apiKey, {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'always',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
      maskTextSelector: 'input[type="password"], input[type="email"]'
    }
  });
})();
