"use server";
let currentToken = null;
async function fetchToken() {
  const username = process.env.USER;
  const password = process.env.PASSWORD;
  const base_url = process.env.BASE_URL;
  const url = `${base_url}Jwt/v2/Authenticate`;

  try {
    const result = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },

      //cache: "no-store",
      method: "POST",

      body: JSON.stringify({
        Username: `${username}`,
        Password: `${password}`,
      }),
    });

    console.log(url);

    const data = await result.json();
    currentToken = data.Token;

    Response.json({ message: "Success", data: currentToken });
    console.log(data);
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

async function getAvailabilitySearch(partySize, selectedDate) {
  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/AvailabilitySearch`;

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },

      //cache: "no-store",
      method: "POST",

      body: JSON.stringify({
        PartySize: partySize,
        VisitDate: selectedDate,
        ChannelCode: "ONLINE",
      }),
    });

    console.log(url);

    const data = await result.json();

    Response.json({ message: "Success", data: data });
    console.log(data);
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

async function getSetup(selectedDate) {
  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/Setup?date=${selectedDate}&channelCode=ONLINE`;

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      //cache: "no-store",
      method: "GET",
    });

    console.log(url);

    const data = await result.json();
    console.log(data.OnlinePartySizeDefault);
    // Response.json({ message: "Success", data: data });
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

async function getAvailabilityForDateRangeV2(selectedDate, selectedPartySize) {
  const endDate = new Date(selectedDate);
  endDate.setDate(endDate.getDate() + 120);
  console.log(endDate);
  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/AvailabilityForDateRangeV2`;

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      //cache: "no-store",
      method: "POST",
      body: JSON.stringify({
        DateFrom: selectedDate,
        DateTo: endDate,
        PartySize: selectedPartySize,
        ChannelCode: "ONLINE",
        // PromotionId: null,
        AvailabilityType: "Reservation",
      }),
    });

    console.log(url);
    const data = await result.json();
    // Response.json({ message: "Success", data: data });
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

const checkAvailability = async (
  selectedPartySize,
  selectedDate,
  selectedDateTime
) => {
  const microSiteName = process.env.MICROSITE_NAME;
  let availabilityResult = {
    result: false,
    restaurants: [],
    message: "Hello World",
  };
  try {
    const response = await getAvailabilitySearch(
      selectedPartySize,
      selectedDate,
      microSiteName
    );
    // console.log(response);
    const matchingTimeSlot = response.TimeSlots.find((slot) => {
      const slotDate = new Date(slot.TimeSlot);
      const formattedDateTime = new Date(selectedDateTime);
      // console.log(slot.TimeSlot);
      // console.log(`Formatted Time: ${formattedDateTime}`);
      return (
        slotDate.toISOString().split("T")[0] ===
          // selectedDateTime.toISOString().split("T")[0] &&
          formattedDateTime.toISOString().split("T")[0] &&
        slotDate.getHours() === formattedDateTime.getHours() &&
        slotDate.getMinutes() === formattedDateTime.getMinutes() &&
        slot.HasStandardAvailability
      );
    });
    console.log(matchingTimeSlot);
    if (matchingTimeSlot) {
      console.log(
        "Success! Standard availability found for the selected date and time."
      );
      availabilityResult.result = true;
      availabilityResult.message =
        "Success! Standard availability found for the selected date and time.";
      return availabilityResult;
    } else {
      // const responseData = await getRestaurantNames();
      // responseData.forEach(async (restaurant) => {
      //   console.log(restaurant);
      //   const responseData = await getRestaurantInfo(restaurant);

      //   console.log(responseData);
      // });

      console.log(
        `Microsite Name: ${microSiteName} does not have availability at ${selectedDateTime}.`
      );
      availabilityResult.message = `Microsite Name: ${microSiteName} does not have availability at ${selectedDateTime}.`;

      const responseData = await getRestaurantInfo(microSiteName);
      console.log(responseData);
      const latitude = responseData.Address.Latitude;
      const longitude = responseData.Address.Longitude;
      const selectedTime = selectedDateTime.split("T")[1].split(".")[0];

      console.log(
        `Latitude: ${latitude} Longitude: ${longitude} selectedTime: ${selectedTime}`
      );

      const suggestions = await SearchAvailabilityByDistance(
        latitude,
        longitude,
        selectedDate,
        selectedTime,
        selectedPartySize
      );

      suggestions.Data.forEach((restaurant) => {
        const name = restaurant.Name;
        const fullAddress = restaurant.FullAddress;
        console.log(`Name: ${name}, Full Address: ${fullAddress}`);
      });

      if (suggestions.Data.length > 0) {
        availabilityResult.result = false;
        availabilityResult.message =
          "No Availability for the selected date and time. Please see the following suggestions at the DRG restaurants.";
        availabilityResult.restaurants = suggestions.Data;
      } else {
        availabilityResult.result = false;
        availabilityResult.message =
          "No Availability for the selected date and time. No suggestions available.";
      }
      // return console.log("No standard availability found");
      return availabilityResult;
    }
  } catch (error) {
    console.log(`Error is : ${error}`);
  }

  // const matchingTimeSlot = response.TimeSlots.find((slot) => {
  //   const slotDate = new Date(slot.TimeSlot);
  //   return (
  //     slotDate.toISOString().split("T")[0] ===
  //       // selectedDateTime.toISOString().split("T")[0] &&
  //       selectedDateTime.toISOString()[0] &&
  //     slotDate.getHours() === selectedTimeSlot.getHours() &&
  //     slotDate.getMinutes() === selectedTimeSlot.getMinutes() &&
  //     slot.HasStandardAvailability
  //   );
  // });

  // if (matchingTimeSlot) {
  //   return "Success! Standard availability found for the selected date and time.";
  // } else {
  //   const suggestions = {
  //     "Restaurant A": true, // Available (true) on the selected date and time
  //     "Restaurant B": false, // Not available (false) on the selected date and time
  //     "Restaurant C": true, // Available (true) on the selected date and time
  //     // Add more restaurants as needed
  //   };
  //   response.TimeSlots.forEach((slot) => {
  //     const slotDate = new Date(slot.TimeSlot);
  //     const key = `${slotDate.getHours()}:${slotDate.getMinutes()}`;
  //     if (!slot.HasStandardAvailability) {
  //       if (!suggestions[key]) {
  //         suggestions[key] = [];
  //       }
  //       suggestions[key].push(slot.ServiceId); // Store restaurant IDs for suggestions
  //     }
  //   });

  //   const suggestionList = await Promise.all(
  //     Object.entries(suggestions).map(async ([time, restaurants]) => {
  //       const formattedTime = time.split(":").map(Number).join(":");
  //       const restaurantNames = await Promise.all(
  //         restaurants.map(async (restaurantId) => {
  //           // Assuming getRestaurantName is an asynchronous function to fetch restaurant names
  //           const restaurantName = await getRestaurantName(restaurantId);
  //           return `Restaurant ${restaurantName}`;
  //         })
  //       );
  //       return `${formattedTime}: ${restaurantNames.join(", ")}`;
  //     })
  //   );

  //   return suggestionList.length
  //     ? `No standard availability found. Here are some suggestions:\n${suggestionList.join(
  //         "\n"
  //       )}`
  //     : "No standard availability found and no suggestions available.";
  // }
};

const getRestaurantNames = async () => {
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurants`;
  var data;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      //cache: "no-store",
      method: "GET",
    });

    data = await result.json();
    // console.log(`Restaurant Names: ${data}`);
    return data;
  } catch (error) {
    return console.log(`Error is : ${error}`);
  }
};

const getRestaurantInfo = async (microSiteName) => {
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}`;
  var data;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      //cache: "no-store",
      method: "GET",
    });

    data = await result.json();
    // console.log(data);
    return data;
  } catch (error) {
    return console.log(`Error is : ${error}`);
  }
};

