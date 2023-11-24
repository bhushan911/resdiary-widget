"use client";
import React, { useState, useContext } from "react";
// import "../../styles/style.css";
// import "react-datepicker/dist/react-datepicker.css";
import PartySize from "../PartySize";
import SelectDate from "../SelectDate";
import TimeSlots from "../TimeSlots";
import CheckAvailability from "../CheckAvailability";

export default function BookingSelection({}) {
  return (
    <div>
      <div className="booking-widget">
        <div>
          <PartySize />
          <SelectDate />
          <TimeSlots />
          <CheckAvailability />
        </div>
      </div>
    </div>
  );
}
