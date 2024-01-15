import { Inter } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "../contexts/BookingContext";
import {
  getSetup,
  getAvailabilityForDateRangeV2,
  getAvailabilitySearch,
  getRestaurantInfo,
} from "../serverMethods/servermethods";
import { NavigationProvider } from "../contexts/NavigationContext";
import Image from "next/image";
import BackButton from "../components/ui/layout/BackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: " Booking Widget",
  description: "Created by Bhushan Ahire",
};

export default async function RootLayout({ children }) {
  const currentDate = new Date();

  const setup = await getSetup(currentDate.toISOString().split("T")[0]);
  const availabilityForDateRangeV2 = await getAvailabilityForDateRangeV2(
    currentDate,
    setup.OnlinePartySizeDefault
  );
  const availabilitySearch = await getAvailabilitySearch(
    setup.OnlinePartySizeDefault,
    currentDate
  );
  const restaurantDetails = await getRestaurantInfo(process.env.MICROSITE_NAME);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationProvider>
          <BookingProvider
            setup={setup}
            availabilitySearch={availabilitySearch}
            availabilityForDateRangeV2={availabilityForDateRangeV2}
            restaurantDetails={restaurantDetails}
          >
            <div>
              <div className="bg-[#31484e]">
                <div className="container max-w-5xl min-h-screen mx-auto font-sans  ">
                  <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:py-2 text-md mx-auto">
                    <div className="basis-1/3 text-lg ">
                      <BackButton />
                    </div>
                    <div className="basis-1/3 flex justify-center items-center ">
                      <a href="#">
                        <Image
                          src={restaurantDetails.Images[0].Url}
                          alt="logo"
                          height={100}
                          width={150}
                          className="max-w-[220px] max-h-[130px] min-w-[180px] min-h-[80px]"
                        />
                      </a>
                    </div>
                    <div className="basis-1/3  text-lg">
                      <p className=" font-medium text-gray-100 ">
                        Need assistance? Phone us on
                      </p>
                      <a
                        href="tel:+0203301155"
                        className="whitespace-nowrap  text-[#c6b071] text-lg hover:text-yellow-600 leading-3"
                      >
                        0203 301 1155
                      </a>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={restaurantDetails.MainImage.Url}
                      // src="/images/citizen.jpg"
                      alt="Citizen"
                      height={650}
                      width={1100}
                      className="max-w-full h-full max-h-[570px] mb-4 rounded-lg"
                    />
                  </div>
                  <div className="-mt-56 mb-4  max-w-2xl min-h-2xl mx-auto justify-center items-center">
                    <div className="">{children}</div>
                  </div>

                  <div className="flex flex-col p-4  ">
                    <div className="w-full text-center ">
                      <h1 className="text-base font-semibold text-[#c6b071]">
                        GET IN TOUCH WITH A MEMBER OF OUR TEAM
                      </h1>
                      <p className="text-sm text-slate-50">
                        For all other enquiries or questions, please get in
                        touch below.
                      </p>
                      <p className="text-sm text-slate-50">
                        *Please note, that all calls will be recorded for
                        training and monitoring purposes.
                      </p>
                    </div>

                    {/* Flex container for contact and address info */}
                    <div className="flex flex-col md:flex-row text-center md:items-center">
                      {/* Contact us div */}
                      <div className="basis-1/2  m-2 py-5 md:mb-0">
                        <h3 className="text-lg font-semibold text-[#c6b071]">
                          Contact us
                        </h3>
                        <p className="text-slate-50">Please call the team on</p>
                        <a
                          href="tel:+0203301155"
                          className="whitespace-nowrap text-[#c6b071] hover:text-yellow-600 leading-3"
                        >
                          {restaurantDetails.ReservationPhoneNumber}
                        </a>
                      </div>

                      {/* Vertical line separator */}
                      {/* For md screens and larger, this will be a vertical line */}
                      <div className="hidden md:block self-stretch bg-slate-400 my-4 md:my-4 md:mx-4 w-0.5"></div>

                      {/* For sm screens, this will be a horizontal line */}
                      <div className="md:hidden bg-gray-200 h-1 my-2"></div>

                      {/* Find us div */}
                      <div className="basis-1/2  m-2 md:mb-0">
                        <h3 className="text-lg font-semibold text-[#c6b071] ">
                          Find Us
                        </h3>
                        <p className="text-slate-50">
                          {restaurantDetails.Address.FullAddress}
                        </p>
                        <a
                          href={restaurantDetails.Address.MapLink}
                          className="text-[#c6b071] hover:text-yellow-600 hover:underline hover:opacity-70"
                        >
                          View on Google maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container  max-w-5xl min-h-5 max-h-50 mx-auto sm:my-4">
                <div className="flex flex-col sm:flex-row  justify-between items-center text-md ">
                  <div className="hover:opacity-70 ">
                    <a href="#">
                      <Image
                        src="/logo/anchorlinelogo.png"
                        alt="logo"
                        height={100}
                        width={150}
                      />
                    </a>
                  </div>
                  <div className="hover:opacity-70  ">
                    <a href="#">
                      <Image
                        src="/logo/atlantic.png"
                        alt="logo"
                        height={100}
                        width={150}
                      />
                    </a>
                  </div>
                  <div className="hover:opacity-70 ">
                    <a href="#">
                      <Image
                        src="/logo/citizenlogo.png"
                        alt="logo"
                        height={100}
                        width={150}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </BookingProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
