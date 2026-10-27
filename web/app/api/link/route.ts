import { NextRequest, NextResponse } from 'next/server';

// In-memory link code storage
const LINK_CODES = new Map<string, { userId: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'start';

    if (action === 'start') {
      const userId = body.userId || 'web-farmer-' + Math.floor(Math.random() * 1000);
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      LINK_CODES.set(code, { userId, expiresAt });
      const botPhone = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '919876543210';
      const waLink = `https://wa.me/${botPhone}?text=LINK%20${code}`;

      return NextResponse.json({
        success: true,
        code,
        waLink,
        expiresMinutes: 10,
        expiresAt: new Date(expiresAt).toISOString()
      });
    }

    if (action === 'verify') {
      const { code, externalId, channel } = body;
      const cleanCode = (code || '').toUpperCase().trim();
      const entry = LINK_CODES.get(cleanCode);

      if (!entry) {
        return NextResponse.json({ success: false, error: 'Invalid link code' }, { status: 400 });
      }

      if (Date.now() > entry.expiresAt) {
        LINK_CODES.delete(cleanCode);
        return NextResponse.json({ success: false, error: 'Code expired (10-minute limit)' }, { status: 400 });
      }

      LINK_CODES.delete(cleanCode);
      return NextResponse.json({
        success: true,
        message: `Successfully linked ${channel || 'WhatsApp'} (${externalId}) to user ${entry.userId}`,
        userId: entry.userId
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Link operation failed' }, { status: 500 });
  }
}
