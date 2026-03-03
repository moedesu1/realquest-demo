// ============================================================
// REAL QUEST — Contact Form Email Notification
// ============================================================
// Deploy: supabase functions deploy send-contact-email
// Env vars needed:
//   RESEND_API_KEY — Resend.com API key
//   ADMIN_EMAIL — Admin notification email address
//   SUPABASE_SERVICE_ROLE_KEY — For DB trigger invocation
//
// Two ways to invoke:
// 1. Database webhook trigger on contact_submissions INSERT
// 2. Direct HTTP call from frontend (with anon key auth)
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@realquest.jp';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@realquest.jp';

interface ContactSubmission {
  name: string;
  email: string;
  category: string;
  message: string;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    // Support both direct call and DB webhook trigger format
    let submission: ContactSubmission;
    if (body.record) {
      // DB webhook trigger format
      submission = body.record;
    } else {
      submission = body;
    }

    const { name, email, category, message } = submission;

    if (!name || !email || !category || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const categoryLabels: Record<string, string> = {
      quest: 'クエストについて',
      order: '注文・配送について',
      account: 'アカウントについて',
      bug: '不具合報告',
      other: 'その他',
    };

    if (!RESEND_API_KEY) {
      console.log('RESEND_API_KEY not set. Email would be sent to:', ADMIN_EMAIL);
      console.log('Contact:', { name, email, category, message });
      return new Response(JSON.stringify({ success: true, note: 'Email skipped (no API key)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send admin notification via Resend
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `リアクエ <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `[リアクエ] お問い合わせ: ${categoryLabels[category] || category}`,
        html: `
          <h2>リアクエ — 新しいお問い合わせ</h2>
          <table style="border-collapse:collapse; width:100%; max-width:600px;">
            <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold; width:120px;">お名前</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">メール</td><td style="padding:8px; border:1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">カテゴリ</td><td style="padding:8px; border:1px solid #ddd;">${categoryLabels[category] || category}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">内容</td><td style="padding:8px; border:1px solid #ddd; white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
          </table>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorBody = await adminEmailResponse.text();
      console.error('Resend API error:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send auto-reply to submitter
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `リアクエ REAL QUEST <${FROM_EMAIL}>`,
        to: [email],
        subject: '【リアクエ】お問い合わせを受け付けました',
        html: `
          <div style="max-width:600px; margin:0 auto; font-family:'Noto Sans JP',sans-serif;">
            <h2 style="color:#d4a340;">◆ リアクエ REAL QUEST</h2>
            <p>${escapeHtml(name)} 様</p>
            <p>お問い合わせいただきありがとうございます。<br>
            以下の内容で受け付けました。担当者より順次ご連絡いたします。</p>
            <div style="background:#f5f5f5; padding:16px; border-radius:8px; margin:16px 0;">
              <p style="margin:0 0 8px;"><strong>カテゴリ:</strong> ${categoryLabels[category] || category}</p>
              <p style="margin:0; white-space:pre-wrap;"><strong>内容:</strong><br>${escapeHtml(message)}</p>
            </div>
            <p style="color:#888; font-size:12px;">※ このメールは自動送信です。直接返信いただいても対応できない場合がございます。</p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
