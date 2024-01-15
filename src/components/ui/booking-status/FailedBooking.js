"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { NavigationContext } from "../../../contexts/NavigationContext";

const FailedBooking = ({ booking }) => {
  const router = useRouter();
  const { defaultStep } = useContext(NavigationContext);
  const homePage = () => {
    defaultStep();
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      {booking.Message ? (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-lg font-bold text-gray-900">Booking Failed</h1>
          </div>
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex md:flex-row  justify-start">
                <span className="font-bold basis-1/4 max-w-[100px]">
                  Message:
                </span>
                <span className="basis-3/4 font-semibold  break-all">
                  {booking.Message}
                </span>
              </div>
              <div className="flex justify-start">
                <span className="font-bold basis-1/4 max-w-[100px]">
                  Api Request URL:
                </span>
                <span className="basis-3/4 font-semibold  break-all">
                  {booking.ApiRequestUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-lg font-bold text-gray-900">Booking Failed</h1>
          </div>
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex md:flex-row  justify-start">
                <span className="font-bold basis-1/4 max-w-[100px]">
                  Status:
                </span>
                <span className="basis-3/4 font-semibold  break-all">
                  {booking.Status}
                </span>
              </div>
              <div className="flex justify-start">
                <span className="font-bold basis-1/4 max-w-[100px]">
                  Error:
                </span>
                <span className="basis-3/4 font-semibold  break-all">
                  {booking.Errors}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex py-4 justify-center">
        <button
          onClick={homePage}
          className="w-1/3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Book a Table
        </button>
      </div>
    </div>
  );
};

export default FailedBooking;
