"use client";

import RootLayout from "@/app/layout";
import { useState } from "react";

const SplashWrapper = () => {
  const [state, setState] = useState("karu");
  return <RootLayout state={state} />;
};

export default SplashWrapper;
