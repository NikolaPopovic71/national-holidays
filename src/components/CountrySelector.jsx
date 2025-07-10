// src/components/CountrySelector.jsx (Final Version)
import React from 'react';

// Accept the new `isLoading` prop.
function CountrySelector({
  isLoading,
  countries,
  selectedCountry,
  onCountryChange,
}) {
  return (
    <div className="form-group">
      <label htmlFor="country-select">Select a Country:</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        // Disable the dropdown while the countries are loading.
        disabled={isLoading}
      >
        {/* Show a loading message inside the disabled dropdown. */}
        {isLoading ? (
          <option>Loading countries...</option>
        ) : (
          countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name[0]?.text}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default CountrySelector;