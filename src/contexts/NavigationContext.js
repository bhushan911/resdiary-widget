"use client";
import React, { createContext, useState } from "react";

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(4);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const defaultStep = () => {
    setCurrentStep((prevStep) => (prevStep = 1));
  };

  return (
    <NavigationContext.Provider
      value={{ currentStep, nextStep, prevStep, defaultStep }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// export default NavigationContext;
