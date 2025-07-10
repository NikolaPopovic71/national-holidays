// src/components/HolidayList.jsx (Final Version)
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicHolidays } from '../api';

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Date not provided';
  }
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return dateString;
  }
  const [year, month, day] = parts.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const options = { day: 'numeric', month: 'long', timeZone: 'UTC' };
  return date.toLocaleDateString('en-GB', options);
};

function HolidayList({ countryCode, countryName }) {
  // Get `isFetching` in addition to the other states.
  const {
    data: holidays,
    isError,
    error,
    isFetching, // Use this for a non-blocking loading indicator
  } = useQuery({
    queryKey: ['holidays', countryCode],
    queryFn: () => getPublicHolidays(countryCode),
    // This option keeps the previous data visible while new data is fetched.
    // It's the default, but good to be aware of.
    keepPreviousData: true,
  });

  // We only need a hard error state. The loading is handled below.
  if (isError) {
    return <p className="alert alert-danger">Error: {error.message}</p>;
  }

  return (
    <div className="margin-top">
      <h2 className="text-center">
        Public Holidays for {countryName} in {new Date().getFullYear()}
        {/* Show a subtle indicator when fetching */}
        {isFetching && ' (loading...)'}
      </h2>

      {/* When fetching, we can dim the old list to show something is happening */}
      <ul
        className="holiday-list"
        style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}
      >
        {holidays && holidays.length > 0 ? (
          holidays.map((holiday) => (
            <li key={holiday.id}>
              {/* This version will produce exactly one dash */}
               {formatDate(holiday.startDate)} –{' '}
              {holiday.name[0]?.text || 'Name not provided'}
            </li>
          ))
        ) : (
          /* Show a message if there are no holidays, but not while loading the first time */
          !isFetching && (
            <p className="alert alert-warning">
              No public holidays found for this selection.
            </p>
          )
        )}
      </ul>
    </div>
  );
}

export default HolidayList;