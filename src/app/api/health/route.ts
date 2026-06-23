import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { executeQuery } from '@/shared/lib/db';

export async function GET() {
  try {
    const result = await executeQuery('SELECT 1 as connected');
    return NextResponse.json({ 
      status: 'ok', 
      database: 'Neon connected successfully',
      result 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
