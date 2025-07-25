"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
const page = () => {
  const printRef = useRef();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      window.location.href = "/cart";
    }
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${orderId}`
        );
        const data = await response.json();
        
        setOrder(data?.orders);
        setPaymentStatus(data?.orders?.payment);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchOrderStatus();
  }, [orderId]);

  useEffect(() => {
    if (order?.payment) {
      async function clearCart() {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/clear`, {
            method: "DELETE",
            data: {
              cartId: order.cartId,
            }
          });
        } catch (error) {
          // console.log(error);
        }
      }
    }
  }, [order]);
  // console.log(order, "order");


  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the original page
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative top-[70px] ">
      {order?.payment ? (
        <div ref={printRef} className="flex items-center flex-col gap-10  w-[50vw] h-auto border p-10">
          <h2 className="flex justify-center items-center w-full text-green-500 text-2xl  ">
            Payment Successfull !
          </h2>
          {orderId && (
            <h2 className="flex justify-center items-center w-full text-purple-500 text-xl mt-4 ">
              Order Id: {orderId}
            </h2>
          )}

          <IoMdCheckmarkCircle size={50} color="green" />
          <div className="w-full flex flex-row">
            <div className="text-left w-1/2">
              <p className="my-1">Payment Mode:</p>
              <p className="my-1">Mobile:</p>
              <p className="my-1">Email:</p>
              <p className=" my-5">Amount paid:</p>
              <p>Transaction id</p>
            </div>
            <div className="text-right w-1/2">
              <p className="my-1">{order?.paymentMode}</p>
              <p className="my-1">{order?.address?.phone}</p>
              <p className="my-1">{order?.address?.email}</p>
              <p className=" my-5">₹{order?.amount?.totalPrice}</p>
              <p>{order?.transactionId}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button className=" bg-blue-500 px-5 py-2 rounded" onClick={handlePrint}>PRINT</button>
            <button className=" bg-blue-500 px-5 py-2 rounded">CLOSE</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center flex-col gap-10  w-[50vw] h-auto border p-10">
          <h2 className="flex justify-center items-center w-full text-red-500 text-2xl  ">
            Payment Failed !
          </h2>
          <h2 className="flex justify-center items-center w-full text-purple-500 text-xl mt-4 ">
            Order Id: {orderId}
          </h2>

          <IoMdCloseCircle size={50} color="red" />
          <Link href="/cart">Back to Cart</Link>
        </div>
      )}
    </div>
  );
};

export default page;
