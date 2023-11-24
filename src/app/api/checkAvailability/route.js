// export async function POST(req, res) {
//   const reqBody = await req.json();
//   const selectedPartySize = reqBody.selectedPartySize;
//   const selectedDate = reqBody.selectedDate;

//   const microSiteName = process.env.MICROSITE_NAME;
//   const base_url = process.env.BASE_URL;

//   const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/AvailabilitySearch`;

//   try {
//     const result = await getAvailability(
//       PartySize,
//       selectedDateTime,
//       microSiteName
//     );
//     const matchingTimeSlot = result.TimeSlots.find((slot) => {
//       const slotDate = new Date(slot.TimeSlot);
//       const formattedDateTime = new Date(selectedDateTime);
//       return (
//         slotDate.toISOString().split("T")[0] ===
//           formattedDateTime.toISOString().split("T")[0] &&
//         slotDate.getHours() === formattedDateTime.getHours() &&
//         slotDate.getMinutes() === formattedDateTime.getMinutes() &&
//         slot.HasStandardAvailability
//       );
//     });
//     console.log(matchingTimeSlot);
//     if (matchingTimeSlot) {
//       const message =
//         "Success! Standard availability found for the selected date and time.";
//       return Response.json(message);
//     } else {
//       const responseData = await getRestaurantInfo(microSiteName);
//       console.log(responseData);
//       const latitude = responseData.Address.Latitude;
//       const longitude = responseData.Address.Longitude;
//       const selectedTime = selectedDateTime.split("T")[1].split(".")[0];

//       console.log(
//         `Latitude: ${latitude} Longitude: ${longitude} selectedTime: ${selectedTime}`
//       );

//       const suggestions = await SearchAvailabilityByDistance(
//         latitude,
//         longitude,
//         selectedDate,
//         selectedTime,
//         selectedPartySize
//       );
//     }
//   } catch (error) {
//     console.log(`Error is : ${error}`);
//   }

//   try {
//     const result = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       options: {
//         cache: "no-store",
//       },
//       method: "POST",

//       body: JSON.stringify({
//         PartySize: PartySize,
//         VisitDate: Date,
//         ChannelCode: "ONLINE",
//       }),
//     });

//     const data = await result.json();

//     return Response.json(data);
//   } catch (error) {
//     return Response.json(`Error is : ${error}`);
//   }
// }

// const getRestaurantNames = async () => {
//   const base_url = process.env.BASE_URL;

//   const url = `${base_url}ConsumerApi/v1/Restaurants`;
//   var data;
//   try {
//     const result = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },

//       method: "GET",
//     });

//     data = await result.json();
//     // console.log(`Restaurant Names: ${data}`);
//     return data;
//   } catch (error) {
//     return console.log(`Error is : ${error}`);
//   }
// };

// const getRestaurantInfo = async (microSiteName) => {
//   const base_url = process.env.BASE_URL;

//   const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}`;
//   var data;
//   try {
//     const result = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },

//       method: "GET",
//     });

//     data = await result.json();
//     // console.log(data);
//     return data;
//   } catch (error) {
//     return console.log(`Error is : ${error}`);
//   }
// };

// const SearchAvailabilityByDistance = async (
//   // microSiteName,
//   latitude,
//   longitude,
//   date,
//   time,
//   selectedPartySize
// ) => {
//   const base_url = process.env.BASE_URL;

//   console.log(`Date: ${date} Time: ${time} Party Size: ${selectedPartySize}`);

//   const url = `${base_url}ConsumerApi/v1/Restaurant/SearchAvailabilityByDistance?lat=${latitude}&lon=${longitude}&visitDate=${date}&visitTime=${time}&covers=${selectedPartySize}&page=1&pageSize=5&radius=10000`;
//   var data;
//   try {
//     const result = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },

//       method: "GET",
//     });

//     data = await result.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     return console.log(`Error is : ${error}`);
//   }
// };
