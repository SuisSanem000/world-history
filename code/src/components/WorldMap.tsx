import React, { useMemo, useRef, useState } from "react";
import { buildWorldMapGeometry, type CountryFeature } from "../data/worldMapData";
import { CountryShape } from "./CountryShape";

export interface WorldMapProps {
  hoveredCountry: CountryFeature | null;
  selectedCountry: CountryFeature | null;
  onHoverCountry: (country: CountryFeature | null) => void;
  onSelectCountry: (country: CountryFeature) => void;
}

interface ViewTransform {
  scale: number;
  x: number;
  y: number;
}

/**
 * Interactive 2D World Map rendered as React SVG components.
 * - Country borders are always visible.
 * - No text is shown on the map by default.
 * - Hovering over a country displays its name inside that country.
 * - Clicking a country triggers the country name popup.
 */
export const WorldMap: React.FC<WorldMapProps> = ({
  hoveredCountry,
  selectedCountry,
  onHoverCountry,
  onSelectCountry,
}) => {
  const mapGeometry = useMemo(() => buildWorldMapGeometry(), []);

  const [transform, setTransform] = useState<ViewTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const isDraggingRef = useRef(false);
  const didMoveRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  const handleWheel: React.WheelEventHandler<SVGSVGElement> = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
    setTransform((prev) => {
      const nextScale = Math.min(12, Math.max(1, prev.scale * zoomFactor));
      if (nextScale === 1) {
        return { scale: 1, x: 0, y: 0 };
      }
      return {
        ...prev,
        scale: nextScale,
      };
    });
  };

  const handleMouseDown: React.MouseEventHandler<SVGSVGElement> = (event) => {
    if (event.button !== 0) return;
    isDraggingRef.current = true;
    didMoveRef.current = false;
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
  };

  const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (event) => {
    if (!isDraggingRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      didMoveRef.current = true;
    }
    setTransform((prev) => ({
      ...prev,
      x: dragStartRef.current.originX + dx,
      y: dragStartRef.current.originY + dy,
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCountryClick = (country: CountryFeature) => {
    if (didMoveRef.current) return;
    onSelectCountry(country);
  };

  const zoomIn = () =>
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(12, prev.scale * 1.35),
    }));

  const zoomOut = () =>
    setTransform((prev) => {
      const nextScale = Math.max(1, prev.scale / 1.35);
      return nextScale === 1
        ? { scale: 1, x: 0, y: 0 }
        : { ...prev, scale: nextScale };
    });

  const resetZoom = () => setTransform({ scale: 1, x: 0, y: 0 });

  // Compute adaptive font size so the country's name fits cleanly inside the hovered country
  const getHoverFontSize = (country: CountryFeature): number => {
    const minDimension = Math.min(country.boundsWidth, country.boundsHeight);
    const baseSize = Math.min(
      14,
      Math.max(6.5, Math.min(country.boundsWidth / (country.name.length * 0.55), minDimension * 0.38))
    );
    return baseSize / Math.pow(transform.scale, 0.55);
  };

  return (
    <div className="world-map-container">
      <div className="map-zoom-controls" aria-label="Map zoom controls">
        <button type="button" onClick={zoomIn} title="Zoom in">
          +
        </button>
        <button type="button" onClick={zoomOut} title="Zoom out">
          −
        </button>
        {transform.scale > 1 || transform.x !== 0 || transform.y !== 0 ? (
          <button type="button" onClick={resetZoom} title="Reset map view" className="reset-btn">
            Reset
          </button>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${mapGeometry.width} ${mapGeometry.height}`}
        className="world-map-svg"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          isDraggingRef.current = false;
          onHoverCountry(null);
        }}
      >
        <g
          transform={`translate(${mapGeometry.width / 2 + transform.x}, ${
            mapGeometry.height / 2 + transform.y
          }) scale(${transform.scale}) translate(${-mapGeometry.width / 2}, ${-mapGeometry.height / 2})`}
        >
          {/* Ocean Sphere */}
          <path d={mapGeometry.spherePath} className="map-ocean-sphere" />

          {/* Subtle Latitude/Longitude Graticule */}
          <path d={mapGeometry.graticulePath} className="map-graticule" />

          {/* All Country React Components (Always-visible borders, no default text) */}
          <g className="map-countries-layer" style={{ ["--map-scale" as string]: transform.scale }}>
            {mapGeometry.countries.map((country) => (
              <CountryShape
                key={country.id}
                country={country}
                isHovered={hoveredCountry?.id === country.id}
                isSelected={selectedCountry?.id === country.id}
                onMouseEnter={onHoverCountry}
                onMouseLeave={() => onHoverCountry(null)}
                onSelect={handleCountryClick}
              />
            ))}
          </g>

          {/* Hovered Country Name Rendered Directly Inside That Country */}
          {hoveredCountry && (
            <g
              className="country-inside-label-group"
              transform={`translate(${hoveredCountry.centroid[0]}, ${hoveredCountry.centroid[1]})`}
              pointerEvents="none"
            >
              <text
                className="country-inside-label"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={getHoverFontSize(hoveredCountry)}
                strokeWidth={2.4 / Math.pow(transform.scale, 0.65)}
              >
                {hoveredCountry.name}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

