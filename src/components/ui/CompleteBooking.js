"use client";
import React, { useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";
import { BookingWithStripeToken } from "../../serverMethods/servermethods";

const CompleteBooking = () => {
  const { partySize, selectedDate, selectedTime, selectedPromotion, formData } =
    useContext(BookingContext);

  const handleSubmit = async (newSize) => {
    const booking = await BookingWithStripeToken(
      partySize,
      selectedDate,
      selectedTime,
      selectedPromotion,
      formData
    );
    console.log(booking);
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          Complete Your Booking
        </h1>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleSubmit}
            className="text-blue-600 hover:underline"
          >
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteBooking;
