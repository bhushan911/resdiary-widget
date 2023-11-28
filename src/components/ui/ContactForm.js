"use client";
import React, { useContext } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { NavigationContext } from "@/src/contexts/NavigationContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { BookingContext } from "@/src/contexts/BookingContext";

const ContactForm = () => {
  const { nextStep, prevStep } = useContext(NavigationContext);
  // const { updateFormValues } = useContext(BookingContext);
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
    <div className="bg-white rounded px-4 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">Contact Details </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="border rounded py-2 px-3 text-grey-darker isRequired"
            value={values.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
          />{" "}
          {touched.firstName && errors.firstName ? (
            <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
          ) : null}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="border rounded py-2 px-3 text-grey-darker isRequired"
            value={values.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.lastName && errors.lastName ? (
            <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
          ) : null}
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
            className="border rounded py-2 px-3 text-grey-darker w-full isRequired isNumber"
          />
          {errors.phone && touched.phone && (
            <div className="error text-red-500 text-xs">{errors.phone}</div>
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
            <div className="text-red-500 text-xs mt-1">{errors.email}</div>
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
        <div className="mb-4 flex items-center">
          <label className="ml-2 text-sm font-bold">
            I would like to receive news and offers from DRG Group by:
          </label>
          <input
            name="receiveEmailMarketingsubscribe"
            type="checkbox"
            className="form-checkbox  ml-2 w-4 h-4 text-gray-600"
            checked={values.receiveEmailMarketingsubscribe}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <label className="ml-2 text-sm font-bold">Email</label>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={prevStep}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
            //disabled={!isValid}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
