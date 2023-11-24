"use client";
import React, { useState, useContext } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";

const ReviewDetails = () => {
  const { partySize, selectedDate, selectedTime, formData } =
    useContext(BookingContext);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { nextStep, prevStep } = useContext(NavigationContext);
  const handleTermsChange = (event) => {
    setIsTermsAccepted(event.target.checked);
  };
  console.log(formData);
  console.log(selectedDate);
  console.log(selectedTime);

  return (
    <div className="bg-white  rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          Confirm Your Details Below
        </h1>
        <div className="text-sm">
          <span className="font-semibold text-gray-700">November 17, 2023</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="font-semibold text-gray-700">2</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="font-semibold text-gray-700">2:00 PM</span>
        </div>
      </div>
      <div className="border-t-2 border-gray-200 pt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Date:</span>
            <span>
              {selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Time:</span>
            <span>{selectedTime}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">People:</span>
            <span>{partySize}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">First Name:</span>
            <span>{formData.firstName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Last Name:</span>
            <span>{formData.lastName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Mobile Number:</span>
            <span>{formData.mobileNumber}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Email Address:</span>
            <span>{formData.email}</span>
          </div>

          {/* ... repeat for each detail item ... */}
        </div>
        <div className="mt-4">
          Your table is required to be returned by 4:00 PM
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5"
            checked={isTermsAccepted}
            onChange={handleTermsChange}
          />
          <label className="ml-2 text-sm font-bold" htmlFor="terms">
            I have read and accept the Booking Terms And Conditions and Privacy
            Policy
          </label>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button onClick={prevStep} className="text-blue-600 hover:underline">
          Previous
        </button>
        <button
          onClick={nextStep}
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!isTermsAccepted}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewDetails;
