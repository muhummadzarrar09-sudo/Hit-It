// Payment Adapter Pattern
// Supports Paddle (global/Pakistan), Paymob (local PK), Stripe (future markets)
// Sprint 6 will implement the active provider. For now: interface + mock.

export interface Plan {
  id: string;
  name: string;
  priceUsd: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  limits: {
    maxWorkspaces?: number;
    maxIssues?: number;
    maxProjects?: number;
    maxTeams?: number;
    allowsGuests?: boolean;
    allowsSso?: boolean;
    allowsPrivateTeams?: boolean;
  };
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface Subscription {
  id: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  planId: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentProvider {
  readonly name: string;
  initialize(): Promise<void>;
  getPlans(): Plan[];
  createCheckout(planId: string, customerEmail: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession>;
  verifySubscription(subscriptionId: string): Promise<Subscription | null>;
  openCustomerPortal(customerId: string): Promise<string>;
}

// ─── Paddle Adapter (Primary — Pakistan Compatible) ───────────────────────

export class PaddleAdapter implements PaymentProvider {
  readonly name = "paddle";
  private apiKey?: string;
  private environment: "sandbox" | "production" = "sandbox";

  async initialize(): Promise<void> {
    // Load Paddle.js or initialize backend SDK
    // Environment toggled via env var
    this.apiKey = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    this.environment = (process.env.NEXT_PUBLIC_PADDLE_ENV as any) || "sandbox";
  }

  getPlans(): Plan[] {
    return [
      {
        id: "free",
        name: "Free",
        priceUsd: 0,
        interval: "month",
        description: "For solo developers getting started.",
        features: ["Unlimited members", "250 issues", "2 projects", "1 workspace"],
        limits: { maxWorkspaces: 1, maxIssues: 250, maxProjects: 2, allowsGuests: false },
      },
      {
        id: "pro",
        name: "Pro",
        priceUsd: 8,
        interval: "month",
        description: "For growing teams shipping weekly.",
        features: ["Unlimited issues", "Unlimited projects", "Cycles & Roadmaps", "Priority support"],
        limits: { maxWorkspaces: 1, allowsGuests: false, allowsPrivateTeams: false },
      },
      {
        id: "team",
        name: "Team",
        priceUsd: 14,
        interval: "month",
        description: "For cross-functional product orgs.",
        features: ["Everything in Pro", "Private teams & guests", "Advanced insights", "Custom fields"],
        limits: { maxWorkspaces: 5, allowsGuests: true, allowsPrivateTeams: true },
      },
      {
        id: "enterprise",
        name: "Enterprise",
        priceUsd: 0,
        interval: "month",
        description: "For regulated enterprises. Custom pricing.",
        features: ["Everything in Team", "SSO / SCIM", "Audit logs", "Dedicated success manager", "Custom contracts"],
        limits: { allowsSso: true },
      },
    ];
  }

  async createCheckout(planId: string, customerEmail: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    // Integrate with Paddle.js overlay or backend API
    // Returns checkout URL for redirect or overlay token
    console.log("[Paddle] checkout", { planId, customerEmail });
    return { url: "https://sandbox-checkout.paddle.com/example", sessionId: "pi_sandbox_" + crypto.randomUUID() };
  }

  async verifySubscription(subscriptionId: string): Promise<Subscription | null> {
    // Webhook or API polling
    return null;
  }

  async openCustomerPortal(customerId: string): Promise<string> {
    return "https://sandbox-customer.paddle.com/example";
  }
}

// ─── Paymob Adapter (Pakistan Local — JazzCash / EasyPaisa) ────────────────

export class PaymobAdapter implements PaymentProvider {
  readonly name = "paymob";

  async initialize(): Promise<void> {
    // Paymob API key loaded from env
  }

  getPlans(): Plan[] {
    // PKR pricing for local market
    return [
      {
        id: "pro-pk",
        name: "Pro (PKR)",
        priceUsd: 8, // Displayed as ~PKR 2,200
        interval: "month",
        description: "Pay locally with JazzCash or EasyPaisa.",
        features: ["Unlimited issues", "Unlimited projects", "Local payment support"],
        limits: {},
      },
    ];
  }

  async createCheckout(planId: string, customerEmail: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    // Paymob integration: authentication + order registration + payment key + iframe redirect
    console.log("[Paymob] checkout", { planId, customerEmail });
    return { url: "https://accept.paymob.com/api/acceptance/iframes/example", sessionId: "paymob_" + crypto.randomUUID() };
  }

  async verifySubscription(subscriptionId: string): Promise<Subscription | null> {
    return null;
  }

  async openCustomerPortal(customerId: string): Promise<string> {
    return "";
  }
}

// ─── Mock Adapter (Development / Testing) ─────────────────────────────────

export class MockAdapter implements PaymentProvider {
  readonly name = "mock";
  private subs = new Map<string, Subscription>();

  async initialize(): Promise<void> {}

  getPlans(): Plan[] {
    return new PaddleAdapter().getPlans();
  }

  async createCheckout(planId: string, customerEmail: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    const sessionId = "mock_" + crypto.randomUUID();
    this.subs.set(sessionId, {
      id: sessionId,
      status: "active",
      planId,
      currentPeriodStart: Date.now(),
      currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
      cancelAtPeriodEnd: false,
    });
    return { url: successUrl + "?session_id=" + sessionId, sessionId };
  }

  async verifySubscription(subscriptionId: string): Promise<Subscription | null> {
    return this.subs.get(subscriptionId) || null;
  }

  async openCustomerPortal(customerId: string): Promise<string> {
    return "/billing";
  }
}

// ─── Provider Factory ────────────────────────────────────────────────────

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "mock";
  switch (provider) {
    case "paddle":
      return new PaddleAdapter();
    case "paymob":
      return new PaymobAdapter();
    case "mock":
    default:
      return new MockAdapter();
  }
}