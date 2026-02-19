import { Router, Request, Response } from 'express';
import { Resend } from 'resend';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // If no Resend API key configured, just log and return success (dev mode)
  if (!process.env.RESEND_API_KEY) {
    console.log('[Contact] No RESEND_API_KEY — logging message instead:');
    console.log({ name, email, message });
    res.json({ ok: true });
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL ?? 'hello@danishshard.dev',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[Contact] Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
