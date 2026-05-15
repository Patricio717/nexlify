// Meta Pixel - will be initialized in HTML with fbq()
// This script fires tracking events

(function() {
  const pageUrl = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

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
          if (entry.isIntersecting) {
            if (typeof fbq !== 'undefined') {
              fbq('track', 'ViewContent', {
                content_ids: ['nexlify'],
                content_name: 'Nexlify Product',
                content_type: 'product',
                value: 37,
                currency: 'EUR'
              });
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      observer.observe(pricingSection);
    }
  }

  // Fire AddToCart on CTA button click
  const ctaButton = document.querySelector('a.cta, a[href="/checkout"]');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
          content_ids: ['nexlify'],
          content_name: 'Nexlify Product',
          content_type: 'product',
          value: 37,
          currency: 'EUR'
        });
      }
      // Allow 300ms for event to send
      setTimeout(() => {
        window.location.href = '/checkout.html';
      }, 300);
    });
  }

  // Fire InitiateCheckout on checkout page
  if (pageUrl === '/checkout' || pageUrl === '/checkout.html') {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout', {
        content_ids: ['nexlify'],
        content_name: 'Nexlify Product',
        content_type: 'product',
        value: 37,
        currency: 'EUR'
      });
    }
  }

  // Register PostHog super properties
  if (typeof posthog !== 'undefined') {
    posthog.register({
      brand: 'nexlify',
      product_price: 37,
      currency: 'EUR'
    });
  }
})();
