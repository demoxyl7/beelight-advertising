
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, message, source } = req.body || {};
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, message required' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || 'admin@beelightadvertising.com';
  const resendKey = process.env.RESEND_API_KEY;

  // Log always (works even before Resend setup)
  console.log('New BeeLight lead:', { name, email, phone, company, message, adminEmail });

  // If Resend key not set, still return success (pre-domain mode, frontend simulates email + saves to localStorage)
  if (!resendKey) {
    return res.status(200).json({ ok: true, mode: 'no-resend-key', to: adminEmail, note: 'Add RESEND_API_KEY in Vercel to enable real emails' });
  }

  try {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
      from: 'BeeLightAdvertising <onboarding@resend.dev>', // change to your domain when verified: e.g. no-reply@beelightadvertising.com
      to: [adminEmail],
      replyTo: email,
      subject: `New OOH Lead: ${name} - ${company || 'No company'}`,
      html: `
        <div style="font-family:Inter,sans-serif;background:#0A0A0F;color:#fff;padding:24px;border-radius:16px">
          <h2 style="color:#FFC300;margin:0 0 12px">🐝 New Campaign Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || '-'}</p>
          <p><b>Company:</b> ${company || '-'}</p>
          <p><b>Source:</b> ${source || 'contact-form'}</p>
          <hr style="border-color:rgba(255,255,255,0.1);margin:16px 0"/>
          <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
          <p style="margin-top:24px;font-size:12px;color:rgba(255,255,255,0.5)">Sent from BeeLightAdvertising Vercel deployment. WhatsApp admin: +2348032684135</p>
        </div>
      `,
    });

    if (error) throw error;
    return res.status(200).json({ ok: true, id: data?.id, to: adminEmail });
  } catch (err) {
    console.error('Resend error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
