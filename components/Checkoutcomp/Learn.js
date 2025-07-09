"use client";
import React from "react";
import OrderSum from "./OrderSum";
import { useRouter } from "next/navigation";
const Learn = () => {
  const router = useRouter();
  const handlelogin = () => {
    router.push("/login");
  };
  const handleProfile = () => {
    router.push("/profile");
  };
  return (
    <div>
      <div className="grid sm:grid-cols-2 grid-cols-1 items-center gap-4">
        <div className="col-span-1">
          <h4>How would you like to get your order?</h4>
          <p className="text-gray-500">
            Custom regulations for India require a copy of the recipient's KYC.
            The address on the KYC needs to match the shipping address. Our
            courier will contact you via SMS/email to obtain a copy of your KYC.
            The KYC will be stored securely and used solely for the purpose of
            clearing customs for all orders and returns. If your KYC does not
            match your shipping address, please click the link for more
            information.
            <a className="underline text-gray-500" href="#">
              Learn More
            </a>
          </p>
          <br />
          <div className="flex items-center deliver border-black rounded-xl border-solid border-2 sm:w-[40vw] w-[70vw] h-14  p-1">
            <svg
              className="h-8 w-8 text-black"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
              <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
              <line x1="3" y1="9" x2="7" y2="9" />
            </svg>
            <a className="inline pl-4" href="#">
              Deliver it
            </a>
          </div>
          <br />
          <br />

          <div className=" flex flex-col">
            <div
              onClick={handleProfile}
              style={{ width: "fit-content" }}
              className=" cursor-pointer flex items-center justify-center  border border-grey-300 rounded-full border-solid  px-8 py-3"
            >
              Become a member
            </div>

            <div
              onClick={handlelogin}
              style={{ width: "fit-content" }}
              className=" cursor-pointer mt-2  flex justify-center items-center  border border-grey-300  rounded-full border-solid px-8 py-3"
            >
              Login
            </div>
          </div>
        </div>
        <div className="col-span-1 sm:mx-20 mx-2">
          <OrderSum />
        </div>
      </div>
    </div>
  );
};

export default Learn;
