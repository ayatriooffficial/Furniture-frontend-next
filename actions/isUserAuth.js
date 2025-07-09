"use server";

import axios from "axios";

import { getJWT } from "@/actions/getJWT";

export async function isUserAuth() {
  try {
    const token = await getJWT();

    if (!token) {
      console.log("Token not found");
      return null; //user not a registered user
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

    const userId = response.data.user._id;

    return userId;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
