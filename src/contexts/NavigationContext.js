"use client";
import React, { createContext, useState } from "react";

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = (specificStep) => {
    if (specificStep !== undefined) {
      setCurrentStep(specificStep);
    } else {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    }
  };

  const defaultStep = () => {
    setCurrentStep((prevStep) => (prevStep = 1));
  };
  const variableStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  return (
    <NavigationContext.Provider
      value={{ currentStep, nextStep, prevStep, defaultStep, variableStep }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
