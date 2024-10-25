import { verifyIdToken } from '@/services/firebase/admin';
import { cookies } from 'next/headers'; // Use this to get cookies in App Router
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the cookie from the incoming request
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyIdToken(token);

    return NextResponse.json({
      user: { uid: decodedToken.uid, email: decodedToken.email },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
