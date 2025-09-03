import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";
import Stripe from "stripe";

// Extended type for subscription with current_period_end
type SubscriptionWithPeriod = Stripe.Subscription & {
  current_period_end?: number;
};

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature")!;
    const buf = Buffer.from(await req.arrayBuffer());
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Bad signature", { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeletion(deletedSubscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" }, 
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: SubscriptionWithPeriod) {
  // Find user by Stripe customer ID
  const customerId = typeof subscription.customer === 'string' 
    ? subscription.customer 
    : subscription.customer.id;
    
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!user) {
    console.error("User not found for customer:", customerId);
    return;
  }

  // Upsert subscription record
  await supabaseAdmin
    .from("subscriptions")
    .upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_sub_id: subscription.id,
      plan: subscription.items.data[0]?.price?.nickname || "unknown",
      status: subscription.status,
      current_period_end: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : new Date().toISOString(),
    });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_sub_id", subscription.id);
}
