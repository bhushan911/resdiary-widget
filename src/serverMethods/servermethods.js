"use server";
// const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let currentToken = null;
let refreshTimeout = null; // To keep track of the timeout

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
      cache: "no-store",
      method: "POST",
      body: JSON.stringify({
        Username: `${username}`,
        Password: `${password}`,
      }),
    });

    const data = await result.json();
    if (data.Status === "Success") {
      currentToken = data.Token;
      scheduleTokenRefresh(data.TokenExpiryUtc);
      // logToFile(`Token fetched successfully: ${JSON.stringify(data)}\n`);
    } else {
      // logToFile(`Failed to fetch token: ${JSON.stringify(data)}\n`);
    }
    return data;
  } catch (error) {
    // logToFile(`Error fetching token: ${error}\n`);
    throw new Error(error);
  }
}

function scheduleTokenRefresh(expiryUtc) {
  if (refreshTimeout) clearTimeout(refreshTimeout);

  const expiryTime = new Date(expiryUtc).getTime();
  const currentTime = new Date().getTime();
  const delay = expiryTime - currentTime;

  if (delay > 0) {
    refreshTimeout = setTimeout(() => {
      fetchToken();
    }, delay);
    // logToFile(`Token will refresh in ${delay / 1000} seconds\n`);
  } else {
    // logToFile("Token expired or invalid expiry time. Refreshing immediately.\n");
    fetchToken();
  }
}

// function logToFile(message) {
//   const dateTime = new Date().toISOString();
//   fs.appendFile("log-file.log", `${dateTime} - ${message}`, (err) => {
//     if (err) throw err;
//   });
// }

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

      cache: "no-store",
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
      cache: "no-store",
      method: "GET",
    });

    console.log(url);

    const data = await result.json();
    // console.log(data.OnlinePartySizeDefault);
    // Response.json({ message: "Success", data: data });
    return data;
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}

