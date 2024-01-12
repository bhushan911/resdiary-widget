"use client";
import React, { useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";
import { FaRegCalendarDays } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

function ReviewComponent() {
  const { partySize, selectedTime, selectedDate } = useContext(BookingContext);
  const date = selectedDate.toISOString().split("T")[0];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between my-2 ">
        <div className="flex basis-1/3 font-bold ">
          <h1 className="text-3xl text-center mx-auto ">DRG</h1>
        </div>
        <div className="flex basis-2/3  font-bold  items-center justify-center">
          <FaRegCalendarDays className="h-5 w-5 mr-1" />
          <span className="text-lg">{date}</span>
          <span className="mx-2 text-lg">|</span>
          <MdPeopleAlt className="h-5 w-5 mr-1" />
          <span className="text-lg">{partySize}</span>
          <span className="mx-2 text-lg">|</span>
          <FaRegClock className="h-5 w-5 mr-1" />
          <span className="text-lg">{selectedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewComponent;
