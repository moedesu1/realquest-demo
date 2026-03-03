// ============================================================
// REAL QUEST — Shopify Webhook → Supabase Orders Sync
// ============================================================
// Deploy: supabase functions deploy shopify-webhook
// Env vars needed:
//   SHOPIFY_WEBHOOK_SECRET — Shopify webhook HMAC secret
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (NOT anon)
//
// Shopify webhook URL:
//   https://<project-ref>.supabase.co/functions/v1/shopify-webhook
//
// Register in Shopify Admin → Settings → Notifications → Webhooks:
//   - orders/create
//   - orders/updated
//   - orders/paid
//   - orders/fulfilled
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const SHOPIFY_WEBHOOK_SECRET = Deno.env.get('SHOPIFY_WEBHOOK_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.text();

  // Verify Shopify HMAC signature
  if (SHOPIFY_WEBHOOK_SECRET) {
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') || '';
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SHOPIFY_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const computedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)));

    if (computedHmac !== hmacHeader) {
      console.error('Invalid HMAC signature');
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const order = JSON.parse(body);
  const topic = req.headers.get('x-shopify-topic') || 'orders/create';

  // Initialize Supabase with service role key (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Map Shopify order status
  let status = 'pending';
  if (order.financial_status === 'paid') status = 'paid';
  if (order.fulfillment_status === 'fulfilled') status = 'delivered';
  else if (order.fulfillments?.length > 0) status = 'shipped';
  if (order.cancelled_at) status = 'cancelled';

  // Extract line items
  const lineItems = (order.line_items || []).map((item: any) => ({
    title: item.title,
    quantity: item.quantity,
    price: parseInt(item.price),
    variant_id: item.variant_id,
  }));

  // Try to find user by email
  let userId = null;
  if (order.email) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const matchedUser = users?.users?.find(
      (u: any) => u.email?.toLowerCase() === order.email.toLowerCase()
    );
    if (matchedUser) userId = matchedUser.id;
  }

  // Upsert order
  const orderData = {
    shopify_order_id: String(order.id),
    shopify_order_number: order.name || String(order.order_number),
    user_id: userId,
    status,
    total_price: Math.round(parseFloat(order.total_price)),
    line_items: lineItems,
    shipping_address: order.shipping_address || null,
    created_at: order.created_at,
  };

  const { error } = await supabase
    .from('orders')
    .upsert(orderData, { onConflict: 'shopify_order_id' });

  if (error) {
    console.error('Failed to upsert order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If order is paid, update accepted_quests status
  if (status === 'paid' || status === 'shipped' || status === 'delivered') {
    if (userId) {
      for (const item of lineItems) {
        if (item.variant_id) {
          // Find quest by variant_id
          const { data: quest } = await supabase
            .from('quests')
            .select('id')
            .eq('shopify_variant_id', String(item.variant_id))
            .single();

          if (quest) {
            await supabase
              .from('accepted_quests')
              .upsert({
                user_id: userId,
                quest_id: quest.id,
                status: 'purchased',
                shopify_order_id: String(order.id),
              }, { onConflict: 'user_id,quest_id' });
          }
        }
      }
    }
  }

  console.log(`Processed ${topic} for order ${order.name || order.id} → status: ${status}`);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
