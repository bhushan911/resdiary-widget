"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { NavigationContext } from "../../../contexts/NavigationContext";

const SuccessfulBooking = ({ booking }) => {
  const router = useRouter();
  const { defaultStep } = useContext(NavigationContext);
  const VisitDate = new Date();
  const VisitTime = booking.Booking.VisitTime.split(".")[0];
  console.log(VisitTime);
  const timeIn24HourFormat = new Date(`1970-01-01T${VisitTime}Z`);
  const timeInAmPmFormat = timeIn24HourFormat.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const homePage = () => {
    defaultStep();
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="bg-white rounded p-2 mb-4 max-w-lg mx-auto my-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 ">
        <h1 className="text-lg font-bold text-gray-900">Booking Successful</h1>
      </div>
      <div className="border-t-2 border-gray-200 pt-4 ">
        <div className="flex flex-col space-y-2 ">
          <div className="flex md:flex-row  justify-start ">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Reference:
            </span>
            <span className="basis-3/4 font-semibold  break-all">
              {booking.Booking.Reference}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Restaurant:
            </span>
            <span className="basis-3/4 font-semibold break-all">
              {booking.Booking.RestaurantName}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Visit Date:
            </span>
            <span className="basis-3/4  font-semibold break-all">
              {booking.Booking.VisitDate.split("T")[0]}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Visit Time:
            </span>
            <span className="basis-3/4 font-semibold break-all">
              {booking.Booking.VisitTime}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Party Size:
            </span>
            <span className="basis-3/4 font-semibold break-all">
              {booking.Booking.PartySize}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold basis-1/4 max-w-[100px] ">
              Comments:
            </span>
            <span className="basis-3/4 font-semibold break-all">
              {booking.Booking.SpecialRequests}
            </span>
          </div>
        </div>
        <div className="flex py-4 justify-center">
          <button
            onClick={homePage}
            className="w-1/3 bg-blue-600 items-center justify-center text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Book a Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulBooking;
