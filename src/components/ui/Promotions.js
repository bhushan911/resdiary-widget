"use client";

import React, { useContext, useState } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";

const Promotions = () => {
  const {
    newAvailabilitySearch,
    selectedDate,
    selectedTime,
    setSelectedPromotion,
    selectedPromotion,
    availability,
  } = useContext(BookingContext);

  const { nextStep, prevStep } = useContext(NavigationContext);
  const [error, setError] = useState("");

  const date = selectedDate.toISOString().split("T")[0];

  function findPromotionByDateTime(data, selectedDate, selectedTime) {
    const [selectedHour, selectedMinute] = selectedTime.split(":").map(Number);
    const matchingTimeSlot = data.TimeSlots.find((slot) => {
      const slotDateTime = new Date(slot.TimeSlot);
      return (
        slotDateTime.toISOString().startsWith(selectedDate) &&
        slotDateTime.getHours() === selectedHour &&
        slotDateTime.getMinutes() === selectedMinute
      );
    });
    console.log(matchingTimeSlot);

    if (matchingTimeSlot) {
      const promotionIds = matchingTimeSlot.AvailablePromotions.map(
        (promo) => promo.Id
      );
      return {
        promotions: data.Promotions.filter((promo) =>
          promotionIds.includes(promo.Id)
        ),
        requireSelection: !matchingTimeSlot.HasStandardAvailability,
      };
    }
    return { promotions: [], requireSelection: false };
  }

  const { promotions, requireSelection } = findPromotionByDateTime(
    newAvailabilitySearch,
    date,
    selectedTime
  );

  const selectPromotion = (promotion) => {
    setSelectedPromotion(
      selectedPromotion && selectedPromotion.Id === promotion.Id
        ? null
        : promotion
    );
    setError("");
  };

  const handleNext = () => {
    if (requireSelection && !selectedPromotion) {
      setError("Please select a promotion to proceed.");
    } else {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">Promotions </h1>
      </div>
      {promotions.length === 0 && <p>No available promotions.</p>}

      {promotions.map((promotion, index) => (
        <div
          key={index}
          className={`p-4 border ${
            selectedPromotion?.Id === promotion.Id
              ? "border-indigo-600 bg-indigo-100"
              : "border-gray-300 bg-white"
          } rounded mb-2 cursor-pointer hover:bg-indigo-50`}
          onClick={() => selectPromotion(promotion)}
        >
          <h2 className="text-xl font-semibold mb-2">{promotion.Name}</h2>
          <p className="text-gray-600 text-sm mb-4">{promotion.Description}</p>
        </div>
      ))}
      {availability.matchingTimeSlot.IsLeaveTimeRequired == true ? (
        <p className="text-gray-800 text-md">
          Your table is required to be returned by{" "}
          {availability.matchingTimeSlot.LeaveTime}
        </p>
      ) : (
        <p className="text-gray-800 text-md">Leave time is not required.</p>
      )}
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => prevStep()}
          className="text-indigo-600 hover:text-indigo-800 transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Promotions;
