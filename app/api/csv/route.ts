import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Falta el parámetro url' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'text/csv,text/plain,*/*' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
