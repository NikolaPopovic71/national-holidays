// src/components/HolidayList.jsx
import React, { useMemo } from 'react'; // 1. Import useMemo
import { useQuery } from '@tanstack/react-query';
import { getPublicHolidays } from '../api';

const formatDate = (dateString) => {
  // ... (no changes to this function)
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
  const {
    data: holidays,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['holidays', countryCode],
    queryFn: () => getPublicHolidays(countryCode),
    keepPreviousData: true,
  });

  // 2. Create a memoized, unique list of holidays.
  const uniqueHolidays = useMemo(() => {
    // If there's no data, return an empty array.
    if (!Array.isArray(holidays)) {
      return [];
    }

    // Filter the array, keeping only the first occurrence of each holiday
    // based on a unique combination of its date and name.
    return holidays.filter(
      (holiday, index, self) =>
        index ===
        self.findIndex(
          (h) =>
            h.startDate === holiday.startDate &&
            h.name[0]?.text === holiday.name[0]?.text
        )
    );
  }, [holidays]); // This logic only re-runs when the 'holidays' data changes.

  if (isError) {
    return <p className="alert alert-danger">Error: {error.message}</p>;
  }

  return (
    <div className="margin-top">
      <h2 className="text-center">
        Public Holidays for {countryName} in {new Date().getFullYear()}
        {isFetching && ' (loading...)'}
      </h2>

      <ul
        className="holiday-list"
        style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}
      >
        {/* 3. Use the new 'uniqueHolidays' array for rendering. */}
        {uniqueHolidays && uniqueHolidays.length > 0 ? (
          uniqueHolidays.map((holiday) => (
            <li key={holiday.id}>
              {formatDate(holiday.startDate)} –{' '}
              {holiday.name[0]?.text || 'Name not provided'}
            </li>
          ))
        ) : (
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