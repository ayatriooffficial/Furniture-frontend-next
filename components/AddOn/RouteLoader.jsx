// "use client"
// import { useEffect, useState } from "react";
// import TopLoader from "@/components/AddOn/TopLoader";
// import { Router } from "next/dist/client/router";


// export default function RouteLoader() {
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const handleRouteChangeStart = (url) => {
//       setLoading(true);
//       console.log("change start")
//     };

//     const handleRouteChangeComplete = (url) => {
//       setLoading(false);
//       console.log("change complete")

//     };

//     const handleRouteChangeError = (url) => {
//       setLoading(false);
//       console.log("change error")

//     };

//     Router.events.on("routeChangeStart", handleRouteChangeStart);
//     Router.events.on("routeChangeComplete", handleRouteChangeComplete);
//     Router.events.on("routeChangeError", handleRouteChangeError);

//     return () => {
//       Router.events.off("routeChangeStart", handleRouteChangeStart);
//       Router.events.off("routeChangeComplete", handleRouteChangeComplete);
//       Router.events.off("routeChangeError", handleRouteChangeError);
//     };
//   }, [Router]);

//   return loading ? <TopLoader /> : null;
// }
