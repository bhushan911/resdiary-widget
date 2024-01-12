"use client";
import React from "react";

const BackButton = () => {
  function goBack() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }
  return (
    <div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault(); // Prevent the default anchor behavior
          goBack(); // Use the goBack function when the link is clicked
        }}
        className="whitespace-nowrap font-medium text-gray-200 hover:text-yellow-600 leading-3"
      >
        Back to Site
      </a>
    </div>
  );
};

export default BackButton;
