import MainComponent from "../components/common/MainComponent";
import ReviewComponent from "../components/common/ReviewComponent";

export default async function Home() {
  return (
    <div className=" flex flex-col  items-center justify-center ">
      <div className="bg-white rounded-lg border-2 border-black shadow-lg overflow-hidden max-w-screen-md w-full mx-2 md:mx-0 my-10">
        <div className="border-b-2 border-black ">
          <ReviewComponent />
        </div>
        <MainComponent />
      </div>
    </div>
  );
}
