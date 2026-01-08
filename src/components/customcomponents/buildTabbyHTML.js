export const buildTabbyHTML = ({
  price,
  currency = 'SAR',
  lang = 'ar',
  installmentsCount = 4,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent !important;
    }
  </style>
  <script src="https://checkout.tabby.ai/tabby-promo.js"></script>
</head>
<body>
  <div id="tabbyPromo"></div>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      new TabbyPromo({
        selector: '#tabbyPromo',
        currency: '${currency}',
        price: '${price}',
        lang: '${lang}',
        installmentsCount: ${installmentsCount},
        productType: 'installments',
        source: 'product'
      });

      function sendHeight() {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'HEIGHT', height })
        );
      }

      // Initial height
      setTimeout(sendHeight, 500);

      // Observe dynamic content changes
      const observer = new MutationObserver(sendHeight);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    });
  </script>
</body>
</html>
`;
