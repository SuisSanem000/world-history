import React from "react";
import type { CountryFeature } from "../data/worldMapData";

export interface CountryShapeProps {
  country: CountryFeature;
  isHovered: boolean;
  isSelected: boolean;
  onMouseEnter: (country: CountryFeature) => void;
  onMouseLeave: () => void;
  onSelect: (country: CountryFeature) => void;
}

/**
 * React SVG component representing a single country on the 2D World Map.
 * Always displays clear country borders and emits hover/click events.
 */
export const CountryShape: React.FC<CountryShapeProps> = React.memo(
  ({
    country,
    isHovered,
    isSelected,
    onMouseEnter,
    onMouseLeave,
    onSelect,
  }) => {
    const classNames = [
      "country-shape",
      isHovered ? "country-shape--hovered" : "",
      isSelected ? "country-shape--selected" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <path
        d={country.path}
        className={classNames}
        data-country-id={country.id}
        data-country-name={country.name}
        onMouseEnter={() => onMouseEnter(country)}
        onMouseLeave={onMouseLeave}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(country);
        }}
      />
    );
  }
);

CountryShape.displayName = "CountryShape";

