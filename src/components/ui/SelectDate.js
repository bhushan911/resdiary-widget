"use client";

import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/SelectDate.css";
import { BookingContext } from "../../contexts/BookingContext";

function SelectDate() {
  const {
    selectedDate,
    setSelectedDate,
    newAvailabilityForDateRangeV2,
    updateDate,
  } = useContext(BookingContext);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Get today's date and format it
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Add today's date to the array of available dates from the API
    const datesFromApi = newAvailabilityForDateRangeV2.AvailableDates.map(
      (dateObj) => dateObj.Date.split("T")[0]
    );
    const datesIncludingToday = [todayStr, ...datesFromApi];

    setAvailableDates(datesIncludingToday);
  }, [newAvailabilityForDateRangeV2]);

  const handleDateChange = (date, event) => {
    const clickedDay = event.target.getAttribute("aria-label");
    if (clickedDay && !isAvailableDate(date)) {
      // If the day clicked is not available, navigate to that month
      updateDate(date);
      // You would need to use a ref to the DatePicker and call its .setMonth method
      // datePickerRef.current.setMonth(date.getMonth());
    } else {
      // If the day clicked is available, just set the date
      updateDate(date);
    }
  };

  const isAvailableDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return availableDates.includes(dateString);
  };

  const dayClassName = (date) => {
    return availableDates.some(
      (availableDate) => date.toISOString().split("T")[0] === availableDate
    )
      ? undefined
      : "react-datepicker__day--disabled";
  };

  return (
    <div className="p-4">
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        Select Date:
      </label>
      {/* <div className="date-picker-container"> */}
      {/* <div
        className="block w-full pl-3 pr-10 py-2 text-base border-black border-2  focus:border-indigo-500 sm:text-sm rounded-md"
        // className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      > */}
      <DatePicker
        id="date"
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        filterDate={isAvailableDate}
        // className="input-field"
        // wrapperClassName="date-picker-wrapper"
        className="block w-full pl-3 pr-10 py-2 text-base border-black border-2 focus:border-indigo-500 sm:text-sm rounded-md"
        dayClassName={dayClassName}
      />
    </div>
    // </div>
  );
}

export default SelectDate;
