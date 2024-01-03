const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isFutureTimeSlot = (timeslot) => {
  const currentTime = new Date();
  const timeslotDate = new Date(selectedDate.toDateString() + " " + timeslot);
  return timeslotDate > currentTime;
};

const generateTimeslots = (service) => {
  const startTime = new Date(`1970-01-01T${service.TimeFrom}`);
  const endTime = new Date(`1970-01-01T${service.LastBookingTime}`);
  const timeSlotInterval = service.TimeSlotInterval;

  let timeslots = [];
  for (
    let time = startTime;
    time <= endTime;
    time = new Date(time.getTime() + timeSlotInterval * 60000)
  ) {
    const timeslot = time.toTimeString().substring(0, 8); // HH:mm format
    if (isToday(selectedDate)) {
      if (isFutureTimeSlot(timeslot)) {
        timeslots.push(timeslot);
      }
    } else {
      timeslots.push(timeslot);
    }
  }

  return timeslots;
};

export default generateTimeslots;
