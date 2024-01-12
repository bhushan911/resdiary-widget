"use client";
import React, { useContext } from "react";
import { NavigationContext } from "@/src/contexts/NavigationContext";
import { BookingContext } from "@/src/contexts/BookingContext";
import DOMPurify from "dompurify";

const PrivacyPolicy = () => {
  const { prevStep } = useContext(NavigationContext);
  const { newSetup } = useContext(BookingContext);
  const sanitizedContent = DOMPurify.sanitize(newSetup.PrivacyPolicy);

  return (
    <div className="bg-white rounded p-2 mb-4 max-w-lg mx-auto my-5">
      <div className="flex flex-col justify-between items-center mb-3">
        <h1 className="block text-lg font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="w-full border-2 p-2 rounded-md border-gray-300 h-64 overflow-auto shadow-md">
            {/* Assuming newSetup.PrivacyPolicy contains the text */}
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => prevStep(4)}
            className="bg-indigo-500 text-white py-2 px-4 w-24 h-10 rounded-md hover:bg-indigo-800 transition duration-300"
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
