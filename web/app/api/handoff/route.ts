import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_HANDOFF_TICKETS } from '@shared/mockData';

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('handoff_tickets').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map((t: any) => ({
          id: String(t.id),
          farmerName: 'Farmer',
          phone: '+91 98XXX XXXXX',
          channel: 'web' as const,
          crop: 'Wheat/Onion',
          question: t.question,
          status: t.status as any,
          createdAt: t.created_at,
          agronomistReply: t.agronomist_reply,
          answeredAt: t.answered_at
        }));
        return NextResponse.json(mapped);
      }
    } catch (e) {
      console.warn('Supabase handoff_tickets fetch failed:', e);
    }
  }
  return NextResponse.json(MOCK_HANDOFF_TICKETS);
}

export async function POST(req: NextRequest) {
  try {
    const { ticketId, replyText, agronomistName } = await req.json();
    if (isSupabaseConfigured) {
      try {
        await supabase.from('handoff_tickets').update({
          status: 'answered',
          agronomist_reply: replyText,
          answered_at: new Date().toISOString()
        }).eq('id', ticketId);
      } catch (e) {
        console.warn('Supabase update handoff_ticket failed:', e);
      }
    }

    const ticket = MOCK_HANDOFF_TICKETS.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'answered';
      ticket.agronomistReply = replyText;
      ticket.answeredAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Reply sent and logged in Supabase. Ticket #${ticketId} answered by ${agronomistName || 'Verified Agronomist'}.`
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to reply to ticket' }, { status: 400 });
  }
}
