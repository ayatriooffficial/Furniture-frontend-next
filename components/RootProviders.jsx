"use client";

import { Providers } from "@/provider";
import SwiperProvider from "@/providers/SwiperProvider";
import NextTopLoader from "nextjs-toploader";

export function RootProviders({ children }) {
  return (
    <Providers>
      <SwiperProvider>
        <NextTopLoader color="#000" showSpinner={false} zIndex={99999} />
        {children}
      </SwiperProvider>
    </Providers>
  );
}
