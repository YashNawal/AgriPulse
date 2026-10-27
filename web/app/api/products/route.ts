import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@shared/mockData';
import { Product } from '@shared/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const crop = searchParams.get('crop');

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('products').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let list: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          crop: p.crop,
          brand: p.brand,
          packSize: p.pack_size,
          price: Number(p.price),
          stock: p.stock ?? 100,
          imageUrl: p.image_url || '',
          description: p.description || '',
          isAvailable: p.is_available ?? true
        }));
        if (crop && crop !== 'all') {
          list = list.filter(p => p.crop.toLowerCase().includes(crop.toLowerCase()) || p.crop.includes('All Crops'));
        }
        return NextResponse.json(list);
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using fallback:', e);
    }
  }

  let list = [...MOCK_PRODUCTS];
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }
  if (crop && crop !== 'all') {
    list = list.filter(p => p.crop.toLowerCase().includes(crop.toLowerCase()) || p.crop.includes('All Crops'));
  }

  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body: Omit<Product, 'id'> = await req.json();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('products').insert({
          name: body.name,
          category: body.category,
          crop: body.crop,
          brand: body.brand,
          pack_size: body.packSize,
          price: body.price,
          description: body.description,
          stock: body.stock ?? 100,
          is_available: body.isAvailable ?? true,
        }).select();
        if (!error && data && data[0]) {
          return NextResponse.json(data[0], { status: 201 });
        }
      } catch (e) {
        console.warn('Supabase product insert failed:', e);
      }
    }
    const newId = Math.floor(Math.random() * 9000) + 1000;
    const newProduct: Product = { ...body, id: newId };
    MOCK_PRODUCTS.unshift(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
  }
}
