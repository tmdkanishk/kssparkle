# E-commerce Analytics — Testing & Validation

After filling credentials in [`src/utils/analyticsConfig.js`](../../utils/analyticsConfig.js), rebuild the native apps (`npx expo run:ios` / `run:android`).

## Credentials checklist

1. **Firebase / GA4** — already wired via `GoogleService-Info.plist` / `google-services.json`. Confirm Analytics is enabled in Firebase Console.
2. **Meta** — set `meta.appId` and `meta.clientToken` in `analyticsConfig.js`, then add the Expo plugin to `app.json` and rebuild:

```json
[
  "react-native-fbsdk-next",
  {
    "appID": "YOUR_META_APP_ID",
    "clientToken": "YOUR_CLIENT_TOKEN",
    "displayName": "Sparkle",
    "scheme": "fbYOUR_META_APP_ID",
    "advertiserIDCollectionEnabled": true,
    "autoLogAppEventsEnabled": true,
    "isAutoInitEnabled": true
  }
]
```

3. **TikTok** — set `tiktok.tiktokAppId` and `tiktok.accessToken` in `analyticsConfig.js`, then rebuild so the native module is linked (`pod install` on iOS).

Until Meta/TikTok credentials are set, those providers no-op safely; Firebase events still fire.

## DebugView / Test Events

### Firebase
- iOS: Xcode scheme → Arguments → `-FIRDebugEnabled`, or:
  `defaults write com.ksasparkle FIRDebugEnabled -bool YES`
- Android: `adb shell setprop debug.firebase.analytics.app com.ksasparkle`
- Open Firebase Console → Analytics → DebugView and walk the funnel.

### Meta
- Events Manager → Test Events → enable test device
- Confirm `ViewContent`, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`

### TikTok
- Events Manager → Test Events / Event activity
- Confirm content events with matching `content_id` = OpenCart `product_id`

## Funnel checklist

| Action | Expected GA4 event | Meta | TikTok |
|--------|-------------------|------|--------|
| Open product | `view_item` | ViewContent | VIEW_CONTENT |
| Open product list | `view_item_list` | — | — |
| Search | `search` | Search | SEARCH |
| Add to cart | `add_to_cart` | AddToCart | ADD_TO_CART |
| Add wishlist | `add_to_wishlist` | AddToWishlist | ADD_TO_WISHLIST |
| Continue from shipping/payment | `begin_checkout` | InitiateCheckout | INITIATE_CHECKOUT |
| Place order (swipe) | `add_payment_info` | AddPaymentInfo | ADD_PAYMENT_INFO |
| Order success | `purchase` | Purchase | PURCHASE |
| Register | `complete_registration` | CompleteRegistration | REGISTRATION |

## Purchase dedup

1. Complete an order → confirm one `purchase` with `transaction_id` = order ID.
2. Re-open Order Success / payment success URL → no second purchase.
3. Values: `currency`, `value`, `items[].item_id` match cart.

## Metro logs

In `__DEV__`, each provider logs:

```
[analytics:firebase] view_item {...}
[analytics:meta] ViewContent {...}
[analytics:tiktok] VIEW_CONTENT {...}
```

If Meta/TikTok are skipped you will see:

```
[analytics:meta] skipped — set appId/clientToken in analyticsConfig.js
[analytics:tiktok] skipped — set tiktokAppId/accessToken in analyticsConfig.js
```
