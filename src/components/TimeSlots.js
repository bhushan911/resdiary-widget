"use client";

import React, { useContext, useEffect } from "react";
import { BookingContext } from "../contexts/BookingContext";

export default function TimeSlots() {
  const { selectedDate, selectedTime, setSelectedTime, setup } =
    useContext(BookingContext);

  const services = setup.Services;

  // Helper function to check if the selected date is the current date
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper function to determine if a given timeslot is in the future
  const isFutureTimeSlot = (timeslot) => {
    const currentTime = new Date();
    const timeslotDate = new Date(currentTime.toDateString() + " " + timeslot);
    return timeslotDate > currentTime;
  };

  const generateTimeslots = (service) => {
    const currentDate = new Date();
    const startTime = new Date(`1970-01-01T${service.TimeFrom}`);
    const endTime = new Date(`1970-01-01T${service.LastBookingTime}`);
    const timeSlotInterval = service.TimeSlotInterval;

    let timeslots = [];
    for (
      let time = startTime;
      time <= endTime;
      time = new Date(time.getTime() + timeSlotInterval * 60000)
    ) {
      const timeslot = time.toTimeString().substring(0, 8);
      // Check if the selected date is today and if the timeslot is in the future
      if (
        !isToday(selectedDate) ||
        (isToday(selectedDate) && isFutureTimeSlot(timeslot))
      ) {
        timeslots.push(timeslot);
      }
    }
    return timeslots;
  };

  // Add useEffect to update the selectedTime when the component mounts or services change
  useEffect(() => {
    if (services.length > 0) {
      const firstServiceTimeslots = generateTimeslots(services[0]);
      if (firstServiceTimeslots.length > 0) {
        setSelectedTime(firstServiceTimeslots[0]);
      }
    }
  }, [services, setSelectedTime]);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className="p-4">
      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
        Select Time:
      </label>
      <select
        id="time"
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedTime}
        onChange={handleTimeChange}
      >
        {services.map((service) => {
          const timeslots = generateTimeslots(service);
          return timeslots.length > 0 ? (
            <optgroup label={service.Name} key={service.ServiceId}>
              {timeslots.map((timeslot, index) => (
                <option key={index} value={timeslot}>
                  {timeslot}
                </option>
              ))}
            </optgroup>
          ) : null;
        })}
      </select>
    </div>
  );
}
