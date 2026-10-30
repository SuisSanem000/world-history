import countriesTopoJson from "world-atlas/countries-50m.json";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";
import { geoNaturalEarth1, geoPath, geoArea, geoGraticule10 } from "d3-geo";

export interface CountryFeature {
  id: string;
  name: string;
  path: string;
  centroid: [number, number];
  boundsWidth: number;
  boundsHeight: number;
}

export interface WorldMapGeometry {
  width: number;
  height: number;
  spherePath: string;
  graticulePath: string;
  countries: CountryFeature[];
}

interface CountryProperties {
  name: string;
}

const MAP_WIDTH = 1280;
const MAP_HEIGHT = 680;

/**
 * Extracts the primary (largest spherical area) polygon from a MultiPolygon feature
 * so the hovered country name is always positioned inside the main landmass.
 */
function getPrimaryLandmassFeature(
  countryFeature: Feature<Geometry, CountryProperties>
): Feature<Geometry, CountryProperties> {
  if (countryFeature.geometry.type !== "MultiPolygon") {
    return countryFeature;
  }

  let maxArea = -1;
  let largestPolygon: Feature<Polygon, CountryProperties> | null = null;

  for (const polygonCoords of countryFeature.geometry.coordinates) {
    const candidate: Feature<Polygon, CountryProperties> = {
      type: "Feature",
      properties: countryFeature.properties,
      geometry: {
        type: "Polygon",
        coordinates: polygonCoords,
      },
    };
    const area = geoArea(candidate);
    if (area > maxArea) {
      maxArea = area;
      largestPolygon = candidate;
    }
  }

  return largestPolygon ?? countryFeature;
}

/**
 * Builds the 2D SVG paths and interior label centroids for all world countries.
 */
export function buildWorldMapGeometry(): WorldMapGeometry {
  const projection = geoNaturalEarth1().fitExtent(
    [
      [24, 24],
      [MAP_WIDTH - 24, MAP_HEIGHT - 24],
    ],
    { type: "Sphere" }
  );

  const pathGenerator = geoPath(projection);
  const spherePath = pathGenerator({ type: "Sphere" }) || "";
  const graticulePath = pathGenerator(geoGraticule10()) || "";

  const topology = countriesTopoJson as unknown as Topology<{
    countries: GeometryCollection<CountryProperties>;
  }>;

  const featureCollection = feature(
    topology,
    topology.objects.countries
  ) as FeatureCollection<Geometry, CountryProperties>;

  const countries: CountryFeature[] = [];

  featureCollection.features.forEach((geoFeature, index) => {
    const svgPath = pathGenerator(geoFeature);
    if (!svgPath) return;

    const name = geoFeature.properties?.name || `Country ${index + 1}`;
    const id = String(geoFeature.id ?? `${name}-${index}`);

    const primaryLandmass = getPrimaryLandmassFeature(geoFeature);
    const [cx, cy] = pathGenerator.centroid(primaryLandmass);
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(primaryLandmass);

    if (Number.isNaN(cx) || Number.isNaN(cy)) return;

    countries.push({
      id: `${id}-${index}`,
      name,
      path: svgPath,
      centroid: [cx, cy],
      boundsWidth: Math.max(8, x1 - x0),
      boundsHeight: Math.max(8, y1 - y0),
    });
  });

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    spherePath,
    graticulePath,
    countries,
  };
}

