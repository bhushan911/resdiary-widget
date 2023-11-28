"use client";
import React, { createContext, useState, useContext } from "react";
import { useFormik } from "formik";
import {
  getSetup,
  getAvailabilityForDateRangeV2,
  getAvailabilitySearch,
  checkAvailability,
} from "../serverMethods/servermethods";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NavigationContext } from "./NavigationContext";

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
  const [bookingResult, setBookingResult] = useState(null); // New state to store booking result

  const { nextStep } = useContext(NavigationContext);

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

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .max(20, "First Name cannot be more than 20 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(20, "Last Name cannot be more than 20 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Phone number is invalid", (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid();
      }),
    voucherCode: Yup.string(),
    comments: Yup.string(),
    receiveEmailMarketingsubscribe: Yup.boolean(),
  });

  // Set up Formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobileNumber: "",
      mobileCountryCode: "",
      voucherCode: "",
      comments: "",
      receiveEmailMarketingsubscribe: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateFormValues(values);
      nextStep(); // Only proceed to the next step if form is valid
    },
  });

  // Function to update form values from child components
  const updateFormValues = (newValues) => {
    formik.setValues({ ...formik.values, ...newValues });
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
        ...formik,
        updateFormValues,
        validationSchema,
        bookingResult,
        setBookingResult,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
