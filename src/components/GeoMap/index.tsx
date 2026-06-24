/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
import {
  useState,
  forwardRef,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Mercator } from '@visx/geo';
import { geoCentroid, geoPath, geoArea } from 'd3-geo';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { useSpring, animated, easings } from '@react-spring/web';
import geomapData from './india-geo.json';
import Spot from './Spot';
import StarSpot from './StarSpot';
import { Legends, LinearLegendProps } from '../Charts';
import {
  ChartSkeleton,
  GeoMapSkeletonProps,
} from '../Charts/ChartsSkeletonLoader';
import { INDIAN_STATES_AND_UTS, ISLAND_LOCATIONS } from './constants';
import EmptyDataIcon from '../Charts/Legends/EmptyDataIcon';

const AnimatedMercator = animated(Mercator);

interface TooltipData {
  label: string;
  value: number;
}

export interface StatesThreshold {
  color: string;
  minValue?: number;
  maxValue?: number;
}

export interface MapStateData {
  stateName: string;
  value: number;
  tooltipText?: string;
}
export interface CitiesData {
  city: string;
  state: string;
  value: number;
  tooltipText?: string;
}

type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface GeoMapProps {
  transactionValueFormatter?: (value: number) => string;
  width: number;
  height: number;
  mapStateData: MapStateData[];
  numberOfHighlightedStates?: number;
  activeStateColor?: string;
  miniStateMapColor?: string;
  statesThreshold: StatesThreshold[];
  citiesData: CitiesData[];
  tooltipValueFormatter?: (value: number) => string;
  tooltipDescriptionClassName?: string;
  tooltipValueClassName?: string;
  tooltipWrapperClassName?: string;
  miniMapStateLabel: string;
  miniMapLabel: string;
  activeStateClickHandler?: (state: string) => void;
  miniMapWrapperClassName?: string;
  dataTestId?: string;
  wrapperClassName?: string;
  legendsProps?: PartialExcept<
    Omit<LinearLegendProps, 'isOutlined' | 'isSelectable' | 'legendType'>,
    'legendData'
  >;
  isLoading?: boolean;
  skeletonProps?: Omit<
    GeoMapSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataLegendLabel?: string;
  noDataLegendDescription?: string;
  noDataMiniMapLabel?: string;
}

