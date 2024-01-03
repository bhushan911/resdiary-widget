"use client";
import React, { useContext, useEffect, useState } from "react";
import { BookingContext } from "../../contexts/BookingContext";

export default function TimeSlots() {
  const { selectedDate, selectedTime, setSelectedTime, setup } =
    useContext(BookingContext);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted

  useEffect(() => {
    setIsMounted(true); // Set to true when component mounts
  }, []);

  const services = setup.Services;
  const minTimeBeforeOnlineCutOff = setup.MinTimeBeforeOnlineCutOff; // Minutes before online cut off

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureTimeSlot = (timeslot, cutoffMinutes) => {
    const currentTime = new Date();
    const cutoffTime = new Date(currentTime.getTime() + cutoffMinutes * 60000);
    const timeslotDate = new Date(currentTime.toDateString() + " " + timeslot);
    return timeslotDate > cutoffTime;
  };

  const generateTimeslots = (service) => {
    let timeslots = [];
    const startTime = new Date(`1970-01-01T${service.TimeFrom}`);
    const endTime = new Date(`1970-01-01T${service.LastBookingTime}`);
    const timeSlotInterval = service.TimeSlotInterval;

    for (
      let time = startTime;
      time <= endTime;
      time = new Date(time.getTime() + timeSlotInterval * 60000)
    ) {
      const timeslot = time.toTimeString().substring(0, 8); // HH:mm format
      if (
        !isToday(selectedDate) ||
        (isToday(selectedDate) &&
          isFutureTimeSlot(timeslot, minTimeBeforeOnlineCutOff))
      ) {
        timeslots.push(timeslot);
      }
    }
    return timeslots;
  };
  // Function to find the first available timeslot from all services
  const findFirstAvailableTimeslot = () => {
    for (let service of services) {
      const timeslots = generateTimeslots(service);
      if (timeslots.length > 0) {
        return timeslots[0]; // Return the first timeslot of the first service that has available timeslots
      }
    }
    return "No Availability"; // Return "No Availability" if no timeslots are found
  };

  useEffect(() => {
    if (isMounted) {
      const firstAvailableTimeslot = findFirstAvailableTimeslot();
      setSelectedTime(firstAvailableTimeslot); // Set the default selected time
    }
  }, [services, setSelectedTime, isMounted]);

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
        className="block w-full pl-3 pr-10 py-2 text-base border-black border-2 focus:border-indigo-500 sm:text-sm rounded-md"
        value={selectedTime}
        onChange={handleTimeChange}
        disabled={!isMounted}
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
          ) : null; // Don't render the service name if there are no timeslots
        })}
        {services.every(
          (service) => generateTimeslots(service).length === 0
        ) && <option value="No Availability">No Availability</option>}
      </select>
    </div>
  );
}
