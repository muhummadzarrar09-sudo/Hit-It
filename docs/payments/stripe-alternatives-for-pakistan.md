# 💳 Payment Processors for Hit It — Pakistan Edition

> **Problem:** Stripe is NOT available for production merchant accounts in Pakistan as of 2026. You can use Stripe Test mode, but you cannot charge real Pakistani cards or receive payouts to Pakistani banks.
>
> **Solution:** Build payment-agnostic. Use an adapter pattern. Start with Paddle. Add Paymob for local market penetration later.

---

## 🏆 Recommended: Paddle (Primary)

**Website:** [paddle.com](https://paddle.com)

### Why Paddle for Pakistan
| Factor | Paddle | Stripe |
|--------|--------|--------|
| **Merchant Account** | ✅ Works from Pakistan | ❌ Not available |
| **Payouts** | Wire transfer / Payoneer | Requires US/UK/EU entity |
| **Tax Handling** | ✅ Built-in (MOAT) | ❌ You handle it |
| **Pricing Model** | Revenue share (~5% + $0.50) | Per-transaction + monthly |
| **SaaS Fit** | ✅ Built for SaaS billing | General purpose |
| **Checkout UX** | Embedded + Overlay | Full custom required |
| **Pakistani Cards** | ✅ Visa/Mastercard via global network | N/A |

### Paddle is a "Merchant of Record"
- Paddle is the legal seller of your software
- They handle global sales tax (VAT, GST, US state tax)
- They handle chargebacks and compliance
- You get paid net of fees

### Integration Pattern
```typescript
// lib/payment-adapter.ts
export class PaddleAdapter implements PaymentProvider {
  async createCheckout(plan: string, userId: string) {
    // Paddle.js or Backend API
    // Returns checkout URL or opens overlay
  }
}
```

### Downsides
- Higher fees (~5.5% effective) vs Stripe (~2.9% + $0.30)
- Less customization than Stripe Elements
- Checkout flow is more "Paddle-branded"

---

## 🥈 Alternative 1: Lemon Squeezy (Secondary Global)

**Website:** [lemonsqueezy.com](https://lemonsqueezy.com)

### Why It Works
- Also a Merchant of Record (like Paddle)
- Beautiful checkout UI out of the box
- Handles tax automatically
- Supports Pakistan via Payoneer payouts

### Downsides
- Acquired by Stripe in 2024, but still operating independently as of 2026
- Smaller ecosystem than Paddle
- Higher fees than Paddle on some tiers

---

## 🥉 Alternative 2: 2Checkout / Verifone

**Website:** [verifone.com](https://verifone.com)

### Why It Works
- Historically the go-to for countries Stripe doesn't support
- Direct Pakistani bank settlement options
- Supports local payment methods in emerging markets

### Downsides
- UI/UX is dated (2026 still feels like 2018)
- Developer experience is poor
- Higher fraud hold rates
- Documentation is fragmented

---

## 🇵🇰 Local Market Alternative: Paymob

**Website:** [paymob.com](https://paymob.com)

### Why It Matters
If you want to sell **within Pakistan** (not just globally from Pakistan):

| Feature | Paymob |
|---------|--------|
| **JazzCash** | ✅ Direct integration |
| **EasyPaisa** | ✅ Direct integration |
| **Bank Alfalah** | ✅ |
| **Local Cards** | ✅ HBL, Meezan, etc. |
| **Settlement** | ✅ PKR to Pakistani bank |

### Strategy
Use **Paddle for global SaaS** (USD subscriptions) + **Paymob for Pakistan market** (PKR one-time or local subscriptions) as a future add-on.

---

## 🧱 Architecture: Payment-Agnostic Adapter

We've built an adapter interface so you can swap providers without touching business logic:

```
src/lib/payment-adapter.ts
├── PaymentProvider (interface)
├── PaddleAdapter (implements)
├── PaymobAdapter (implements, future)
└── MockAdapter (for testing)
```

### Plans Structure (Sprint 6)

| Tier | Price | Limits | Billing |
|------|-------|--------|---------|
| **Free** | $0 | 1 workspace, 250 issues, 2 projects | — |
| **Pro** | $8/user/mo | Unlimited issues, unlimited projects, cycles, roadmaps | Paddle/LS |
| **Team** | $14/user/mo | Private projects, guests, advanced analytics | Paddle/LS |
| **Enterprise** | Custom | SSO, SCIM, priority support, custom contracts | Manual/Invoice |

### Pakistan-Specific Considerations
1. **Entity:** You don't need a US LLC to use Paddle. Individual/solo-founder account works.
2. **Payouts:** Paddle pays to Payoneer → Payoneer to Pakistani bank (JazzCash, EasyPaisa, or direct). ~2-3 day settlement.
3. **Pricing:** Consider showing PKR equivalents for local marketing, but bill in USD globally.
4. **Tax:** Paddle handles tax compliance. You don't file US/EU returns.

---

## 🚀 Implementation Roadmap

| Phase | Action |
|-------|--------|
| **Sprint 6** | Integrate Paddle checkout overlay for Pro/Team tiers |
| **Post-launch** | Webhook handling for subscription events (activate/deactivate) |
| **Scale** | Add Paymob adapter for Pakistan domestic market |
| **Enterprise** | Manual invoicing, bank transfer, custom contracts |

---

## ⚠️ What NOT to Use

- **Stripe Test Mode for production** — Against ToS, no payouts.
- **PayPal for SaaS** — Terrible subscription APIs, high churn.
- **Direct local bank integration** — PCI compliance nightmare.
- **Cryptocurrency only** — 99% of B2B SaaS buyers won't pay in crypto.

---

*Recommendation: Start with Paddle. It's the Stripe-for-countries-Stripe-doesn't-serve. Switching later is trivial with our adapter pattern.*

*Last updated: 2026-06-01*