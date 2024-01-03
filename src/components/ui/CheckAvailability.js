"use client";
import React, { useState, useContext, useEffect } from "react";
import { format } from "date-fns";
import { BookingContext } from "../../contexts/BookingContext";
import { NavigationContext } from "../../contexts/NavigationContext";
import Image from "next/image";

function CheckAvailability() {
  const [buttonValue, setButtonValue] = useState("Check Availability");
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const {
    updateAvailibility,
    availability,
    partySize,
    selectedDate,
    selectedTime,
    setSelectedTime,
  } = useContext(BookingContext);
  const { nextStep } = useContext(NavigationContext);

  // Enable the Next button only when availability result is true and selectedTime is set
  useEffect(() => {
    setIsNextEnabled(availability.result && selectedTime);
  }, [availability.result, selectedTime]);

  // Trigger the update of availability and enable the Next button
  const onClickCheckAvailability = async () => {
    setButtonValue("Checking...");
    await updateAvailibility();
    if (availability.result) {
      setIsNextEnabled(true); // Ensure this is set when availability is confirmed
      setCheckMessage(""); // Clear any previous messages
    } else {
      setIsNextEnabled(false);
      // setCheckMessage("No availability, please try different options."); // Inform the user to try again
    }
    setButtonValue("Check Availability");
  };

  const handleTimeSlotClick = async (timeSlot) => {
    const formattedTime = timeSlot.split("T")[1].split(".")[0];
    setSelectedTime(formattedTime);
    console.log(formattedTime);
  };

  useEffect(() => {
    if (availability.result && selectedTime) {
      // Only disable Next and prompt for a new check if there's a substantial change
      setIsNextEnabled(false);
      setCheckMessage("Selection changed, please verify availability again.");
    }
  }, [partySize, selectedDate, selectedTime]);

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={onClickCheckAvailability}
        disabled={selectedTime === "No Availability"}
        className={` bg-blue-600 text-white  mx-2 py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ${
          selectedTime === "No Availability"
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {buttonValue}
      </button>
      <button
        onClick={nextStep}
        disabled={!isNextEnabled}
        className={`mx-2 py-2 px-4 rounded transition duration-300 ${
          isNextEnabled
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Next
      </button>
      {checkMessage && (
        <div className="text-red-500 text-sm">{checkMessage}</div>
      )}

      {availability.restaurants && availability.restaurants.length > 0 ? (
        <div className="border-red border-2 mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-sm">{availability.message}</p>
          {availability.restaurants.map((restaurant, index) => {
            // Find corresponding restaurant details
            const restaurantDetail = availability.restaurantDetails.find(
              (detail) => detail.AccessedName === restaurant.AccessedName
            );

            // Determine if this is the restaurant with accessible timeslots
            const isAccessibleRestaurant =
              restaurant.AccessedName === availability.accessedName;

            return (
              <div key={index} className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {restaurant.Name}
                </span>
                {/* Make the image clickable and redirect to the restaurant's website */}
                {restaurantDetail && restaurantDetail.MainImage && (
                  <a
                    href={restaurantDetail.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`${restaurantDetail.MainImage.Url}`}
                      alt={restaurant.Name}
                      className="w-64 h-40 items-center border-2 border-gray-600 justify-center rounded-md mt-2"
                      width={500}
                      height={500}
                    />
                  </a>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {restaurant.AvailableTimeSlots.map((timeSlot, timeIndex) => (
                    <button
                      key={timeIndex}
                      onClick={() => handleTimeSlotClick(timeSlot.TimeSlot)}
                      disabled={!isAccessibleRestaurant} // Enable only for the specific restaurant
                      className={`px-3 py-1 text-sm rounded-md ${
                        format(new Date(timeSlot.TimeSlot), "HH:mm:ss") ===
                        selectedTime
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-300"
                      }`}
                    >
                      {format(new Date(timeSlot.TimeSlot), "p")}
                    </button>
                  ))}
                </div>
                {/* Link to restaurant's website if details are found */}
                {restaurantDetail && (
                  <a
                    href={restaurantDetail.Website}
                    className="text-blue-500 hover:text-blue-600 transition duration-300 text-lg mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book A Table
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 text-sm">{availability.message}</p>
        </div>
      )}
    </div>
  );
}

export default CheckAvailability;
