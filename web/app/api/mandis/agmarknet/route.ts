import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAgmarknetPrices,
  getAgmarknetArbitrageForFarmer,
  AGMARKNET_COMMODITY_MAP
} from '@/lib/agmarknetService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'Maharashtra';
  const district = searchParams.get('district') || undefined;
  const market = searchParams.get('market') || undefined;
  const commodity = searchParams.get('commodity') || searchParams.get('crop') || 'Onion';
  const apiKey = searchParams.get('apiKey') || undefined;
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');

  try {
    // If coordinates are provided, compute distance and net realization
    if (latStr && lonStr) {
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lonStr);
      const freight = parseFloat(searchParams.get('freight') || '2.0');

      const arbitrage = await getAgmarknetArbitrageForFarmer({
        latitude,
        longitude,
        crop: commodity,
        state,
        transportRatePerKm: freight,
        apiKey
      });

      return NextResponse.json(arbitrage);
    }

    // Otherwise, return filtered Agmarknet price records
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const data = await fetchAgmarknetPrices({
      state,
      district,
      market,
      commodity,
      limit,
      apiKey
    });

    return NextResponse.json({
      ...data,
      supportedCommodities: Object.keys(AGMARKNET_COMMODITY_MAP)
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to query Agmarknet API';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
