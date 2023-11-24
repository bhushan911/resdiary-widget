"use client";
import React, { useState, useContext } from "react";
import { BookingContext } from "../contexts/BookingContext";

function PartySize() {
  const { partySize, setPartySize, setup, updatePartySize } =
    useContext(BookingContext);
  const MaxOnlinePartySize = setup.MaxOnlinePartySize;
  const MinOnlinePartySize = setup.MinOnlinePartySize;

  const handlePartySizeChange = async (event) => {
    updatePartySize(event.target.value);
  };

  const partySizeOptions = Array.from(
    { length: MaxOnlinePartySize - MinOnlinePartySize + 1 },
    (_, index) => index + MinOnlinePartySize
  );
  return (
    <div className="p-4">
      <label
        htmlFor="partySize"
        className="block text-sm font-medium text-gray-700"
      >
        Party Size
      </label>
      <select
        id="partySize"
        // className="input-field"
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={partySize}
        onChange={handlePartySizeChange}
        required
      >
        {partySizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PartySize;
