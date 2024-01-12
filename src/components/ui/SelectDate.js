"use client";

import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BookingContext } from "../../contexts/BookingContext";
import { FaRegCalendarDays } from "react-icons/fa6";

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
    <div className="p-4 text-lg sm:text-base font-bold text-gray-800">
      <label htmlFor="date" className="block py-2">
        Select Date
      </label>
      <div className="flex flex-col relative w-full">
        {" "}
        {/* Make the div relative */}
        <DatePicker
          id="date"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          filterDate={isAvailableDate}
          className="w-full pl-3 pr- py-2 text-base border-2 border-black focus:border-indigo-500 sm:text-sm rounded-md" // Add pr-10 to make room for the icon
        />
        <FaRegCalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-700 pointer-events-none" />{" "}
        {/* Position the icon */}
      </div>
    </div>
  );
}

export default SelectDate;
