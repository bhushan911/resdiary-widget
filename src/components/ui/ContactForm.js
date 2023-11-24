"use client";
import React, { useContext, useState, useEffect } from "react";
import { NavigationContext } from "@/src/contexts/NavigationContext";
import { BookingContext } from "@/src/contexts/BookingContext";
const ContactForm = () => {
  const { nextStep, prevStep } = useContext(NavigationContext);
  const { formData, setFormData } = useContext(BookingContext);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, mobileNumber } = formData;
    const isValid = firstName && lastName && email && mobileNumber;
    setIsFormValid(isValid);
  };

  // Call validateForm every time formData changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="bg-white  rounded px-4 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex-1 mb-4 md:mb-0">
          <h1 className="text-lg font-bold text-gray-900">Contact Details</h1>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-semibold text-gray-700">November 17, 2023</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="font-semibold text-gray-700">2</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="font-semibold text-gray-700">12:00 PM</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border rounded py-2 px-3 text-grey-darker isRequired"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border rounded py-2 px-3 text-grey-darker isRequired"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          className="border rounded py-2 px-3 text-grey-darker w-full isRequired isNumber"
          value={formData.mobileNumber}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="border rounded py-2 px-3 text-grey-darker w-full isRequired isEmail"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="voucherCode"
          placeholder="Voucher No (up to 8 voucher codes)"
          className="border rounded py-2 px-3 text-grey-darker w-full"
          value={formData.voucherCode}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <textarea
          name="comments"
          placeholder="Comments"
          className="border rounded py-2 px-3 text-grey-darker w-full"
          rows="4"
          value={formData.comments}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="mb-4 flex items-center">
        <input
          name="receiveEmailMarketingsubscribe"
          type="checkbox"
          className="form-checkbox"
          checked={formData.receiveEmailMarketingsubscribe}
          onChange={handleInputChange}
        />
        <label className="ml-2 text-sm font-bold">
          I would like to receive news and offers from DRG Group by: Email
        </label>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevStep}
          className="text-indigo-600 hover:text-indigo-800 transition duration-300"
        >
          Previous
        </button>

        <button
          onClick={nextStep}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          disabled={!isFormValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
