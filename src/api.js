const API_BASE_URL = 'https://openholidaysapi.org';

// Generic fetch function to handle responses and errors
const fetchFromAPI = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Fetches the list of all available countries
export const getCountries = () => fetchFromAPI('Countries');

// Fetches public holidays for a specific country and the current year
export const getPublicHolidays = (countryIsoCode) => {
  const year = new Date().getFullYear();
  const validFrom = `${year}-01-01`;
  const validTo = `${year}-12-31`;

  const queryParams = new URLSearchParams({
    countryIsoCode,
    languageIsoCode: 'en',
    validFrom,
    validTo,
  });

  return fetchFromAPI(`PublicHolidays?${queryParams.toString()}`);
};