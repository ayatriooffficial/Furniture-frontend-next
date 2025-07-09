"use server";
import { cookies } from "next/headers";

//this could be used at logout
export async function deleteJWT() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("jwt");
  } catch (error) {
    console.error("Error deleting cookie:", error.message);
  }
}
