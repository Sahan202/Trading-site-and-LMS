import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '66px 76px',
          background:
            'linear-gradient(130deg, #040c21 0%, #102450 65%, #075276 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
          border: '2px solid #22618d',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          KRISH FX{' '}
          <span style={{ marginLeft: 12, color: '#80dcff' }}>SWING LAB</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 65,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -2,
          }}
        >
          <span>TURN YOUR TRADING</span>
          <span>KNOWLEDGE INTO A</span>
          <span style={{ color: '#80dcff' }}>STRONGER FUTURE.</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#b9cce8',
          }}
        >
          <span>AMF Concept · Swing Trading · Mentorship</span>
          <span>krishfxswinglab.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
