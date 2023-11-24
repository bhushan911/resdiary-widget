"use client";
import React, { createContext, useState } from "react";
import {
  getSetup,
  getAvailabilityForDateRangeV2,
  getAvailabilitySearch,
  checkAvailability,
} from "../serverMethods/servermethods";

export const BookingContext = createContext();

export const BookingProvider = ({
  children,
  setup,
  availabilitySearch,
  availabilityForDateRangeV2,
}) => {
  const [partySize, setPartySize] = useState(setup.OnlinePartySizeDefault);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("No Time Selected");
  const [newSetup, setNewSetup] = useState(setup);
  const [newAvailabilitySearch, setNewAvailabilitySearch] =
    useState(availabilitySearch);
  const [newAvailabilityForDateRangeV2, setNewAvailabilityForDateRangeV2] =
    useState(availabilityForDateRangeV2);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    voucherCode: "",
    comments: "",
    receiveEmailMarketingsubscribe: false,
  });

  const [availability, setAvailability] = useState("");

  const updatePartySize = async (newSize) => {
    setPartySize(newSize);
    console.log(availabilitySearch);
    console.log(
      `newSize: ${partySize} selectedDate: ${selectedDate} newSetup: ${newSetup.OnlinePartySizeDefault}`
    );
    // Call your APIs here
    const newAvailabilityForDateRangeV2 = await getAvailabilityForDateRangeV2(
      selectedDate,
      newSetup.OnlinePartySizeDefault
    );

    const newAvailabilitySearch = await getAvailabilitySearch(
      newSetup.OnlinePartySizeDefault,
      selectedDate
    );

    setNewAvailabilityForDateRangeV2(newAvailabilityForDateRangeV2);
    setNewAvailabilitySearch(newAvailabilitySearch);
    console.log(newAvailabilityForDateRangeV2);
    console.log(newAvailabilitySearch);
  };

  const updateDate = async (date) => {
    setSelectedDate(date);
    console.log(selectedDate);

    // Call your APIs here
    const newSetup = await getSetup(date.toISOString().split("T")[0]);
    const newAvailabilitySearch = await getAvailabilitySearch(
      newSetup.OnlinePartySizeDefault,
      date.toISOString().split("T")[0]
    );

    setNewSetup(newSetup);
    setNewAvailabilitySearch(newAvailabilitySearch);
    console.log(newSetup);
    console.log(newAvailabilitySearch);

    console.log(
      `newSize: ${partySize} selectedDate: ${date} newSetup: ${newSetup.OnlinePartySizeDefault}`
    );
  };
  const updateTime = async (time) => {
    setSelectedTime(time);
  };

  const updateAvailibility = async () => {
    const selectedDateTime = `${
      selectedDate.toISOString().split("T")[0]
    }T${selectedTime}.0000000`;
    if (selectedTime === "No Time Selected") {
      return setAvailability("Please select a time");
    } else {
      const availability = await checkAvailability(
        partySize,
        selectedDate.toISOString().split("T")[0],
        selectedDateTime
      );
      setAvailability(availability);
    }
  };
  return (
    <BookingContext.Provider
      value={{
        partySize,
        setPartySize,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        setup,
        availabilitySearch,
        availabilityForDateRangeV2,
        updatePartySize,
        updateDate,
        newSetup,
        newAvailabilitySearch,
        newAvailabilityForDateRangeV2,
        updateTime,
        updateAvailibility,
        availability,
        selectedPromotion,
        setSelectedPromotion,
        formData,
        setFormData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
