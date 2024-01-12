"use client";
import React, { useState, useContext } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";
import { BookingWithStripeToken } from "../../serverMethods/servermethods";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const ReviewDetails = () => {
  const router = useRouter();
  const {
    values,
    partySize,
    selectedDate,
    selectedTime,
    selectedPromotion,
    bookingResult,
    setBookingResult,
    availability,
  } = useContext(BookingContext);

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { nextStep, prevStep, variableStep } = useContext(NavigationContext);
  // const [stripePublishableKey, setStripePublishableKey] = useState(null);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const handleTermsChange = (event) => {
    setIsTermsAccepted(event.target.checked);
  };
  console.log(values);

  const handleBookingSubmission = async () => {
    // Prepare booking details
    const booking = {
      partySize,
      selectedDate: selectedDate.toISOString(),
      selectedTime,
      selectedPromotionId: selectedPromotion?.Id,
      leaveTimeConfirmed: availability.matchingTimeSlot.IsLeaveTimeRequired,
      ...values,
    };

    try {
      console.log("booking:", booking);
      const bookingResponse = await BookingWithStripeToken(booking);
      console.log("bookingResponse:", bookingResponse);
      // Set the result and sessionStorage immediately after receiving the response
      setBookingResult(bookingResponse.bookingResult);
      const localStorageItem = {
        bookingDetails: booking,
        bookingResult: bookingResponse.bookingResult,
      };
      localStorage.setItem("bookingInfo", JSON.stringify(localStorageItem));

      if (
        bookingResponse &&
        bookingResponse.bookingResult.Status === "Success"
      ) {
        router.push("/booking-status");
      } else if (
        bookingResponse &&
        (bookingResponse.bookingResult.Status === "PaymentRequired" ||
          bookingResponse.bookingResult.Status === "CreditCardRequired")
      ) {
        // const publishableKey =
        //   bookingResponse.bookingResult.StripePublishableKey;
        // console.log("publishableKey:", publishableKey);
        // setStripePublishableKey(publishableKey);
        const stripe = await stripePromise;
        console.log("bookingResult:", bookingResult);
        // Alert user about redirection
        if (typeof window !== "undefined") {
          // Check that window is defined (i.e., code is running in the browser)
          const userAgreed = window.confirm(
            "You will be redirected to the payment gateway for payment. Do you want to proceed?"
          );

          if (userAgreed && bookingResponse.sessionURL != null) {
            router.push(bookingResponse.sessionURL); // Use Next.js router for client-side redirection
          } else {
            console.error(
              "Redirect to payment gateway cancelled by user or Stripe redirectToCheckout error."
            );
            // Handle the situation where the user cancels or there's no session URL
          }
        }
      } else if (
        bookingResponse.bookingResult.Status === "InvalidBooking" ||
        bookingResponse.bookingResult.Status === "NoAvailability" ||
        bookingResponse.bookingResult.Message
      ) {
        router.push("/booking-status");
      }
    } catch (error) {
      console.error("Booking failed:", error.message);
      setBookingResult({
        status: "Failed",
        message: "Booking could not be completed.",
      });
    }
  };

  const navigateToTerms = () => {
    variableStep(5); // Assuming step 5 is for TermsAndConditions
  };

  const navigateToPrivacyPolicy = () => {
    variableStep(6); // Assuming step 6 is for PrivacyPolicy
  };

  return (
    <div className="bg-white rounded p-2 mb-4 max-w-lg mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3">
        <h1 className="text-lg font-bold text-gray-900">
          Confirm Your Details Below
        </h1>
      </div>
      <div className="border-t-2 border-gray-200 pt-4">
        <div className="flex flex-col  space-y-2">
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              Date:
            </span>
            <span className="basis-3/4 break-all">
              {selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              Time:
            </span>
            <span className="basis-3/4 break-all">{selectedTime}</span>
          </div>
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              People:
            </span>
            <span className="basis-3/4 break-all">{partySize}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              First Name:
            </span>
            <span className="basis-3/4 break-all">{values.firstName}</span>
          </div>
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              Last Name:
            </span>
            <span className="basis-3/4 break-all">{values.lastName}</span>
          </div>
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              Mobile Number:
            </span>
            <span className="basis-3/4  break-all">{values.mobileNumber}</span>
          </div>
          <div className="flex md:flex-row justify-start">
            <span className="font-semibold basis-1/4 min-w-[140px] ">
              Email Address:
            </span>
            <span className="basis-3/4   break-all">{values.email}</span>
          </div>
        </div>
        <div className="mt-4">
          {availability.matchingTimeSlot.IsLeaveTimeRequired == true ? (
            <p className="text-gray-800 font-semibold text-md text-start">
              Your table is required to be returned by{" "}
              {availability.matchingTimeSlot.LeaveTime}
            </p>
          ) : (
            <p className="text-gray-800 font-semibold text-md text-center">
              Leave Time Not Required
            </p>
          )}
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
            I have read and accept the{" "}
            <span
              className="text-blue-600 hover:underline"
              onClick={navigateToTerms}
            >
              Booking Terms And Conditions
            </span>{" "}
            and{" "}
            <span
              className="text-blue-600 hover:underline"
              onClick={navigateToPrivacyPolicy}
            >
              Privacy Policy
            </span>
          </label>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => prevStep()}
          className="bg-indigo-500 text-white py-2 px-4 w-24 h-10 rounded-md hover:bg-indigo-800 transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleBookingSubmission}
          className="inline-block bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-800 disabled:opacity-50"
          disabled={!isTermsAccepted}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ReviewDetails;
