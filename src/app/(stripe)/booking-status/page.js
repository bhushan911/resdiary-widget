"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuccessfulBooking from "@/src/components/ui/booking-status/SuccessfulBooking";
import FailedBooking from "@/src/components/ui/booking-status/FailedBooking";
import { BookingWithStripeTokenwithSession } from "@/src/serverMethods/servermethods";
import Loading from "@/src/components/ui/Loading";

const BookingStatus = () => {
  const router = useRouter();
  const [bookingInfo, setBookingInfo] = useState(null); // Declare bookingInfo at component level
  const [sessionResult, setSessionResult] = useState(null); // To store session result

  useEffect(() => {
    const bookingData = localStorage.getItem("bookingInfo");

    if (bookingData) {
      const parsedBookingInfo = JSON.parse(bookingData);
      setBookingInfo(parsedBookingInfo); // Update bookingInfo state
    }
  }, [router]);

  useEffect(() => {
    // Run only if bookingInfo is available
    if (bookingInfo && bookingInfo.bookingResult) {
      console.log("bookingInfo:", bookingInfo);
      if (bookingInfo.bookingResult.Status === "Success") {
        setSessionResult(bookingInfo.bookingResult); // Update session result
      } else if (
        bookingInfo.bookingResult.Status === "PaymentRequired" ||
        bookingInfo.bookingResult.Status === "CreditCardRequired"
      ) {
        const callBookingSession = async () => {
          try {
            const booking = {
              ...bookingInfo.bookingDetails,
              StripeCheckoutSessionId:
                bookingInfo.bookingResult.StripeCheckoutSessionId,
            };
            const response = await BookingWithStripeTokenwithSession(booking);
            setSessionResult(response.bookingResult); // Update session result
          } catch (error) {
            console.error("Error in booking session:", error);
            setSessionResult({
              status: "Failed",
              message: "Booking session failed.",
            });
          }
        };
        callBookingSession();
      } else {
        setSessionResult(bookingInfo.bookingResult); // Update session result
      }
    }
  }, [bookingInfo]);

  const renderBookingStatus = () => {
    if (!sessionResult) return <Loading />; // Show loading until sessionResult is set

    console.log("sessionResult:", sessionResult);

    if (sessionResult.Status === "Success") {
      return <SuccessfulBooking booking={sessionResult} />;
    } else {
      return <FailedBooking booking={sessionResult} />;
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg border-2 border-black shadow-lg overflow-hidden max-w-screen-md w-full mx-2 md:mx-0 my-10">
        <div className="border-b-2 border-black ">
          <div className="flex-1  font-bold ">
            <h1 className="text-3xl text-center my-2">DRG</h1>
          </div>
          {renderBookingStatus()}
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
