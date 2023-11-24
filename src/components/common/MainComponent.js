"use client";
import React, { useContext } from "react";
import BookingSelection from "../ui/BookingSelection";
import ContactForm from "../ui/ContactForm";
import Promotions from "../ui/Promotions";
import ReviewDetails from "../ui/ReviewDetails";
import { NavigationContext } from "../../contexts/NavigationContext";
import CompleteBooking from "../ui/CompleteBooking";

export default function MainComponent() {
  const { currentStep } = useContext(NavigationContext);

  const renderNextStep = () => {
    switch (currentStep) {
      case 1:
        return <BookingSelection />;
      case 2:
        return <Promotions />;
      case 3:
        return <ContactForm />;
      case 4:
        return <ReviewDetails />;
      case 5:
        return <CompleteBooking />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>{renderNextStep()}</div>
    </div>
  );
}
