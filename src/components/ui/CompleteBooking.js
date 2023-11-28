"use client";
import React, { useState, useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";
import { BookingWithStripeToken } from "../../serverMethods/servermethods";
import { NavigationContext } from "../../contexts/NavigationContext";
import SuccessfulBooking from "./SuccessfulBooking";
import FailedBooking from "./FailedBooking";

const CompleteBooking = () => {
  const { partySize, selectedDate, selectedTime, selectedPromotion, values } =
    useContext(BookingContext);
  const { prevStep, defaultStep } = useContext(NavigationContext);
  const [bookingResult, setBookingResult] = useState(null); // New state to store booking result

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
  };
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

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      {/* ... other component markup ... */}
      <button
        type="button"
        onClick={prevStep}
        className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        Previous
      </button>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleSubmit}
          className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Complete Booking
        </button>
        <button
          onClick={defaultStep}
          className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          HomePage
        </button>
        {renderBookingStatus()}{" "}
        {/* Call the function to render the booking status */}
      </div>
    </div>
  );
};

export default CompleteBooking;