const SearchAvailabilityByDistance = async (
  // microSiteName,
  latitude,
  longitude,
  date,
  time,
  selectedPartySize
) => {
  const base_url = process.env.BASE_URL;

  console.log(`Date: ${date} Time: ${time} Party Size: ${selectedPartySize}`);

  const url = `${base_url}ConsumerApi/v1/Restaurant/SearchAvailabilityByDistance?lat=${latitude}&lon=${longitude}&visitDate=${date}&visitTime=${time}&covers=${selectedPartySize}&page=1&pageSize=5&radius=1000`;
  var data;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      //cache: "no-store",
      method: "GET",
    });

    data = await result.json();
    console.log(data);
    return data;
  } catch (error) {
    return console.log(`Error is : ${error}`);
  }
};

async function BookingWithStripeToken(bookingDetails) {
  const {
    partySize,
    selectedDate,
    selectedTime,
    selectedPromotionId,
    comments,
    firstName,
    lastName,
    mobileCountryCode,
    mobileNumber,
    email,
    receiveEmailMarketingsubscribe,
  } = bookingDetails;

  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/BookingWithStripeToken/`;
  console.log(url);

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },

      //cache: "no-store",
      method: "POST",

      body: JSON.stringify({
        VisitDate: selectedDate,
        VisitTime: selectedTime,
        PartySize: partySize,
        ChannelCode: "ONLINE",
        PromotionId: selectedPromotionId,
        SpecialRequests: comments,
        IsLeaveTimeConfirmed: true,
        Customer: {
          FirstName: firstName,
          Surname: lastName,
          MobileCountryCode: mobileCountryCode,
          Mobile: mobileNumber,
          Email: email,
          ReceiveResDiaryEmailMarketing: receiveEmailMarketingsubscribe,
          ReceiveEmailMarketing: receiveEmailMarketingsubscribe,
          // ResDiaryEmailMarketingOptInText: "I would like to receive emails",
          // ReceiveRestaurantEmailMarketing: true,
        },
      }),
    });

    const data = await result.json();

    Response.json({ message: "Success", data: data });
    console.log(data);
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

await fetchToken();

// Set an interval to refresh the token every 60 seconds

setInterval(async () => {
  await fetchToken();
}, 12 * 60 * 60 * 1000);

export {
  getAvailabilitySearch,
  getSetup,
  getAvailabilityForDateRangeV2,
  checkAvailability,
  getRestaurantNames,
  getRestaurantInfo,
  SearchAvailabilityByDistance,
  BookingWithStripeToken,
};
