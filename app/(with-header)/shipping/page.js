"use client"
import dynamic from "next/dynamic";
// import Shippingmain from "../../../components/Checkoutcomp/Shippingmain";

const Shippingmain = dynamic(() => import("../../../components/Checkoutcomp/Shippingmain"), {
  ssr: false,
});

const Shipping = () => {
  
  return (
    <div>
      <Shippingmain />
    </div>
  );
};

export default Shipping;
