export async function POST(req, res) {
  const reqBody = await req.json();
  const PartySize = reqBody.selectedPartySize;
  const Date = reqBody.selectedDate;

  console.log(PartySize);
  console.log(Date);

  const microSiteName = process.env.MICROSITE_NAME;
  const base_url = process.env.BASE_URL;

  const url = `${base_url}ConsumerApi/v1/Restaurant/${microSiteName}/AvailabilitySearch`;

  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },

      options: {
        cache: "no-store",
      },
      method: "POST",

      body: JSON.stringify({
        PartySize: PartySize,
        VisitDate: Date,
        ChannelCode: "ONLINE",
      }),
    });
    console.log(`process.env.ACCESS_TOKEN is ${process.env.ACCESS_TOKEN}`);

    console.log(url);

    const data = await result.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(`Error is : ${error}`);
  }
}
