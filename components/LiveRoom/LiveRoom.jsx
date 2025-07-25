"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/constants/base-url";

const LiveRoom = ({ userInfo }) => {
  const router = useRouter();
  const socket = useSocket();

  const [optionClick, setOptionClick] = useState("Instant Meeting");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({ status: null, text: "" });
  const [previousProduct, setPreviousProduct] = useState(null);

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

  useEffect(() => {
    getCategories();
  }, []);

  const requestJoin = () => {
    if (socket) {
      socket.emit("request_join", {
        email: userInfo.user.email,
        displayName: userInfo.user.displayName,
        image: userInfo.user.image,
        category: selectedCategory.name,
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

      <div className="fixed h-full w-screen bg-black/80 z-[9999] backdrop:blur-sm top-0 left-0">
        <section className="pt-[15vh] text-black bg-white absolute right-0 top-0 h-screen p-6 z-50 w-full sm:w-[90%] md:w-[30%]">
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

              <div className="flex justify-around text-lg font-medium mt-16">
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
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">
                      Select Category
                    </label>
                    <select
                      className="w-full border rounded-lg p-2 text-sm sm:text-base"
                      onChange={(e) => {
                        const selectedCategory = categories.find(
                          (category) => category._id === e.target.value
                        );
                        setSelectedCategory(selectedCategory);
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="bg-black text-white w-full h-10 sm:h-12 rounded-full mt-4 text-sm sm:text-base"
                    onClick={requestJoin}
                  >
                    Join
                  </button>

                  {message.status && (
                    <p className="mt-4 text-center text-sm">{message.text}</p>
                  )}
                </div>
              )}
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
