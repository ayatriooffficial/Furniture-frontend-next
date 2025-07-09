import { fetchSliderData } from "@/actions/fetchSliderData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchSliderData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in slider data API:', error);
    return NextResponse.json({ error: 'Failed to fetch slider data' }, { status: 500 });
  }
} 