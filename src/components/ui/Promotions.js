// "use client";
// import React, { useContext, useState } from "react";
// import { NavigationContext } from "../../contexts/NavigationContext";
// import { BookingContext } from "../../contexts/BookingContext";

// const Promotions = () => {
//   const {
//     newAvailabilitySearch,
//     selectedDate,
//     selectedTime,
//     setSelectedPromotion,
//     selectedPromotion,
//   } = useContext(BookingContext);
//   const { nextStep, prevStep } = useContext(NavigationContext);

//   // State to hold the selected promotion
//   const date = selectedDate.toISOString().split("T")[0];

//   function findPromotionByDateTime(data, selectedDate, selectedTime) {
//     // Extract hours and minutes from the selected time
//     const [selectedHour, selectedMinute] = selectedTime.split(":").map(Number);

//     // Find the matching time slot
//     const matchingTimeSlot = data.TimeSlots.find((slot) => {
//       const slotDateTime = new Date(slot.TimeSlot);
//       return (
//         slotDateTime.toISOString().startsWith(selectedDate) &&
//         slotDateTime.getHours() === selectedHour &&
//         slotDateTime.getMinutes() === selectedMinute
//       );
//     });

//     if (matchingTimeSlot && matchingTimeSlot.AvailablePromotions.length > 0) {
//       // Extract the IDs of the available promotions
//       const promotionIds = matchingTimeSlot.AvailablePromotions.map(
//         (promo) => promo.Id
//       );

//       // Check if IsAlwaysApply is true for any promotion
//       const isAlwaysApply = matchingTimeSlot.AvailablePromotions.some(
//         (promo) => data.Promotions.find((p) => p.Id === promo.Id).IsAlwaysApply
//       );

//       // Find and return the entire objects of these promotions
//       return {
//         promotions: data.Promotions.filter((promo) =>
//           promotionIds.includes(promo.Id)
//         ),
//         isAlwaysApply: isAlwaysApply,
//       };
//     } else {
//       return { promotions: [], isAlwaysApply: false };
//     }
//   }

//   // Find promotions based on selected time
//   const { promotions, isAlwaysApply } = findPromotionByDateTime(
//     newAvailabilitySearch,
//     date,
//     selectedTime
//   );
//   // Handle selecting a promotion
//   const selectPromotion = (promotion) => {
//     setSelectedPromotion(promotion);
//     console.log(`Selected promotion ID: ${promotion.Id}`);
//   };
//   // Adjust the Next button logic
//   const isNextButtonDisabled = isAlwaysApply && !selectedPromotion;
//   // Render promotions as selectable options
//   const renderPromotions = () => {
//     if (promotions.length === 0) {
//       return <p>No available promotions.</p>;
//     } else {
//       return promotions.map((promotion, index) => (
//         <div
//           key={index}
//           className={`p-4 border ${
//             selectedPromotion?.Id === promotion.Id
//               ? "border-indigo-600 bg-indigo-100"
//               : "border-gray-300 bg-white"
//           } rounded mb-2 cursor-pointer hover:bg-indigo-50`}
//           onClick={() => selectPromotion(promotion)}
//           style={
//             selectedPromotion?.Id === promotion.Id
//               ? { backgroundColor: "lightblue" }
//               : {}
//           }
//         >
//           <h2 className="text-xl font-semibold mb-2">{promotion.Name}</h2>
//           <p className="text-gray-600 text-sm mb-4">{promotion.Description}</p>
//         </div>
//       ));
//     }
//   };

//   return (
//     <div className="bg-white  rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
//       {/* Other component content */}
//       {renderPromotions()}
//       <div className="flex justify-between items-center mt-8">
//         <button
//           onClick={prevStep}
//           className="text-indigo-600 hover:text-indigo-800 transition duration-300"
//         >
//           Previous
//         </button>
//         <button
//           onClick={nextStep}
//           // disabled={!selectedPromotion}
//           disabled={isNextButtonDisabled}
//           className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Promotions;

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
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
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
