"use client";
import React, { useState, useContext } from "react";
import PartySize from "./PartySize";
import SelectDate from "./SelectDate";
import TimeSlots from "./TimeSlots";
import CheckAvailability from "./CheckAvailability";

export default function BookingSelection({}) {
  return (
    <div>
      <div className="max-w-xl mx-auto pb-4">
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