async function getAvailabilityForDateRangeV2(selectedDate, selectedPartySize) {
  const endDate = new Date(selectedDate);
  endDate.setDate(endDate.getDate() + 120);
  // console.log(endDate);
  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/AvailabilityForDateRangeV2`;

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      method: "POST",
      body: JSON.stringify({
        DateFrom: selectedDate,
        DateTo: endDate,
        PartySize: selectedPartySize,
        ChannelCode: "ONLINE",
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
    accessedName: microSiteName,
    result: false,
    matchingTimeSlot: null,
    restaurants: [],
    message: "Success",
    restaurantDetails: [],
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
          formattedDateTime.toISOString().split("T")[0] &&
        slotDate.getHours() === formattedDateTime.getHours() &&
        slotDate.getMinutes() === formattedDateTime.getMinutes()
      );
    });
    console.log("Matching Time Slot");
    console.log(matchingTimeSlot);
    if (matchingTimeSlot) {
      console.log(
        "Success! Standard availability found for the selected date and time."
      );
      availabilityResult.result = true;
      availabilityResult.matchingTimeSlot = matchingTimeSlot;
      availabilityResult.message =
        "Success! Standard availability found for the selected date and time.";
      return availabilityResult;
    } else {
      console.log(
        `Microsite Name: ${microSiteName} does not have availability at ${selectedDateTime}.`
      );
      availabilityResult.message = `Restaurant Name: ${microSiteName} does not have availability at ${selectedDateTime}.`;

      const responseData = await getRestaurantInfo(microSiteName);
      // console.log(responseData);
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
      // if (suggestions.Data && suggestions.Data.length > 0) {
      suggestions.Data.forEach((restaurant) => {
        const name = restaurant.Name;
        const fullAddress = restaurant.FullAddress;
        console.log(`Name: ${name}, Full Address: ${fullAddress}`);
      });
      let restaurantDetails = [];
      for (const restaurant of suggestions.Data) {
        const name = restaurant.AccessedName;
        try {
          const response = await getRestaurantInfo(name);
          restaurantDetails.push(response);
        } catch (error) {
          console.error(`Error fetching details for ${name}:`, error);
        }
      }
      // }

      console.log("suggestions", suggestions);
      // console.log("restaurantDetails", restaurantDetails);

      if (suggestions.Message) {
        availabilityResult.result = false;
        availabilityResult.message = suggestions.Message;
      } else if (suggestions.Data.length > 0) {
        availabilityResult.result = false;
        availabilityResult.message =
          "No Availability for the selected date and time. Please see the following suggestions at the DRG restaurants.";
        availabilityResult.restaurants = suggestions.Data;
        availabilityResult.restaurantDetails = restaurantDetails;
      } else {
        availabilityResult.result = false;
        availabilityResult.message =
          "No Availability for the selected date and time. No suggestions available.";
      }
      return availabilityResult;
    }
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
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
      cache: "no-store",
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

  const url = `${base_url}ConsumerApi/v1/Restaurant/SearchAvailabilityByDistance?lat=${latitude}&lon=${longitude}&visitDate=${date}&visitTime=${time}&covers=${selectedPartySize}&page=1&pageSize=5&radius=1000&&visitTimeWindow=240`;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      method: "GET",
    });

    const data = await result.json();

    return data;
  } catch (error) {
    return console.log(`Error is : ${error}`);
  }
};

const SearchByAvailablity = async (
  // microSiteName,
  latitude,
  longitude,
  date,
  time,
  selectedPartySize
) => {
  const base_url = process.env.BASE_URL;

  console.log(`Date: ${date} Time: ${time} Party Size: ${selectedPartySize}`);

  const url = `${base_url}ConsumerApi/v1/Restaurant/SearchAvailability?lat=${latitude}&lon=${longitude}&visitDate=${date}&visitTime=${time}&covers=${selectedPartySize}&page=1&pageSize=5&radius=1000&visitTimeWindow=300`;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      method: "GET",
    });

    const data = await result.json();
    console.log(url);

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
    leaveTimeConfirmed,
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

      cache: "no-store",
      method: "POST",

      body: JSON.stringify({
        VisitDate: selectedDate,
        VisitTime: selectedTime,
        PartySize: partySize,
        ChannelCode: "ONLINE",
        PromotionId: selectedPromotionId,
        SpecialRequests: comments,
        IsLeaveTimeConfirmed: leaveTimeConfirmed,
        Customer: {
          FirstName: firstName,
          Surname: lastName,
          MobileCountryCode: mobileCountryCode,
          Mobile: mobileNumber,
          Email: email,
          ReceiveResDiaryEmailMarketing: receiveEmailMarketingsubscribe,
          ReceiveEmailMarketing: receiveEmailMarketingsubscribe,
        },
        StripeCheckoutSuccessUrl: `${process.env.DOMAIN_NAME}/booking-status`,
        StripeCheckoutCancelUrl: `${process.env.DOMAIN_NAME}/booking-status`,
      }),
    });

    const data = await result.json();
    console.log(data);
    if (data.Status === "Success") {
      return {
        bookingResult: data,
        sessionURL: null,
      };
    } else if (
      data.Status === "PaymentRequired" ||
      data.Status === "CreditCardRequired"
    ) {
      const session = await stripe.checkout.sessions.retrieve(
        data.StripeCheckoutSessionId
      );
      // console.log("session : ", session);

      return {
        bookingResult: data,
        sessionURL: session.url,
      };
    } else {
      return { bookingResult: data };
    }
  } catch (error) {
    return { bookingResult: { status: "Failed", message: error.message } };
  }
}
async function BookingWithStripeTokenwithSession(bookingDetails) {
  const {
    partySize,
    selectedDate,
    selectedTime,
    selectedPromotionId,
    leaveTimeConfirmed,
    comments,
    firstName,
    lastName,
    mobileCountryCode,
    mobileNumber,
    email,
    receiveEmailMarketingsubscribe,
    StripeCheckoutSessionId, // Added sessionId in the destructuring
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

      cache: "no-store",
      method: "POST",

      body: JSON.stringify({
        VisitDate: selectedDate,
        VisitTime: selectedTime,
        PartySize: partySize,
        ChannelCode: "ONLINE",
        PromotionId: selectedPromotionId,
        SpecialRequests: comments,
        IsLeaveTimeConfirmed: leaveTimeConfirmed,
        Customer: {
          FirstName: firstName,
          Surname: lastName,
          MobileCountryCode: mobileCountryCode,
          Mobile: mobileNumber,
          Email: email,
          ReceiveResDiaryEmailMarketing: receiveEmailMarketingsubscribe,
          ReceiveEmailMarketing: receiveEmailMarketingsubscribe,
        },
        StripeCheckoutSessionId: StripeCheckoutSessionId, // Include the sessionId if available
      }),
    });

    const data = await result.json();
    console.log(data);
    return {
      bookingResult: data,
    };
  } catch (error) {
    return { bookingResult: { status: "Failed", message: error.message } };
  }
}

await fetchToken();

export {
  getAvailabilitySearch,
  getSetup,
  getAvailabilityForDateRangeV2,
  checkAvailability,
  getRestaurantNames,
  getRestaurantInfo,
  SearchAvailabilityByDistance,
  SearchByAvailablity,
  BookingWithStripeToken,
  BookingWithStripeTokenwithSession,
};
