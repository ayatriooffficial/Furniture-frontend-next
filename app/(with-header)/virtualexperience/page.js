import dynamic from "next/dynamic";
// import FreeSample from "../../../components/FreeSample/FreeSample";

const FreeSample = dynamic(() => import("../../../components/FreeSample/FreeSample"), {
  ssr: false,
});

const page = () => {
  return (
      <div>
        <FreeSample />
      </div>
  );
};
export default page;
