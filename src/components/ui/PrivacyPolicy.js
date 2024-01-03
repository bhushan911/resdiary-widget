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
    <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <h1 className="text-lg font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="w-full border-2 border-black h-64 overflow-auto">
          {/* Assuming newSetup.PrivacyPolicy contains the text */}
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => prevStep(4)}
          className="text-blue-600 hover:underline"
        >
          Previous
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
