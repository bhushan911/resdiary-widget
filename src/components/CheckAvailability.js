import React, { useState, useContext } from "react";
import { BookingContext } from "../contexts/BookingContext";
import { NavigationContext } from "../contexts/NavigationContext";

function CheckAvailability() {
  const [buttonValue, setButtonValue] = useState("Check Availability");
  const [showAvailability, setShowAvailability] = useState(false);
  const { updateAvailibility, availability } = useContext(BookingContext);
  const { nextStep } = useContext(NavigationContext);

  const onClickCheckAvailability = async () => {
    setButtonValue("Checking..."); // Update button text while loading
    await updateAvailibility();
    setShowAvailability(true);
    setButtonValue("Check Availability"); // Reset button text after loading
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={onClickCheckAvailability}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        {buttonValue}
      </button>
      <button
        onClick={nextStep}
        disabled={!availability.result}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        Next
      </button>
      {showAvailability && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {availability.restaurants && availability.restaurants.length > 0 ? (
            <ul className="space-y-2">
              <p className="text-gray-600 text-sm ">{availability.message}</p>
              {availability.restaurants.map((restaurant, index) => (
                <li key={index} className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {restaurant.Name}
                  </span>

                  <a
                    href={restaurant.LogoUrl}
                    className="text-blue-500 hover:text-blue-600 transition duration-300 text-sm"
                  >
                    View Restaurant
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">{availability.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckAvailability;
