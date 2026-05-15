// Meta Pixel tracking - will be initialized in HTML
(function() {
  const pageUrl = window.location.pathname;

  // Fire PageView
  if (typeof fbq !== 'undefined') {
    fbq('track', 'PageView');
  }

  // Fire ViewContent when pricing section is visible
  if (pageUrl === '/' || pageUrl === '/index.html') {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
              content_ids: ['nexlify'],
              content_name: 'Nexlify Product',
              content_type: 'product',
              value: 37,
              currency: 'EUR'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      observer.observe(pricingSection);
    }
  }

  // Fire InitiateCheckout on checkout page
  if (pageUrl === '/checkout.html' || pageUrl.includes('checkout')) {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout', {
        value: 37,
        currency: 'EUR'
      });
    }
  }

  // Register PostHog
  if (typeof posthog !== 'undefined') {
    posthog.register({
      brand: 'nexlify',
      product_price: 37,
      currency: 'EUR'
    });
  }
})();
