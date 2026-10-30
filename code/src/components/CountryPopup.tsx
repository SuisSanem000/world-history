import React, { useEffect } from "react";
import type { CountryFeature } from "../data/worldMapData";

export interface CountryPopupProps {
  country: CountryFeature | null;
  onClose: () => void;
}

/**
 * Popup modal that displays the name of the clicked country.
 */
export const CountryPopup: React.FC<CountryPopupProps> = ({
  country,
  onClose,
}) => {
  useEffect(() => {
    if (!country) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [country, onClose]);

  if (!country) return null;

  return (
    <div
      className="popup-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-popup-title"
    >
      <div
        className="popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="popup-close-btn"
          onClick={onClose}
          aria-label="Close country popup"
        >
          ×
        </button>
        <span className="popup-badge">Selected Country</span>
        <h2 id="country-popup-title" className="popup-country-name">
          {country.name}
        </h2>
      </div>
    </div>
  );
};

