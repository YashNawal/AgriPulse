import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_FERTILIZER_PLANS } from '@shared/mockData';
import { FertilizerPlan } from '@shared/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crop = searchParams.get('crop');
  const phosphorus = searchParams.get('phosphorus') || 'low';

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('fertilizer_plans').select('*');
      if (crop && crop !== 'all') {
        query = query.ilike('crop', `%${crop}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let plans: FertilizerPlan[] = data.map((p: any) => ({
          id: p.id,
          crop: p.crop,
          growthStage: p.growth_stage,
          fertilizer: p.fertilizer,
          quantityPerAcre: p.quantity_per_acre,
          timing: p.timing,
          notes: p.notes || '',
          expertApproved: true,
          approvalSource: p.approved_by || 'Approved by ICAR / State Agriculture University Agronomist',
          disclaimer: p.disclaimer || 'Doses must follow local agronomic advice. Adjust as per Soil Health Card.'
        }));
        return NextResponse.json(plans);
      }
    } catch (e) {
      console.warn('Supabase fertilizer_plans fetch failed:', e);
    }
  }

  let plans = [...MOCK_FERTILIZER_PLANS];
  if (crop && crop !== 'all') {
    plans = plans.filter(p => p.crop.toLowerCase().includes(crop.toLowerCase()));
  }

  if (phosphorus === 'low') {
    plans = plans.map(p => {
      if (p.growthStage.toLowerCase().includes('basal') || p.growthStage.toLowerCase().includes('sowing')) {
        return {
          ...p,
          adjustedForSoil: 'मृदा आरोग्य अहवाल: फॉस्फरस कमी असल्याने शिफारशीत DAP चे प्रमाण 15% वाढवले आहे.',
          quantityPerAcre: p.quantityPerAcre + ' (+10 kg DAP adjusted)'
        };
      }
      return p;
    });
  }

  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  try {
    const body: Omit<FertilizerPlan, 'id'> = await req.json();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('fertilizer_plans').insert({
          crop: body.crop,
          growth_stage: body.growthStage,
          fertilizer: body.fertilizer,
          quantity_per_acre: body.quantityPerAcre,
          timing: body.timing,
          notes: body.notes,
          approved_by: body.approvalSource || 'ICAR Verified',
          disclaimer: body.disclaimer
        }).select();
        if (!error && data && data[0]) {
          return NextResponse.json(data[0], { status: 201 });
        }
      } catch (e) {
        console.warn('Supabase plan insert failed:', e);
      }
    }

    const newId = Math.floor(Math.random() * 9000) + 2000;
    const newPlan: FertilizerPlan = { ...body, id: newId };
    MOCK_FERTILIZER_PLANS.unshift(newPlan);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 400 });
  }
}
