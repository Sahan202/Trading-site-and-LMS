import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  context: { params: Promise<{ action: string }> }
) {
  const { action } = await context.params;
  if (!['login', 'signup'].includes(action)) {
    return new NextResponse('Page not found.', { status: 404 });
  }
  try {
    return NextResponse.redirect(
      new URL(action === 'login' ? '/#login' : '/#register', _request.url)
    );
  } catch {
    return new NextResponse(
      'LMS connection is not configured. Please contact support.',
      {
        status: 503,
      }
    );
  }
}
