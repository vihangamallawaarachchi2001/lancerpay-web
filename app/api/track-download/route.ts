import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    const { platform } = await request.json();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { error } = await supabase
      .from('downloads')
      .insert([
        { platform, user_agent: userAgent }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Track download error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
