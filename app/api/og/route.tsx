/**
 * Dynamic Open Graph Image Generator
 * Generates beautiful social sharing images for tours, destinations, and pages
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Generate OG image with tour/destination information
 * Usage: /api/og?title=Tour Title&location=Egypt&price=500&type=program
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get('title') || 'Explore Egypt';
    const location = searchParams.get('location') || 'Egypt';
    const price = searchParams.get('price');
    const rating = searchParams.get('rating');
    const type = searchParams.get('type') || 'program'; // program, destination, article
    const imageUrl = searchParams.get('image');

    // Define template based on type
    const bgColor = type === 'program' ? '#1e40af' : type === 'destination' ? '#059669' : '#7c3aed';
    const icon = type === 'program' ? '✈️' : type === 'destination' ? '📍' : '📝';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${bgColor} 0%, #000000 100%)`,
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />

          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 80,
                marginBottom: 40,
              }}
            >
              {icon}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 30,
                maxWidth: '90%',
                lineHeight: 1.2,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {title}
            </div>

            {/* Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 36,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 40,
              }}
            >
              <span style={{ marginRight: 12 }}>📍</span>
              {location}
            </div>

            {/* Price and Rating Row */}
            <div
              style={{
                display: 'flex',
                gap: 60,
                alignItems: 'center',
              }}
            >
              {price && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '24px 48px',
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: 8,
                    }}
                  >
                    Starting from
                  </div>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: '#fbbf24',
                    }}
                  >
                    ${price}
                  </div>
                </div>
              )}

              {rating && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '24px 48px',
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: 8,
                    }}
                  >
                    Rating
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: '#fbbf24',
                    }}
                  >
                    <span style={{ marginRight: 12 }}>⭐</span>
                    {rating}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom branding */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              ZoeHoliday
            </div>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              • Your Adventure Awaits
            </div>
          </div>

          {/* Type badge */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 60,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '16px 32px',
              borderRadius: 50,
              fontSize: 24,
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {type === 'program' ? 'Tour Package' : type === 'destination' ? 'Destination' : 'Article'}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
