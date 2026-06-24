/* eslint-disable import/prefer-default-export */
import { useState, useMemo, useId, useEffect, useRef } from 'react';
import { Mercator } from '@visx/geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { easings } from '@react-spring/web';
import { geoPath } from '@visx/vendor/d3-geo';
import geomapData from '../../../GeoMap/india-geo.json';
import { GeoMapSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

const BUILD_UP_DURATION_MS = 1200;
const MINI_MAP_DIMENSIONS = { width: 116, height: 98 };
const MINI_SHIMMER_DIMENSIONS = { width: 256, height: 98 };
const MINI_MAP_PADDING = 15.75;
const MAP_TRANSLATE_Y_OFFSET = 5;
const DOT_PATTERN_SIZE = 10;
const MINI_MAP_PLACE_HOLDER_STATE = 'Maharashtra';

const SHIMMER_STOPS = [
  { offset: '0%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '35%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '37%', color: 'rgba(230, 232, 234, 0.55)' },
  { offset: '50%', color: 'rgba(230, 232, 234, 0.95)' },
  { offset: '63%', color: 'rgba(230, 232, 234, 0.55)' },
  { offset: '65%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '100%', color: 'rgba(255, 255, 255, 0)' },
];

const MINI_MAP_SHIMMER_STOPS = [
  { offset: '0%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '44%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '45%', color: 'rgba(230, 232, 234, 0.55)' },
  { offset: '50%', color: 'rgba(230, 232, 234, 0.95)' },
  { offset: '55%', color: 'rgba(230, 232, 234, 0.55)' },
  { offset: '56%', color: 'rgba(255, 255, 255, 0)' },
  { offset: '100%', color: 'rgba(255, 255, 255, 0)' },
];

function getMapBounds(
  features: Feature<Geometry>[],
  widthMap: number,
  heightMap: number,
) {
  const path = geoPath();
  const allBounds = features.map((f) => path.bounds(f));

  const xs = allBounds.flatMap((b) => [b[0][0], b[1][0]]);
  const ys = allBounds.flatMap((b) => [b[0][1], b[1][1]]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);

  const dx = x1 - x0;
  const dy = y1 - y0;
  const scale = Math.min(widthMap / dx, heightMap / dy) * 50;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;

  return { center: [cx, cy] as [number, number], scale };
}

const renderShimmerStops = () =>
  SHIMMER_STOPS.map(({ offset, color }) => (
    <stop key={offset} offset={offset} stopColor={color} />
  ));

const renderMiniShimmerStops = () =>
  MINI_MAP_SHIMMER_STOPS.map(({ offset, color }) => (
    <stop key={offset} offset={offset} stopColor={color} />
  ));

function GeoMapSkeletonComponent({
  width,
  height,
  animate = true,
  retryIsAutoPhase,
}: Readonly<GeoMapSkeletonProps>): React.ReactElement {
  const uniqueId = useId();
  const showShimmer = retryIsAutoPhase;

  const geoMapHeight = height;
  const maxRevealRadius = useMemo(
    () => Math.hypot(width / 2, geoMapHeight / 2),
    [width, geoMapHeight],
  );

  const ids = useMemo(
    () => ({
      mainShimmer: `geo-map-main-shimmer-${uniqueId}`,
      miniShimmer: `geo-map-mini-shimmer-${uniqueId}`,
      revealClip: `geo-map-reveal-${uniqueId}`,
      revealMask: `geo-map-reveal-mask-${uniqueId}`,
      softenFilter: `geo-map-reveal-soften-${uniqueId}`,
      dotPattern: `geo-map-dot-pattern-${uniqueId}`,
    }),
    [uniqueId],
  );

  const shimmerAnimRef = useRef<SVGAnimateElement | null>(null);
  const miniShimmerAnimRef = useRef<SVGAnimateElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [revealProgress, setRevealProgress] = useState<number>(animate ? 0 : 1);

  const geoData = geomapData as FeatureCollection<Geometry>;

  const miniMapData = useMemo(
    () => geoData.features.find((f) => f.id === MINI_MAP_PLACE_HOLDER_STATE),
    [geoData.features],
  );

  const mapView = useMemo(
    () => getMapBounds(geoData.features, width, geoMapHeight),
    [geoData.features, width, geoMapHeight],
  );

  const mapTranslate = useMemo(
    () =>
      [width / 2, geoMapHeight / 2 + MAP_TRANSLATE_Y_OFFSET] as [
        number,
        number,
      ],
    [width, geoMapHeight],
  );

  useEffect(() => {
    if (!animate) {
      setRevealProgress(1);
      return undefined;
    }

    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.max(0, Math.min(1, elapsed / BUILD_UP_DURATION_MS));
      setRevealProgress(easings.easeInOutCubic(progress));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [animate, geoMapHeight, width]);

  useEffect(() => {
    const shouldStartShimmer = animate && showShimmer && revealProgress >= 1;

    if (!shouldStartShimmer) return undefined;

    const mainAnim = shimmerAnimRef.current as unknown as {
      beginElement?: () => void;
      endElement?: () => void;
    } | null;
    const miniAnim = miniShimmerAnimRef.current as unknown as {
      beginElement?: () => void;
      endElement?: () => void;
    } | null;

    const frame = requestAnimationFrame(() => {
      mainAnim?.beginElement?.();
      miniAnim?.beginElement?.();
    });

    return () => cancelAnimationFrame(frame);
  }, [animate, showShimmer, revealProgress]);

  const miniMap = useMemo(() => {
    if (!miniMapData) return null;

    return (
      <div className="absolute right-4 top-4 flex h-[98px] w-64 gap-4 rounded-3xl bg-[#FBFBFC]">
        <svg
          width={MINI_MAP_DIMENSIONS.width}
          height={MINI_MAP_DIMENSIONS.height}
          className="min-w-[116px]"
        >
          <Mercator
            data={[miniMapData]}
            fitExtent={[
              [
                [MINI_MAP_PADDING, MINI_MAP_PADDING],
                [
                  MINI_MAP_DIMENSIONS.width - MINI_MAP_PADDING,
                  MINI_MAP_DIMENSIONS.height - MINI_MAP_PADDING,
                ],
              ],
              miniMapData,
            ]}
          >
            {(mercator) => (
              <g>
                {mercator.features.map(({ path }, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <path key={i} d={path || ''} fill="#F7F7F8" />
                ))}
              </g>
            )}
          </Mercator>
        </svg>

        <div className="flex flex-col justify-between py-6 pr-4">
          <div className="h-3 w-[72px] rounded bg-[#F7F7F8]" />
          <div className="h-2 w-[48px] rounded bg-[#F7F7F8]" />
          <div className="h-4 w-[80px] rounded bg-[#F7F7F8]" />
        </div>

        {showShimmer && animate && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <svg
              width={MINI_SHIMMER_DIMENSIONS.width}
              height={MINI_SHIMMER_DIMENSIONS.height}
              className="absolute inset-0 opacity-30"
            >
              <defs>
                <linearGradient
                  id={ids.miniShimmer}
                  gradientUnits="userSpaceOnUse"
                  x1={0}
                  y1={0}
                  x2={MINI_SHIMMER_DIMENSIONS.width}
                  y2={MINI_SHIMMER_DIMENSIONS.height}
                  gradientTransform={`translate(-${MINI_SHIMMER_DIMENSIONS.width}, 0)`}
                  key="shimmer"
                >
                  {renderMiniShimmerStops()}
                  {animate && (
                    <animateTransform
                      ref={miniShimmerAnimRef}
                      begin="indefinite"
                      attributeName="gradientTransform"
                      type="translate"
                      dur="1.7s"
                      repeatCount="indefinite"
                      from={`-${MINI_SHIMMER_DIMENSIONS.width} 0`}
                      to={`${MINI_SHIMMER_DIMENSIONS.width * 2} 0`}
                    />
                  )}
                </linearGradient>
              </defs>
              <rect
                width={MINI_SHIMMER_DIMENSIONS.width}
                height={MINI_SHIMMER_DIMENSIONS.height}
                fill={`url(#${ids.miniShimmer})`}
              />
            </svg>
          </div>
        )}
      </div>
    );
  }, [miniMapData, showShimmer, animate, ids.miniShimmer]);

  const renderMapStates = (
    fillColor: string,
    strokeColor = '#FFFFFF',
    isShimmer = false,
  ) => (
    <Mercator
      data={geoData.features}
      scale={mapView.scale}
      center={mapView.center}
      translate={mapTranslate}
    >
      {(mercator) => (
        <g>
          {mercator.features.map(({ path }, i) => (
            <path
              key={isShimmer ? `shimmer-state-${i}` : `state-${i}`}
              d={path || ''}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={1.5}
              className={!isShimmer ? 'relative z-10' : undefined}
            />
          ))}
        </g>
      )}
    </Mercator>
  );

  const revealRadius = maxRevealRadius * revealProgress;

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="bg-fill-fill">
        <defs>
          <clipPath id={ids.revealClip}>
            <circle cx={width / 2} cy={geoMapHeight / 2} r={revealRadius} />
          </clipPath>

          <filter
            id={ids.softenFilter}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>

          <mask id={ids.revealMask} maskUnits="userSpaceOnUse">
            <rect x={0} y={0} width={width} height={height} fill="black" />
            <g filter={`url(#${ids.softenFilter})`}>
              <circle
                cx={width / 2}
                cy={geoMapHeight / 2}
                r={Math.max(0, revealRadius)}
                fill="white"
              />
            </g>
          </mask>

          <linearGradient
            id={ids.mainShimmer}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={250}
            y2={133}
            gradientTransform="translate(-250, 0)"
            key={showShimmer ? 'shimmer' : 'normal'}
          >
            {renderShimmerStops()}
            {animate && (
              <animateTransform
                ref={shimmerAnimRef}
                begin="indefinite"
                attributeName="gradientTransform"
                type="translate"
                dur="1.6s"
                repeatCount="indefinite"
                from="-250 0"
                to={`${width + 250} 0`}
              />
            )}
          </linearGradient>

          <pattern
            id={ids.dotPattern}
            width={DOT_PATTERN_SIZE}
            height={DOT_PATTERN_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={DOT_PATTERN_SIZE / 2}
              cy={DOT_PATTERN_SIZE / 2}
              r={1}
              fill="#EFEFF1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${ids.dotPattern})`} />

        <g
          clipPath={`url(#${ids.revealClip})`}
          mask={`url(#${ids.revealMask})`}
        >
          {renderMapStates('#F7F7F8')}
        </g>

        {showShimmer && animate && revealProgress >= 1 && (
          <g
            clipPath={`url(#${ids.revealClip})`}
            mask={`url(#${ids.revealMask})`}
            className="opacity-40"
          >
            {renderMapStates(`url(#${ids.mainShimmer})`, 'transparent', true)}
          </g>
        )}
      </svg>

      {miniMap}
    </div>
  );
}

export const GeoMapSkeleton = withRetryOverlay(GeoMapSkeletonComponent);
