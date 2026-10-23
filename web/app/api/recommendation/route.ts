import { NextRequest, NextResponse } from 'next/server';
import { evaluateCropSuitability, DEFAULT_SOIL_PROFILE, SoilHealthCardData } from '@/lib/soilAgronomy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const soil: SoilHealthCardData = {
      ...DEFAULT_SOIL_PROFILE,
      ...(body.soil || {}),
    };
    const acres = parseFloat(body.acres) || 2.5;
    const recommendations = evaluateCropSuitability(soil, acres);
    return NextResponse.json({ soil, acres, recommendations });
  } catch (err) {
    const defaultRecs = evaluateCropSuitability(DEFAULT_SOIL_PROFILE, 2.5);
    return NextResponse.json({ soil: DEFAULT_SOIL_PROFILE, acres: 2.5, recommendations: defaultRecs });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const acres = parseFloat(searchParams.get('acres') || '2.5');
  const recommendations = evaluateCropSuitability(DEFAULT_SOIL_PROFILE, acres);
  return NextResponse.json({ soil: DEFAULT_SOIL_PROFILE, acres, recommendations });
}
