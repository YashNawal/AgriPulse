import { NextRequest, NextResponse } from 'next/server';
import { reverseGeocodeCoords, fetchIPLocation, DEFAULT_FARMER_LOCATION } from '@/lib/location';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');

  if (latStr && lonStr) {
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (!isNaN(lat) && !isNaN(lon)) {
      const details = await reverseGeocodeCoords(lat, lon);
      return NextResponse.json(details);
    }
  }

  // Fallback to IP Geolocation
  const ipDetails = await fetchIPLocation();
  return NextResponse.json(ipDetails);
}
