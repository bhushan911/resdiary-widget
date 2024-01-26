"use client";

import React, { useContext, useState } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { BookingContext } from "../../contexts/BookingContext";
import { HiCreditCard } from "react-icons/hi2";
import reactStringReplace from "react-string-replace";

const Promotions = () => {
  const { availability, selectedPromotion, setSelectedPromotion, newSetup } =
    useContext(BookingContext);
  const { nextStep, prevStep } = useContext(NavigationContext);
  const [error, setError] = useState("");
  const [leaveTime, setLeaveTime] = useState(
    availability.matchingTimeSlot.LeaveTime
  ); // New state for leave time

  let leaveTimeRequired = availability.matchingTimeSlot.IsLeaveTimeRequired;

  const selectPromotion = (promotion) => {
    const isSelected =
      selectedPromotion.promotion &&
      selectedPromotion.promotion.Id === promotion.Id;
    const newPromotion = isSelected ? null : promotion;

    // Default leave time from the matching time slot
    let updatedLeaveTime = availability.matchingTimeSlot.LeaveTime;

    // If a new promotion is selected, find its specific leave time
    if (newPromotion) {
      const promo = availability.matchingTimeSlot.AvailablePromotions.find(
        (p) => p.Id === newPromotion.Id
      );
      if (promo) {
        updatedLeaveTime = promo.LeaveTime;
      }
    }
    // Update the selected promotion with either the new promotion or null
    // and set the leave time to the specific promotion's leave time or default
    setSelectedPromotion({
      promotion: newPromotion,
      leaveTime: updatedLeaveTime,
    });

    // Update the leaveTime state if needed in this component
    setLeaveTime(updatedLeaveTime);

    setError("");
  };

  console.log(selectedPromotion);

  const handleNext = () => {
    if (
      !availability.matchingTimeSlot.HasStandardAvailability &&
      !selectedPromotion
    ) {
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
      {availability.matchingTimeSlot.AvailablePromotions.length === 0 && (
        <div className="border-black border-2 min-h-44">
          <p>No available promotions.</p>
        </div>
      )}

      {availability.promotions.map((promotion, index) => (
        <div
          key={promotion.Id}
          className={`p-4 border ${
            selectedPromotion.promotion?.Id === promotion.Id
              ? "border-indigo-600 bg-indigo-300"
              : "border-gray-300 bg-white"
          } rounded mb-2 cursor-pointer hover:bg-indigo-50 transition duration-100 shadow-md`}
          onClick={() => selectPromotion(promotion)}
        >
          <h2 className="text-lg font-bold mb-2 ">
            {promotion.Name}

            {promotion.MayRequireCreditCard === true ||
            promotion.MayRequireDeposit === true ? (
              <span className="inline-block pt-0 px-2 h-4">
                <HiCreditCard />
              </span>
            ) : null}
          </h2>
          <div className="">
            <p className="text-base">
              {reactStringReplace(promotion.Description, "\n", (match, i) => (
                <br key={i} />
              ))}
            </p>
            <p className="my-2 text-base">
              Amount : {`${newSetup.CurrencySymbol}${promotion.FullPrice} `}{" "}
            </p>
          </div>
        </div>
      ))}
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
      )}

      <p className="text-gray-800 font-semibold text-md text-center">
        {leaveTimeRequired
          ? `Your table is required to be returned by ${selectedPromotion.leaveTime}`
          : "Leave time not required."}
      </p>

      {selectedPromotion.promotion != null &&
        (selectedPromotion.promotion.MayRequireCreditCard === true ||
          selectedPromotion.promotion.MayRequireDeposit === true) && (
          <p className="text-gray-800 text-sm text-center">
            <span className="inline-block pt-1 h-4 w-4">
              <HiCreditCard className="" />
            </span>{" "}
            A payment of{" "}
            {`${newSetup.CurrencySymbol}${selectedPromotion.promotion.FullPrice}`}{" "}
            will be required to secure this reservation.
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
