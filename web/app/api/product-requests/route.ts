import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PRODUCT_REQUESTS } from '@shared/mockData';
import { ProductRequest } from '@shared/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('product_requests').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: ProductRequest[] = data.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          productId: r.product_id || 1,
          productName: r.notes?.replace('Requested product: ', '') || 'Agri Input Request',
          farmerName: r.farmer_name,
          farmerPhone: r.farmer_phone,
          village: r.village,
          district: r.district,
          quantity: r.quantity || 1,
          status: r.status as any,
          notes: r.notes,
          createdAt: r.created_at
        }));
        return NextResponse.json(mapped);
      }
    } catch (e) {
      console.warn('Supabase requests fetch failed:', e);
    }
  }

  let list = [...MOCK_PRODUCT_REQUESTS];
  if (status && status !== 'all') {
    list = list.filter(r => r.status === status);
  }
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body: Omit<ProductRequest, 'id' | 'createdAt' | 'status'> = await req.json();
    let savedId: number | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('product_requests').insert({
          user_id: body.userId || null,
          product_id: body.productId && body.productId > 0 ? body.productId : null,
          quantity: body.quantity || 1,
          farmer_name: body.farmerName || 'Farmer',
          farmer_phone: body.farmerPhone || '9999999999',
          village: body.village || 'Local Village',
          district: body.district || 'District',
          status: 'pending',
          notes: body.notes || `Requested product: ${body.productName || 'Agri Input'}`
        }).select();

        if (!error && data && data[0]) {
          savedId = Number(data[0].id);
        }
      } catch (dbErr) {
        console.warn('Supabase insert product_request failed:', dbErr);
      }
    }

    const newId = savedId || (Math.floor(Math.random() * 90000) + 10000);
    const newReq: ProductRequest = {
      ...body,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_PRODUCT_REQUESTS.unshift(newReq);
    return NextResponse.json({
      success: true,
      requestId: newId,
      request: newReq,
      message: `ऑर्डर क्रमांक #${newId} यशस्वीरित्या Supabase मध्ये नोंदवला गेला आहे! कृषी अधिकारी लवकरच संपर्क करतील.`
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (isSupabaseConfigured) {
      try {
        await supabase.from('product_requests').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update product_request failed:', e);
      }
    }
    const target = MOCK_PRODUCT_REQUESTS.find(r => r.id === id);
    if (target) {
      target.status = status;
    }
    return NextResponse.json({ success: true, id, status });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 400 });
  }
}
