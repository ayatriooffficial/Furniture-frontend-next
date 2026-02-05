import { fetchSliderData } from "@/actions/fetchSliderData";
import { NextResponse } from "next/server";

// Cache control: 1 hour in browser, 24 hours on CDN
export const revalidate = 3600; // ISR revalidation
export const dynamic = 'force-static'; // Generate static response at build time

export async function GET() {
  try {
    const data = await fetchSliderData();
    
    const response = NextResponse.json(data);
    
    // Set aggressive cache headers
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    response.headers.set('CDN-Cache-Control', 'max-age=86400');
    
    return response;
  } catch (error) {
    console.error('Error in slider data API:', error);
    return NextResponse.json({ error: 'Failed to fetch slider data' }, { status: 500 });
  }
} 