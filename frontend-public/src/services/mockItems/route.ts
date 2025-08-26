import { NextResponse } from "next/server";
import mockData from "@/mockData/mockData.json"

export async function GET() {
    const data = Object.values(mockData).flat();

    if (!data) {
        return NextResponse.json({ error: 'Invalid subplace type' }, { status: 400 });
    }

    return NextResponse.json(data);
}