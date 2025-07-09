//convert these into Server actions
//these are httponly cookies and hence can only be accessed through server
"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { getJWT } from "@/actions/getJWT";

export const checkUser = async (router) => {
  try {
    const token = await getJWT();
    
    if (!token) {
      router.push("/login");
      return false;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.isAuthenticated) {
      return true;
    } else {
      router.push("/login");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    router.push("/login");
    return false;
  }
};
