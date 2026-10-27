import { NextResponse } from 'next/server';
import { MOCK_ADMIN_STATS, MOCK_PRODUCT_REQUESTS, MOCK_HANDOFF_TICKETS, MOCK_PRODUCTS } from '@shared/mockData';

export async function GET() {
  const pendingRequests = MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'pending').length;
  const openQuestions = MOCK_HANDOFF_TICKETS.filter(t => t.status === 'open').length;

  return NextResponse.json({
    ...MOCK_ADMIN_STATS,
    newProductRequests: pendingRequests,
    openExpertQuestions: openQuestions,
    totalProducts: MOCK_PRODUCTS.length,
    messagesToday: 184 + Math.floor(Math.random() * 10),
    timestamp: new Date().toISOString()
  });
}
