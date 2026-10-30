import React, { useState } from "react";
import { WorldMap } from "./components/WorldMap";
import { CountryPopup } from "./components/CountryPopup";
import type { CountryFeature } from "./data/worldMapData";

export const App: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<CountryFeature | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null);

  return (
    <main className="app-shell">
      <WorldMap
        hoveredCountry={hoveredCountry}
        selectedCountry={selectedCountry}
        onHoverCountry={setHoveredCountry}
        onSelectCountry={setSelectedCountry}
      />

      <CountryPopup
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </main>
  );
};

export default App;

