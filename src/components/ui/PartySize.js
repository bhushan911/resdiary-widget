"use client";
import React, { useState, useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";

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
    <div className="p-4 text-lg sm:text-base font-bold text-gray-800">
      <label htmlFor="partySize" className="block py-2 ">
        Party Size
      </label>
      <select
        id="partySize"
        className="block w-full pl-3 pr-10 py-2 border-black border-2  focus:border-indigo-500 rounded-md"
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
