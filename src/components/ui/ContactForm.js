"use client";
import React, { useContext } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { NavigationContext } from "@/src/contexts/NavigationContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { BookingContext } from "@/src/contexts/BookingContext";

const ContactForm = () => {
  const { nextStep, prevStep } = useContext(NavigationContext);
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    isValid,
    isSubmitting,
  } = useContext(BookingContext);

  const handlePhoneChange = (value) => {
    setFieldValue("phone", value);
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber && phoneNumber.isValid()) {
        setFieldValue("mobileNumber", phoneNumber.nationalNumber);
        setFieldValue("mobileCountryCode", phoneNumber.countryCallingCode);
      }
    }
  };

  return (
    <div className="bg-white rounded p-2 mb-4 max-w-lg mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3">
        <h1 className="text-lg font-bold text-gray-900">Contact Details </h1>
      </div>
      <div className="border-t-2 border-gray-200 pb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border w-full block rounded py-2 px-3 text-grey-darker isRequired"
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.firstName && errors.firstName && (
              <div className="text-red-500 text-xs ml-1 mt-1">
                {errors.firstName}
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border w-full  block rounded py-2 px-3 text-grey-darker isRequired"
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.lastName && errors.lastName && (
              <div className="text-red-500 text-xs ml-1 mt-1">
                {errors.lastName}
              </div>
            )}
          </div>
        </div>
        <div>
          <PhoneInput
            // international
            placeholder="Enter phone number"
            defaultCountry="GB"
            value={values.phone}
            onChange={handlePhoneChange}
            error={errors.phone && touched.phone && errors.phone}
            onBlur={() => setFieldTouched("phone", true)}
            className="border rounded  py-2 px-3 text-grey-darker w-full isRequired isNumber"
          />
          {errors.phone && touched.phone && (
            <div className="error ml-1 mt-1 text-red-500 text-xs">
              {errors.phone}
            </div>
          )}
        </div>
        <div className="my-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border rounded py-2 px-3 text-grey-darker w-full isRequired isEmail"
            value={values.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.email && errors.email ? (
            <div className="text-red-500 text-xs ml-1 mt-1">{errors.email}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="voucherCode"
            placeholder="Voucher No (up to 8 voucher codes)"
            className="border rounded py-2 px-3 text-grey-darker w-full"
            value={values.voucherCode}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <textarea
            name="comments"
            placeholder="Comments"
            className="border rounded py-2 px-3 text-grey-darker w-full"
            rows="4"
            value={values.comments}
            onBlur={handleBlur}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-4 ml-1 flex flex-col  ">
          <div className="">
            <label className="text-justify text-sm font-bold">
              I would like to receive news and offers from DRG Group by:
            </label>
          </div>
          <div className=" ">
            <input
              name="receiveEmailMarketingsubscribe"
              type="checkbox"
              className="form-checkbox ml-2 w-4 h-4 text-gray-600"
              checked={values.receiveEmailMarketingsubscribe}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <label className="ml-2 py-2 text-sm font-bold">Email</label>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => prevStep()}
            className="bg-indigo-500 text-white py-2 px-4 w-24 h-10 rounded-md hover:bg-indigo-800 transition duration-300"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 w-24 h-10 rounded-md hover:bg-indigo-800 transition duration-300"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
