"use client";

import dynamic from "next/dynamic";
// import Paymentmain from "../../../components/Checkoutcomp/Paymentmain";

const Paymentmain = dynamic(() => import("../../../components/Checkoutcomp/Paymentmain"), {
  ssr: false,
});

const payment = () => {
  return (
    <div>
    <Paymentmain/>
    </div>
    )
}

export default payment;