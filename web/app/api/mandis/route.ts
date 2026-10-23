import { NextRequest, NextResponse } from 'next/server';
import { findNearestAndHighestMandis, INDIAN_MANDIS } from '@/lib/geoService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '20.1472');
  const lon = parseFloat(searchParams.get('lon') || '74.2255');
  const crop = searchParams.get('crop') || 'Onion';
  const freight = parseFloat(searchParams.get('freight') || '2.0');
  const fee = parseFloat(searchParams.get('fee') || '1.5');
  const loss = parseFloat(searchParams.get('loss') || '1.0');

  const summary = findNearestAndHighestMandis(lat, lon, crop, freight, fee, loss);
  return NextResponse.json(summary);
}
