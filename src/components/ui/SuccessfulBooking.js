import React from "react";

const SuccessfulBooking = ({ booking }) => {
  const VisitDate = new Date();
  const VisitTime = booking.Booking.VisitTime.split(".")[0];
  console.log(VisitTime);
  const timeIn24HourFormat = new Date(`1970-01-01T${VisitTime}Z`);
  const timeInAmPmFormat = timeIn24HourFormat.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  return (
    <div>
      <h1>SuccessfulBooking</h1>
      <div>
        <p>{booking.Booking.Reference}</p>
        <p> {booking.Booking.RestaurantName}</p>
        <p>
          {VisitDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>{timeInAmPmFormat}</p>
        <p> {booking.Booking.PartySize}</p>
        <p>{booking.Booking.SpecialRequests}</p>
        <p></p>
      </div>
    </div>
  );
};

export default SuccessfulBooking;
