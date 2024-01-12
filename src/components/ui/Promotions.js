"use client";

import React, { useContext, useState } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";

import reactStringReplace from "react-string-replace";

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
    // <div className="px-4 pt-6 pb-8 mb-4 max-w-lg mx-auto  my-5">
    <div className="bg-white rounded p-2 mb-4 max-w-lg mx-auto my-5">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3">
        <h1 className="text-xl font-bold text-gray-900 ">Promotions</h1>
      </div>
      <div className="border-t-2  border-gray-200 pt-4"></div>
      {promotions.length === 0 && <p>No available promotions.</p>}

      {promotions.map((promotion, index) => (
        <div
          key={index}
          className={`p-4 border ${
            selectedPromotion?.Id === promotion.Id
              ? "border-indigo-600 bg-indigo-300"
              : "border-gray-300 bg-white"
          } rounded mb-2 cursor-pointer hover:bg-indigo-50 transition duration-300 shadow-md`}
          onClick={() => selectPromotion(promotion)}
        >
          <h2 className="text-lg font-bold mb-2">{promotion.Name}</h2>
          <div className="">
            <p className="text-base">
              {reactStringReplace(promotion.Description, "\n", (match, i) => (
                <br key={i} />
              ))}
            </p>
          </div>
        </div>
      ))}
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
      )}
      {availability.matchingTimeSlot.IsLeaveTimeRequired == true ? (
        <p className="text-gray-800 font-semibold text-md text-center">
          Your table is required to be returned by{" "}
          {availability.matchingTimeSlot.LeaveTime}
        </p>
      ) : (
        <p className="text-gray-800 font-semibold text-md text-center">
          Leave time not required.
        </p>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => prevStep()}
          className="bg-indigo-500 text-white py-2 px-4 w-24 h-10 rounded-md hover:bg-indigo-800 transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md w-24 h-10  hover:bg-indigo-800 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Promotions;
