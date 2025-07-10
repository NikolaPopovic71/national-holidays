// src/App.jsx (Final Version)
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CountrySelector from './components/CountrySelector';
import HolidayList from './components/HolidayList';
import { getCountries } from './api';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('DE');

  // Fetch the countries data but also pass the loading state down.
  const {
    data: countries,
    isLoading: isCountriesLoading, // Rename to be specific
    isError,
    error,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });

  // Handle a fatal error for countries, but don't show a loading screen.
  if (isError) {
    return (
      <div className="paper container alert alert-danger">
        <p>Could not load the application: {error.message}</p>
      </div>
    );
  }

  const selectedCountryName =
    countries?.find((c) => c.isoCode === selectedCountry)?.name[0]?.text ||
    selectedCountry;

  // Render the page skeleton immediately.
  return (
    <div className="paper container">
      <div className="row">
        <div className="col-12">
          <h1 className="title">National Holiday Viewer</h1>
          <p>
            An application to view the national public holidays for the current
            year in any country.
          </p>
        </div>
      </div>

      <hr />

      {/* Pass the loading state and data down to the component. */}
      <CountrySelector
        isLoading={isCountriesLoading}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />

      <HolidayList
        countryCode={selectedCountry}
        countryName={selectedCountryName}
      />
    </div>
  );
}

export default App;