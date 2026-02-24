"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/constants/base-url";
import { useSelector } from "react-redux";
import { selectRoom, selectCategory } from "@/components/Features/Slices/virtualDataSlice";

const LiveRoom = ({ userInfo }) => {
  const router = useRouter();
  const socket = useSocket();

  const [optionClick, setOptionClick] = useState("Instant Meeting");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ status: null, text: "" });
  const [previousProduct, setPreviousProduct] = useState(null);

  const selectedVirtualRoom = useSelector(selectRoom);
  const selectedVirtualCategory = useSelector(selectCategory);

  const handleSwitchOption = (option) => {
    setOptionClick(option);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      // console.log(error.message);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
      );
      setProducts(response.data);
    } catch (error) {
      // console.log(error.message);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const requestJoin = () => {
    if (socket) {
      // We use the category selected in Redux. 
      // It might be an array if multiple were selected, so we just join them or take the first.
      const categoryToJoin = Array.isArray(selectedVirtualCategory) && selectedVirtualCategory.length > 0 
        ? selectedVirtualCategory[0]
        : (typeof selectedVirtualCategory === "string" ? selectedVirtualCategory : "General");

      socket.emit("request_join", {
        email: userInfo.user.email,
        displayName: userInfo.user.displayName,
        image: userInfo.user.image,
        category: categoryToJoin,
      });
      setMessage({ status: "pending", text: "Waiting for response..." });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.open(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?returnTo=liveroom`,
        "_self"
      );
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
    }
  };

  useEffect(() => {
    if (socket && userInfo && userInfo.isAuthenticated) {
      socket.on("join_accepted", ({ roomId }) => {
        setMessage({
          status: "accepted",
          text: "Your request has been accepted!",
        });
        sessionStorage.setItem("roomId", roomId);
        router.push(`/liveroom/${roomId}`);
      });
      socket.on("join_rejected", () => {
        setMessage({
          status: "rejected",
          text: "Your request has been rejected!",
        });
      });
    }
  }, [socket, router]);

  useEffect(() => {
    const previousProductTitle = sessionStorage?.getItem("previousProduct");
    if (previousProductTitle) {
      setPreviousProduct(previousProductTitle);
    }
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row h-screen px-4 py-4">
        <div className="relative flex-1 bg-black py-4 border-2 border-black"></div>
      </div>

      <div className="fixed h-full w-screen bg-black/80 z-[9999] backdrop:blur-sm top-0 left-0 flex">
        
        {/* Left Section: Server Down Message */}
        <div className="hidden md:flex flex-col items-center justify-center w-[70%] h-full p-8 text-center text-white">
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 max-w-2xl backdrop-blur-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-3xl font-bold mb-4">Server is Down</h1>
            <p className="text-lg text-gray-200">
              The video call server is currently unavailable. 
            </p>
            <p className="text-lg text-gray-200 mt-2">
              Please contact <span className="font-bold text-white text-xl">1-800-888-0199</span> for any product information.
            </p>
          </div>
        </div>

        {/* Right Section: Form Modal */}
        <section className="pt-[5vh] text-black bg-white relative right-0 top-0 h-screen p-6 z-50 w-full sm:w-[90%] md:w-[30%]">
          {userInfo && userInfo.isAuthenticated ? (
            <div className="flex flex-col gap-8">
              <div className="absolute left-4 top-2 flex gap-4 items-center">
                <img
                  className="object-cover w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  src={userInfo.user.image}
                  alt="Profile"
                />
                <div>
                  <h1 className="text-sm font-semibold">
                    {userInfo.user.displayName}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {userInfo.user.email}
                  </p>
                </div>
              </div>

              <div className="flex justify-around text-lg font-medium mt-16 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <h1
                  className={`text-sm sm:text-base border-b-2 cursor-pointer ${
                    optionClick === "Instant Meeting"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSwitchOption("Instant Meeting")}
                >
                  Instant Meeting
                </h1>
                <h1
                  className={`text-sm sm:text-base border-b-2 cursor-pointer ${
                    optionClick === "Schedule Meeting"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSwitchOption("Schedule Meeting")}
                >
                  Schedule Meeting
                </h1>
              </div>

              {optionClick === "Instant Meeting" && (
                <div>
                  <button
                    className="bg-black text-white w-full h-10 sm:h-12 rounded-full mt-4 text-sm sm:text-base"
                    onClick={requestJoin}
                  >
                    Join Instant Meeting
                  </button>

                  {message.status && (
                    <p className="mt-4 text-center text-sm">{message.text}</p>
                  )}
                </div>
              )}

              {/* Products Section below meetings */}
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar mt-4 border-t pt-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="font-semibold text-sm mb-2">Selected Room & Category</h2>
                  <p className="text-sm"><span className="font-medium">Room:</span> {typeof selectedVirtualRoom === 'string' ? selectedVirtualRoom : JSON.stringify(selectedVirtualRoom)}</p>
                  <p className="text-sm"><span className="font-medium">Category:</span> {Array.isArray(selectedVirtualCategory) && selectedVirtualCategory.length > 0 ? selectedVirtualCategory.join(", ") : (typeof selectedVirtualCategory === 'string' ? selectedVirtualCategory : JSON.stringify(selectedVirtualCategory))}</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <h2 className="font-semibold text-sm">Products</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {products
                      .filter((product) => {
                        if (!selectedVirtualCategory) return false;
                        if (Array.isArray(selectedVirtualCategory)) {
                          return selectedVirtualCategory.includes(product.category);
                        }
                        return product.category === selectedVirtualCategory;
                      })
                      .map((product) => (
                      <div key={product._id} className="border p-2 rounded-lg flex flex-col items-center bg-white shadow-sm">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.productTitle} className="w-full h-24 object-contain rounded-md mb-2" />
                        ) : (
                          <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                        <p className="text-xs font-semibold text-center line-clamp-2 w-full">{product.productTitle}</p>
                        <span className="text-xs text-gray-600 mt-1 font-medium">₹{product.perUnitPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col mt-[60px] sm:mt-[80px]">
              <Link
                href={
                  !!previousProduct
                    ? `${BASE_URL}/${previousProduct.replace(/ /g, "-")}`
                    : "/"
                }
                className="flex gap-1 items-center absolute top-4 left-4 px-4 py-2 rounded-full hover:bg-gray-200/45 transition"
              >
                <Image
                  src="/icons/downarrow.svg"
                  width={16}
                  height={16}
                  alt="back"
                />
                <span className="text-sm">Go Back</span>
              </Link>
              <button
                onClick={handleGoogleLogin}
                className="border-2 text-black border-solid w-full sm:h-14 h-10 gap-2 rounded-full transition duration-300 font-semibold flex items-center justify-center my-4"
              >
                <Image
                  loading="lazy"
                  src="/icons/googlelogin.svg"
                  width={20}
                  height={20}
                  alt="google"
                />
                Login with Google
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LiveRoom;