export const GeoMap = forwardRef<HTMLDivElement, GeoMapProps>(
  (
    {
      transactionValueFormatter,
      mapStateData,
      width,
      height,
      numberOfHighlightedStates = 3,
      activeStateColor = '#F15701',
      miniStateMapColor = '#F9BC99',
      statesThreshold,
      citiesData,
      tooltipValueFormatter,
      tooltipDescriptionClassName = '',
      tooltipValueClassName = '',
      tooltipWrapperClassName = '',
      miniMapLabel = '',
      miniMapStateLabel = '',
      activeStateClickHandler,
      miniMapWrapperClassName = '',
      dataTestId = 'geo-map-test-id',
      wrapperClassName = '',
      legendsProps,
      isLoading = false,
      skeletonProps = {},
      noDataLegendLabel = '0',
      noDataLegendDescription = 'No Data',
      noDataMiniMapLabel = 'No Data',
    },
    ref,
  ) => {
    const {
      tooltipData,
      tooltipLeft,
      tooltipTop,
      showTooltip,
      hideTooltip,
      tooltipOpen,
    } = useTooltip<TooltipData>();

    const isLegendsProps = !!legendsProps?.legendData;

    const legendsRef = useRef<HTMLDivElement | null>(null);

    // VALIDATE: ZERO/NEGATIVE VALUES, DUPLICATES/INVALID STATE ENTRIES
    const filteredMapStateData = useMemo(() => {
      const seen = new Set<string>();
      const validStates = new Set(
        [...INDIAN_STATES_AND_UTS].map((state) => state.trim().toLowerCase()),
      );

      return mapStateData.filter((state: MapStateData) => {
        if (state.value <= 0) return false;

        const stateName = state.stateName.trim().toLowerCase();
        if (!stateName || seen.has(stateName)) return false;

        // Validate against the list of actual Indian states/UTs
        if (!validStates.has(stateName)) {
          // eslint-disable-next-line no-console
          console.warn(`[GeoMap]\nInvalid state name: "${stateName}".\n`);
          return false;
        }

        seen.add(stateName);
        return true;
      });
    }, [mapStateData]);

    const mapStateSortedData = useMemo(
      () => [...filteredMapStateData].sort((a, b) => b.value - a.value),
      [filteredMapStateData],
    );

    // SHOW THE 'NO DATA' LEGEND WHEN ANY INDIAN STATE/UT IS ABSENT FROM THE PROVIDED MAP DATA
    const legendData = useMemo(() => {
      const legends = [...(legendsProps?.legendData ?? [])];

      if (mapStateSortedData.length < INDIAN_STATES_AND_UTS.length) {
        legends.push({
          label: noDataLegendLabel,
          description: noDataLegendDescription,
          customLegendIcon: <EmptyDataIcon />,
        });
      }
      return legends;
    }, [
      legendsProps?.legendData,
      mapStateSortedData,
      noDataLegendLabel,
      noDataLegendDescription,
    ]);

    const { containerRef, TooltipInPortal, forceRefreshBounds } =
      useTooltipInPortal({
        scroll: true,
      });

    const legendsHeight =
      isLegendsProps && legendsRef.current
        ? legendsRef.current.getBoundingClientRect().height + 22
        : 0;

    const geoMapHeight = useMemo(
      () => height - legendsHeight,
      [height, legendsHeight],
    );

    const [stateAnimationFinished, setStateAnimationFinished] = useState(false);

    const [geoData] = useState<FeatureCollection<Geometry>>(
      geomapData as FeatureCollection<Geometry>,
    );

    const [activeState, setActiveState] = useState<string | null>(null);
    const [mouseActiveState, setMouseActiveState] = useState<string | null>(
      null,
    );

    function getPolygonCentroidForLakshadweep(
      feature: Feature<Geometry, GeoJsonProperties>,
      pathGenerator: ReturnType<typeof geoPath>,
    ): [number, number] {
      let largestArea = 0;
      let largestCentroid: [number, number] = [0, 0];

      if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon) => {
          const polygonFeature: Feature<Geometry, GeoJsonProperties> = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: polygon },
            properties: feature.properties,
          };
          const area = geoArea(polygonFeature);
          if (area > largestArea) {
            largestArea = area;
            largestCentroid = pathGenerator?.centroid(polygonFeature);
          }
        });
      }

      return largestCentroid;
    }

    const citiesSorted = useMemo(
      () =>
        citiesData
          .filter((city) => city.state === activeState)
          .sort((a, b) => b.value - a.value),
      [citiesData, activeState],
    );

    const citiesNames = useMemo(
      () => citiesSorted.map((c) => c.city),
      [citiesSorted],
    );

    const highlightedStates = useMemo(
      () =>
        mapStateSortedData
          .slice(0, numberOfHighlightedStates)
          .map((d) => d.stateName),
      [mapStateSortedData, numberOfHighlightedStates],
    );

    const topState = mapStateSortedData.length ? mapStateSortedData[0] : null;
    const topStateName = topState?.stateName ?? null;

    const topStateGeoData = useMemo(
      () =>
        geoData.features.find((f) => f.id === (activeState || topStateName)),
      [activeState, geoData.features, topStateName],
    );

    const activeFeature = useMemo(
      () => geoData.features.find((f) => f.id === activeState) ?? null,
      [activeState, geoData.features],
    );

    const getStateView = (
      feature: Feature<Geometry, GeoJsonProperties>,
      widthState: number,
      heightState: number,
      scaleFactor: number,
    ) => {
      const path = geoPath();
      const bounds = path.bounds(feature);
      const [[x0, y0], [x1, y1]] = bounds;
      const dx = x1 - x0;
      const dy = y1 - y0;

      const scale =
        Math.min((widthState - 153) / dx, (heightState - 50) / dy) *
        scaleFactor;

      const [cx, cy] = geoCentroid(feature);

      return { center: [cx, cy + 0.09] as [number, number], scale };
    };

    const getMapBounds = (
      features: Feature<Geometry>[],
      widthMap: number,
      heightMap: number,
    ) => {
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
    };

    const initialView = useMemo(
      () => getMapBounds(geoData.features, width, geoMapHeight),
      [geoData.features, width, geoMapHeight],
    );

    const target = useMemo(
      () =>
        activeFeature
          ? getStateView(
              activeFeature,
              width,
              geoMapHeight,
              isLegendsProps ? 35 : 37,
            )
          : initialView,
      [activeFeature, width, geoMapHeight, isLegendsProps, initialView],
    );

    const [prev, setPrev] = useState({
      cx: initialView.center[0],
      cy: initialView.center[1],
      scale: initialView.scale,
    });

    const dx = target.center[0] - prev.cx;
    const dy = target.center[1] - prev.cy;
    const dscale = target.scale - prev.scale;

    const distance = Math.sqrt(dx * dx + dy * dy + dscale * dscale);

    const duration = Math.min(300, Math.max(150, distance * 10));

    const spring = useSpring({
      from: prev,
      to: {
        scale: target.scale,
        cx: target.center[0],
        cy: target.center[1],
      },
      config: {
        duration,
        easing: easings.easeInOutCubic,
      },
      onRest: () => {
        setPrev({
          cx: target.center[0],
          cy: target.center[1],
          scale: target.scale,
        });

        requestAnimationFrame(() => {
          if (activeState) {
            setStateAnimationFinished(true);
          } else {
            setStateAnimationFinished(false);
          }
        });
      },
    });

    const tooltipSpring = useSpring({
      from: { height: 0, opacity: 0, transform: 'translateY(-10px)' },
      to: {
        height: tooltipOpen ? 60 : 0,
        opacity: tooltipOpen ? 1 : 0,
        transform: tooltipOpen ? 'translate(-50%,0)' : 'translate(-50%,10px)',
      },
      config: { tension: 220, friction: 20 },
    });

    const tooltipSpringForBorder = useSpring({
      from: { height: 0 },
      to: { height: tooltipOpen ? 86 : 0 },
      config: { tension: 220, friction: 20 },
    });

    const [showStarCenter, setShowStarCenter] = useState<CitiesData | null>(
      null,
    );

    const generateFillColor = (
      isStateDataValid: boolean,
      stateValue: number | undefined,
      isIsland: boolean | undefined,
    ) => {
      const colorBasedOnRange = (value?: number) =>
        statesThreshold.find(
          (t) =>
            value !== undefined &&
            (t.minValue === undefined || value >= t.minValue) &&
            (t.maxValue === undefined || value <= t.maxValue),
        )?.color ?? statesThreshold[statesThreshold.length - 1]?.color;

      if (isStateDataValid) {
        return colorBasedOnRange(stateValue);
      }

      if (isIsland) {
        return 'url(#islandDiagonalStripes)';
      }

      return 'url(#diagonalStripes)';
    };

    useEffect(() => {
      const handleScroll = () => {
        if (activeState) return;
        hideTooltip();
      };

      document.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, [hideTooltip, activeState]);

    useEffect(() => {
      if (activeState && citiesNames.length) {
        const isCityPresent = geoData.features.filter((geoInfo) => {
          const propertiesData = geoInfo.properties as
            | { st_nm?: string; district?: string }
            | undefined;

          return (
            activeState === propertiesData?.st_nm &&
            propertiesData?.district &&
            propertiesData.district === citiesNames[0]
          );
        });

        if (!isCityPresent.length) {
          const stateInfo = geoData.features.find(
            (geo) => geo.id === activeState,
          );

          if (!stateInfo) return;

          setShowStarCenter(citiesSorted[0] || null);
        }
      } else {
        setShowStarCenter(null);
      }
    }, [activeState, citiesNames, citiesSorted, geoData.features]);

    const defaultMiniMapFeature = useMemo(
      () => geoData.features.find((f) => f.id === 'Maharashtra'),
      [geoData.features],
    );

    const miniMap = useMemo(() => {
      const miniMapData = topStateGeoData ?? defaultMiniMapFeature;
      if (!miniMapData) return null;

      const miniMapFillColor = topStateGeoData
        ? miniStateMapColor
        : 'url(#diagonalStripes)';

      const displayName = activeState
        ? citiesNames[0]
        : (topStateGeoData?.id ?? noDataMiniMapLabel);

      const transactionValue = activeState
        ? citiesSorted[0]?.value
        : topState?.value;

      return (
        <div
          className={`${miniMapWrapperClassName} border-border-brand-focus-ring bg-fill-fill absolute right-4 top-4 flex w-64 gap-4 rounded-3xl border border-solid pr-2`}
        >
          <svg width={116} height={98} className="min-w-[116px]">
            <Mercator
              data={[miniMapData]}
              fitExtent={[
                [
                  [15.75, 10.5],
                  [116 - 15.75, 98 - 10.5],
                ],
                miniMapData,
              ]}
            >
              {(mercator) => (
                <g>
                  {mercator.features.map(({ path }, i) => (
                    <path key={i} d={path || ''} fill={miniMapFillColor} />
                  ))}
                </g>
              )}
            </Mercator>
          </svg>
          <div className="flex flex-col gap-1 pt-3">
            <p className="text-text-text paragraph-extra-small">
              {activeState ? miniMapStateLabel : miniMapLabel}
            </p>
            <div>
              <h6 className="text-text-dark font-semibold">{displayName}</h6>
              <p className="heading-5-semibold text-text-dark opacity-80">
                {transactionValueFormatter?.(transactionValue || 0) ||
                  `${transactionValue || 0}`}
              </p>
            </div>
          </div>
        </div>
      );
    }, [
      topStateGeoData,
      defaultMiniMapFeature,
      activeState,
      citiesSorted,
      topState?.value,
      miniMapWrapperClassName,
      miniMapStateLabel,
      miniMapLabel,
      citiesNames,
      transactionValueFormatter,
      miniStateMapColor,
      noDataMiniMapLabel,
    ]);

    const spotShowTooltip = useCallback(
      (
        selectedMapData: CitiesData | undefined,
        pixelCentroid: [number, number],
      ) => {
        if (!stateAnimationFinished) return;

        showTooltip({
          tooltipData: {
            label: selectedMapData?.tooltipText || selectedMapData?.city || '',
            value: selectedMapData?.value || 0,
          },
          tooltipLeft: pixelCentroid[0] - 1,
          tooltipTop: pixelCentroid[1] - 1,
        });
      },
      [showTooltip, stateAnimationFinished],
    );

    const renderLinearLegend = isLegendsProps ? (
      <Legends
        {...legendsProps}
        ref={legendsRef}
        wrapperClassName={`${legendsProps?.wrapperClassName ?? ''} !w-max absolute bottom-[1.375rem] left-1/2 -translate-x-1/2 bg-fill-fill`}
        isOutlined
        isSelectable={false}
        legendType="linear"
        descriptionClassName={`${legendsProps?.descriptionClassName ?? ''} !font-normal !text-text-light`}
        labelTextClassName={`${legendsProps?.labelTextClassName ?? ''} !font-medium`}
        legendData={legendData}
      />
    ) : null;

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          animate
          type="geoMap"
          {...skeletonProps}
        />
      );
    }

    return (
      <div
        className={`relative ${wrapperClassName}`}
        ref={ref}
        data-testid={dataTestId}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <svg
          width={width}
          height={height}
          className="bg-fill-fill"
          onClick={() => {
            setActiveState(null);
            setStateAnimationFinished(false);
            activeStateClickHandler?.('');
          }}
          ref={containerRef}
          onMouseEnter={forceRefreshBounds}
        >
          <defs>
            <pattern
              id="dotPattern"
              width={10}
              height={10}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={10 / 2} cy={10 / 2} r={1} fill="#EFEFF1" />
            </pattern>
            <pattern
              id="diagonalStripes"
              width="3"
              height="3"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(60)"
            >
              <rect width="3" height="3" fill="#F6F7F7" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="3"
                stroke="#5E6879"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="islandDiagonalStripes"
              width="0.6"
              height="0.6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(60)"
            >
              <rect width="0.6" height="0.6" fill="#F6F7F7" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                stroke="#5E6879"
                strokeWidth="0.1"
              />
            </pattern>
            <filter
              id="borderGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation="1.5"
                result="blur"
              />
              <feFlood
                floodColor={activeStateColor}
                floodOpacity="0.8"
                result="color"
              />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite
                in="glow"
                in2="SourceAlpha"
                operator="out"
                result="outerGlow"
              />
              <feMerge>
                <feMergeNode in="outerGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="outerGlowOnly"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation="1.5"
                result="blur"
              />
              <feFlood
                floodColor={activeStateColor}
                floodOpacity="0.8"
                result="color"
              />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite
                in="glow"
                in2="SourceAlpha"
                operator="out"
                result="outerGlow"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
          <AnimatedMercator
            data={geoData.features}
            scale={spring.scale.to((s) => s)}
            center={
              spring.cx.to((x) => [x, spring.cy.get()]) as unknown as [
                number,
                number,
              ]
            }
            translate={[
              width / 2,
              geoMapHeight / 2 + (isLegendsProps ? 20 : 5),
            ]}
          >
            {(mercator) => {
              const mapRender = mercator.features.map(
                ({ feature, path }, i) => {
                  const f = feature as Feature<Geometry, GeoJsonProperties>;
                  if (!f?.id) return null;

                  const featureId = f.id != null ? String(f.id) : '';
                  const highlightedMatchedState =
                    highlightedStates.includes(featureId);

                  const pathGenerator = geoPath(mercator.projection);
                  const pixelCentroid = pathGenerator.centroid(feature);

                  const selectedMapData = mapStateSortedData.find(
                    (d) => d.stateName === featureId,
                  );

                  const stateValue = selectedMapData?.value;
                  const isStateDataValid = Boolean(
                    stateValue && stateValue > 0,
                  );
                  const isIsland = ISLAND_LOCATIONS.includes(featureId);
                  const fillColor = generateFillColor(
                    isStateDataValid,
                    stateValue,
                    isIsland,
                  );

                  const highestThreshold = statesThreshold[0];
                  const isStateInTopThreshold =
                    stateValue !== undefined &&
                    (highestThreshold?.minValue === undefined ||
                      stateValue >= highestThreshold.minValue) &&
                    (highestThreshold?.maxValue === undefined ||
                      stateValue <= highestThreshold.maxValue);

                  const strokeColor = isIsland ? 'none' : '#FFFFFF';
                  const strokeWidth = isIsland ? 0 : 0.8;

                  if (
                    featureId === 'Lakshadweep' &&
                    f.geometry.type === 'MultiPolygon'
                  ) {
                    const largestIslandCentroid =
                      getPolygonCentroidForLakshadweep(f, pathGenerator);

                    return (
                      <g
                        onMouseEnter={() => {
                          if (activeState) return;

                          setMouseActiveState(featureId);
                          if (!highlightedMatchedState) return;

                          const [px, py] =
                            largestIslandCentroid || pixelCentroid;

                          showTooltip({
                            tooltipData: {
                              label:
                                selectedMapData?.tooltipText ||
                                selectedMapData?.stateName ||
                                '',
                              value: selectedMapData?.value || 0,
                            },
                            tooltipTop: py,
                            tooltipLeft: px,
                          });
                        }}
                        onMouseLeave={() => {
                          if (activeState) return;
                          setMouseActiveState(null);
                          hideTooltip();
                        }}
                        key={`state-${i}`}
                      >
                        {f.geometry.coordinates.map((polygon, j) => {
                          const polygonFeature: Feature<
                            Geometry,
                            GeoJsonProperties
                          > = {
                            type: 'Feature',
                            geometry: { type: 'Polygon', coordinates: polygon },
                            properties: f.properties,
                          };

                          const polygonPath = pathGenerator(polygonFeature);
                          const [cx, cy] =
                            pathGenerator.centroid(polygonFeature);
                          return (
                            <path
                              key={`lakshadweep-${j}`}
                              d={polygonPath || ''}
                              fill={fillColor}
                              stroke="#FFFFFF"
                              strokeWidth={0.5}
                              transform={`translate(${cx}, ${cy}) scale(4) translate(${-cx}, ${-cy})`}
                              onClick={(e) => {
                                hideTooltip();
                                if (!isStateDataValid) return;
                                setActiveState(activeState ? null : featureId);

                                if (!activeState) {
                                  activeStateClickHandler?.(featureId);
                                } else {
                                  activeStateClickHandler?.('');
                                }

                                e.stopPropagation();
                              }}
                              className={`relative z-10 ${isStateDataValid ? 'cursor-pointer' : 'cursor-default'}`}
                            />
                          );
                        })}
                        {highlightedMatchedState && !activeState ? (
                          <Spot
                            x={largestIslandCentroid?.[0] || 0}
                            y={largestIslandCentroid?.[1] || 0}
                            color={isStateInTopThreshold ? '#fff' : undefined}
                          />
                        ) : null}
                      </g>
                    );
                  }

                  return (
                    <g
                      onMouseEnter={() => {
                        if (activeState) return;

                        setMouseActiveState(featureId);
                        if (!highlightedMatchedState) return;

                        const [px, py] = pixelCentroid;

                        showTooltip({
                          tooltipData: {
                            label:
                              selectedMapData?.tooltipText ||
                              selectedMapData?.stateName ||
                              '',
                            value: selectedMapData?.value || 0,
                          },
                          tooltipTop: py,
                          tooltipLeft: px,
                        });
                      }}
                      onMouseLeave={() => {
                        if (activeState) return;
                        setMouseActiveState(null);
                        hideTooltip();
                      }}
                      key={`state-${i}`}
                    >
                      <path
                        d={path || ''}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        onClick={(e) => {
                          hideTooltip();
                          if (!isStateDataValid) return;
                          setActiveState(activeState ? null : featureId);

                          if (!activeState) {
                            activeStateClickHandler?.(featureId);
                          } else {
                            activeStateClickHandler?.('');
                          }

                          e.stopPropagation();
                        }}
                        className={`relative z-10 ${isStateDataValid ? 'cursor-pointer' : 'cursor-default'}`}
                      />
                      {highlightedMatchedState && !activeState ? (
                        <Spot
                          x={pixelCentroid[0]}
                          y={pixelCentroid[1]}
                          color={isStateInTopThreshold ? '#fff' : undefined}
                        />
                      ) : null}
                    </g>
                  );
                },
              );

              const spotSelection = mercator.features.map(({ feature }, i) => {
                const f = feature as Feature<Geometry, GeoJsonProperties>;
                const featureId = f.id ? String(f.id) : '';
                const geoInfo = f.properties as
                  | { st_nm?: string; district?: string }
                  | undefined;

                if (activeState !== geoInfo?.st_nm) {
                  return null;
                }

                if (
                  geoInfo?.district &&
                  citiesNames.includes(geoInfo.district)
                ) {
                  const pathGenerator = geoPath(mercator.projection);
                  let pixelCentroid: [number, number] = [0, 0];
                  if (
                    featureId &&
                    featureId === 'Lakshadweep' &&
                    f.geometry.type === 'MultiPolygon'
                  ) {
                    pixelCentroid = getPolygonCentroidForLakshadweep(
                      f,
                      pathGenerator,
                    );
                  } else {
                    pixelCentroid = pathGenerator.centroid(feature);
                  }

                  const selectedMapData = citiesData.find(
                    (d) => d.city === geoInfo.district,
                  );

                  return citiesNames[0] !== geoInfo.district ? (
                    <Spot
                      key={`${featureId ?? 'no-id'}-${i}`}
                      x={pixelCentroid[0]}
                      y={pixelCentroid[1]}
                      color="#fff"
                    />
                  ) : (
                    <StarSpot
                      key={`${featureId ?? 'no-id'}-${i}`}
                      x={pixelCentroid[0]}
                      y={pixelCentroid[1]}
                      showTooltip={() => {
                        spotShowTooltip(selectedMapData, pixelCentroid);
                      }}
                      stateAnimationFinished={stateAnimationFinished}
                      hideTooltip={hideTooltip}
                    />
                  );
                }
                return undefined;
              });

              const spotStarSelection = mercator.features.map(
                ({ feature }, i) => {
                  const f = feature as Feature<Geometry, GeoJsonProperties>;
                  const featureId = f.id ? String(f.id) : '';

                  if (!showStarCenter || featureId !== activeState) return null;

                  const pathGenerator = geoPath(mercator.projection);
                  const pixelCentroid = pathGenerator.centroid(feature);

                  return (
                    <StarSpot
                      key={`${featureId ?? 'no-id'}-${i}`}
                      x={pixelCentroid[0]}
                      y={pixelCentroid[1]}
                      showTooltip={() => {
                        spotShowTooltip(showStarCenter, pixelCentroid);
                      }}
                      stateAnimationFinished={stateAnimationFinished}
                      hideTooltip={hideTooltip}
                    />
                  );
                },
              );

              const hoveredStateBorder = mercator.features.map(
                ({ feature, path }, i) => {
                  const f = feature as Feature<Geometry, GeoJsonProperties>;

                  const featureId = f.id != null ? String(f.id) : '';

                  const selectedMapData = mapStateData.find(
                    (d) => d.stateName === featureId,
                  );
                  const stateValue = selectedMapData?.value;

                  const isStateDataValid = Boolean(
                    stateValue && stateValue > 0,
                  );
                  if (!isStateDataValid) return null;

                  const isHovered =
                    featureId === mouseActiveState && !activeState;

                  const isIsland = ISLAND_LOCATIONS.includes(featureId);

                  const clipId = `clip-${featureId.replaceAll(/[^a-zA-Z0-9_-]/g, '_')}`;

                  // Handle Lakshadweep island
                  if (
                    featureId === 'Lakshadweep' &&
                    f.geometry.type === 'MultiPolygon'
                  ) {
                    const pathGenerator = geoPath(mercator.projection);
                    return (
                      <g key={`hover-${i}`}>
                        {f.geometry.coordinates.map((polygon, j) => {
                          const polygonFeature: Feature<
                            Geometry,
                            GeoJsonProperties
                          > = {
                            type: 'Feature',
                            geometry: { type: 'Polygon', coordinates: polygon },
                            properties: f.properties,
                          };

                          const polygonPath = pathGenerator(polygonFeature);
                          const [cx, cy] =
                            pathGenerator.centroid(polygonFeature);
                          const polygonClipId = `${clipId}-${j}`;

                          return (
                            <g key={`hover-lakshadweep-${j}`}>
                              <clipPath id={polygonClipId}>
                                <path
                                  d={polygonPath || ''}
                                  transform={`translate(${cx}, ${cy}) scale(4) translate(${-cx}, ${-cy})`}
                                />
                              </clipPath>
                              {/* Inner-only highlight stroke (clipped to island fill) */}
                              <animated.path
                                d={polygonPath || ''}
                                fill="none"
                                clipPath={`url(#${polygonClipId})`}
                                transform={`translate(${cx}, ${cy}) scale(3) translate(${-cx}, ${-cy})`}
                                pointerEvents="none"
                                className={`${isHovered || activeState === selectedMapData?.stateName ? 'stroke-fill-action' : 'stroke-transparent'}  stroke-[0.2px] transition-[stroke] duration-150 ease-in-out`}
                              />
                            </g>
                          );
                        })}
                      </g>
                    );
                  }

                  // Handle Andaman and Nicobar Islands and regular states
                  return (
                    <g key={`hover-${i}`}>
                      <clipPath id={clipId}>
                        <path d={path || ''} />
                      </clipPath>
                      {/* Inner-only highlight stroke (clipped to state fill) */}
                      <animated.path
                        d={path || ''}
                        fill="none"
                        clipPath={`url(#${clipId})`}
                        pointerEvents="none"
                        className={`${isIsland ? 'stroke-1' : 'stroke-2'}  ${isHovered || activeState === selectedMapData?.stateName ? 'stroke-fill-action' : 'stroke-transparent'}  transition-[stroke] duration-150 ease-in-out `}
                      />
                      {/* Outer glow only (in the inter-state gap), no color fill in the gap */}
                      {!isIsland && (
                        <animated.path
                          d={path || ''}
                          fill="none"
                          filter={
                            isHovered ||
                            activeState === selectedMapData?.stateName
                              ? 'url(#outerGlowOnly)'
                              : undefined
                          }
                          pointerEvents="none"
                          className={`${isHovered || activeState === selectedMapData?.stateName ? 'stroke-fill-action' : 'stroke-transparent'} stroke-1 transition-[stroke] duration-150 ease-in-out `}
                        />
                      )}
                    </g>
                  );
                },
              );

              return (
                <>
                  <g>{mapRender}</g>
                  {activeState ? <g>{spotSelection}</g> : null}
                  {activeState && showStarCenter ? (
                    <g>{spotStarSelection}</g>
                  ) : null}
                  <g>{hoveredStateBorder}</g>
                </>
              );
            }}
          </AnimatedMercator>
        </svg>
        {tooltipOpen && tooltipData ? (
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            detectBounds={false}
            className=" pointer-events-none absolute w-fit !bg-transparent !shadow-none"
            style={{
              transform: 'translate(-9.5px,-108%) translateY(-1.4px)',
            }}
          >
            <div
              className={`relative flex w-[1px] flex-col ${tooltipWrapperClassName}`}
            >
              <animated.div
                className="bg-fill-info-dark relative left-0 top-0 h-fit w-fit -translate-x-1/2 rounded p-2 text-center"
                style={tooltipSpring}
              >
                <p className={`text-text-on-fill ${tooltipValueClassName}`}>
                  {tooltipValueFormatter?.(tooltipData.value) ||
                    tooltipData.value}
                </p>
                <div
                  className={`text-text-lighter paragraph-small whitespace-nowrap ${tooltipDescriptionClassName}`}
                >
                  {tooltipData.label}
                </div>
              </animated.div>
              <animated.div
                className=" bg-fill-info-dark relative w-[1px] -translate-x-1/2"
                style={{ height: tooltipSpringForBorder.height }}
              />
            </div>
          </TooltipInPortal>
        ) : (
          ''
        )}
        {miniMap}
        {renderLinearLegend}
      </div>
    );
  },
);
