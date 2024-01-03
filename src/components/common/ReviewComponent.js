"use client";
import React, { useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";

function ReviewComponent() {
  const { partySize, selectedTime, selectedDate } = useContext(BookingContext);
  const date = selectedDate.toISOString().split("T")[0];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between  mb-2 ">
        <div className="flex flex-row w-full text-gray-900 font-bold">
          {/* Ensure each child flex item has flex-1 to divide space equally */}
          {/* <div className="flex-1 border-black border-2 font-bold "> */}
          <div className="flex-1  font-bold ">
            <h1 className="text-3xl text-center my-2">DRG</h1>
          </div>
          {/* <div className="flex-1 border-black border-2 flex items-center justify-center"> */}
          <div className="flex-1  flex items-center justify-center">
            <span className="text-lg">{date}</span>
            <span className="mx-2 text-lg">|</span>
            <span className="text-lg">{partySize}</span>
            <span className="mx-2 text-lg">|</span>
            <span className="text-lg">{selectedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewComponent;
