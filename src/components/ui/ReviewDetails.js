"use client";
import React, { useState, useContext } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";

const ReviewDetails = () => {
  const {
    values,
    partySize,
    selectedDate,
    selectedTime,
    selectedPromotion,
    setBookingResult,
  } = useContext(BookingContext);

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { nextStep, prevStep } = useContext(NavigationContext);
  const handleTermsChange = (event) => {
    setIsTermsAccepted(event.target.checked);
  };
  console.log(values);

  const booking = {
    Booking: {
      Id: 1,
      Reference: "Asdabsdbabsd",
      ProviderId: 3,
      RestaurantName: "Di Maggio's Restaurant",
      VisitDate: "2023-11-27T16:13:59",
      VisitTime: "16:15:00.1234567",
      PartySize: 7,
      ChannelCode: "Online",
      SpecialRequests: "sample string 9",
      IpAddress: "sample string 10",
      Customer: {
        Id: 1,
        Title: "Mr",
        FirstName: "Bhushan",
        Surname: "Ahire",
        MobileCountryCode: 44,
        Mobile: "26367128736",
        PhoneCountryCode: 1,
        Phone: "sample string 6",
        Email: "abc@gasdo.com",
        ReceiveEmailMarketing: true,
        ReceiveSmsMarketing: true,
        MembershipId: "sample string 10",
        CustomField: "sample string 11",
        Company: "sample string 12",
        Birthday: "2023-11-27T16:13:59",
        Postcode: "sample string 13",
        GroupEmailMarketingOptInText: "sample string 14",
        GroupSmsMarketingOptInText: "sample string 15",
        ReceiveRestaurantEmailMarketing: true,
        ReceiveRestaurantSmsMarketing: true,
        RestaurantEmailMarketingOptInText: "sample string 18",
        RestaurantSmsMarketingOptInText: "sample string 19",
        CustomerType: {
          Id: 1,
          Name: "sample string 2",
        },
      },
      BookingReasonIds: [1, 2],
      BookingStatus: "Unconfirmed",
      AreaId: 11,
    },
    Status: "Success",
    Errors: ["sample string 1", "sample string 2"],
  };

  const handleSubmit = async () => {
    // Prepare booking details
    const bookingDetails = {
      partySize,
      selectedDate: selectedDate.toISOString(),
      selectedTime,
      selectedPromotionId: selectedPromotion?.Id, // Using optional chaining in case selectedPromotion is undefined
      ...values,
    };

    try {
      // const booking = await BookingWithStripeToken(bookingDetails);
      setBookingResult(booking); // Store booking result in state
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingResult({
        status: "Failed",
        message: "Booking could not be completed.",
      }); // Handle error case
    }
    // Render the booking status based on the result
    const renderBookingStatus = () => {
      if (!bookingResult) return null; // If no result yet, don't render anything

      if (bookingResult.Status === "Success") {
        // Assuming the successful booking component is available
        return <SuccessfulBooking booking={bookingResult} />;
      } else {
        // Assuming the failed booking component is available
        return <FailedBooking message={bookingResult.message} />;
      }
    };
  };

  return (
    <div className="bg-white  rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          Confirm Your Details Below
        </h1>
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
            <span>{values.firstName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Last Name:</span>
            <span>{values.lastName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Mobile Number:</span>
            <span>{values.mobileNumber}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold min-w-[140px]">Email Address:</span>
            <span>{values.email}</span>
          </div>

          {/* ... repeat for each detail item ... */}
        </div>
        <div className="mt-4">
          Your table is required to be returned by 4:00 PM
        </div>
        <div className="mt-4 flex items-center">
          <input
            name="terms"
            type="checkbox"
            className="form-checkbox h-5 w-5"
            checked={isTermsAccepted}
            onChange={handleTermsChange}
          />
          <label className="ml-2 text-sm font-bold" for="terms">
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
          onClick={handleSubmit}
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!isTermsAccepted}
        >
          Complete Booking
        </button>
      </div>
    </div>
  );
};

export default ReviewDetails;
