"use server";

import { cookies } from "next/headers";

export async function getJWT() {
  try {
    const jwt = cookies().get("jwt");
    return jwt ? jwt.value : null;
  } catch (error) {
    console.log(error.message);
  }
}
