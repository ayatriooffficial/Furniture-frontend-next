// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "./Footer";
// import Slider from "./Slider";

// function Header() {
//   const router = useRouter();

//   console.log("Router object:", router);
//   console.log("Router query:", router.query);
//   console.log("Router isReady:", router.isReady);

//   // Check if router is ready and query is defined
//   if (!router.isReady) {
//     console.log("Router is not ready.");
//     return <div>Loading...</div>; // Or some loading indicator
//   }

//   const { query } = router;
//   const category = query?.category;
//   const id = query?.id;

//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [showSlider, setShowSlider] = useState(false);
//   const [activeRoom, setActiveRoom] = useState("Living Room");
//   const [roomType, setRoomType] = useState("livingroom");
//   const [roomImages, setRoomImages] = useState({
//     "Living Room": [],
//     "Dining Room": [],
//     Bedroom: [],
//   });
//   const [selectedImage, setSelectedImage] = useState("");

//   const fetchProducts = async (roomType, category) => {
//     if (!category) return;
//     const lowerCaseCategory = category.toLowerCase();
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aimodelcategories/${lowerCaseCategory}/${roomType}`;

//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();

//       if (data && Array.isArray(data.images)) {
//         const images = data.images.map((imageObj) => imageObj.url);
//         setRoomImages((prevImages) => ({
//           ...prevImages,
//           [activeRoom]: images,
//         }));

//         if (images.length > 0) {
//           setSelectedImage(images[0]);
//         }
//       } else {
//         console.warn("No 'images' found or 'images' is not an array.");
//       }
//     } catch (error) {
//       console.error("Error fetching product data:", error);
//     }
//   };

//   useEffect(() => {
//     if (category) {
//       try {
//         fetchProducts(roomType, category.toLowerCase());
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     }
//   }, [category, roomType]);

//   const handleTabClick = (room) => {
//     if (room === "livingroom") {
//       setRoomType("livingroom");
//       setActiveRoom("Living Room");
//     } else if (room === "diningroom") {
//       setRoomType("diningroom");
//       setActiveRoom("Dining Room");
//     } else if (room === "bedroom") {
//       setRoomType("bedroom");
//       setActiveRoom("Bedroom");
//     }
//   };

//   const handleOpenSidebar = () => {
//     setOpenSidebar(true);
//   };

//   const handleCloseSidebar = () => {
//     setOpenSidebar(false);
//   };

//   const handleCompareClick = () => {
//     setShowSlider(!showSlider);
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   return (
//     <div className="bg-gray-100 w-full h-auto flex flex-col">
//       {/* Header Section */}
//       <div className="flex items-center justify-between py-4 px-8">
//         <div className="flex">
//           <Link href="/">
//             <Image
//               src="/images/ayatriologo.webp"
//               alt="Ayatrio Logo"
//               width={300}
//               height={40}
//               priority
//               className="w-36 lg:w-36 object-cover"
//             />
//           </Link>
//         </div>
//         <button className="text-xl px-2 hover:bg-[#e5e5e5] rounded-full cursor-pointer">
//           <Image
//             loading="lazy"
//             src="/icons/cancel.svg"
//             alt="close"
//             width={20}
//             height={20}
//             className="py-2 font-bold"
//           />
//         </button>
//       </div>
//       {/* Content Section */}
//       <div className="flex-grow relative flex flex-row items-center">
//         {/* Left Section */}
//         {/* <div className="flex-grow pl-10 relative w-[75%]">
//           {selectedImage ? (
//             <img
//               src={selectedImage} // Display the selected image in the left section
//               alt={`${activeRoom} default`}
//               className="object-cover w-full h-[90vh]"
//             />
//           ) : (
//             <p>No images available for {activeRoom}.</p>
//           )}
//         </div> */}
//         <div className="flex-grow p-10 relative w-[75%]">
//           {showSlider ? (
//             <Slider /> // Render the Slider component when showSlider is true
//           ) : selectedImage ? (
//             <img
//               src={selectedImage} // Display the selected image in the left section
//               alt={`${activeRoom} default`}
//               className="object-cover w-full h-[90vh]"
//             />
//           ) : (
//             <p>No images available for {activeRoom}.</p>
//           )}
//         </div>

//         {/* Right Section that stays on screen */}
//         <div className=" h-full flex flex-col justify-center items-center p-4 relative w-[25%]">
//           {/* Text and Icons */}
//           <div className="flex flex-col space-y-4">
//             <div
//               onClick={handleOpenSidebar}
//               className="flex items-center cursor-pointer"
//             >
//               <div className="bg-white text-black py-2 px-4 flex-1">
//                 Upload Your Room
//               </div>
//               <div className="flex flex-col">
//                 <div className="bg-black p-4 group hover:bg-white cursor-pointer">
//                   <Image
//                     src="/icons/camera.svg"
//                     alt="Upload Your Room"
//                     width={20}
//                     height={20}
//                     className="group-hover:filter group-hover:invert-0 invert"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div
//               onClick={handleOpenSidebar}
//               className="flex items-center cursor-pointer"
//             >
//               <div className="bg-white text-black py-2 px-4 flex-1">
//                 Choose a Room
//               </div>
//               <div className="flex flex-col">
//                 <div className="bg-black p-4 group hover:bg-white cursor-pointer">
//                   <Image
//                     src="/icons/click and collect.svg"
//                     alt="Choose a Room"
//                     width={20}
//                     height={20}
//                     className="group-hover:filter group-hover:invert-0 invert"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div
//               onClick={handleOpenSidebar}
//               className="flex items-center cursor-pointer"
//             >
//               <div className="bg-white text-black py-2 px-4 flex-1">
//                 Choose a Product
//               </div>
//               <div className="flex flex-col">
//                 <div className="bg-black p-4 group hover:bg-white cursor-pointer">
//                   <Image
//                     src="/icons/instalation.svg"
//                     alt="Choose a Product"
//                     width={20}
//                     height={20}
//                     className="group-hover:filter group-hover:invert-0 invert"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div
//               onClick={handleOpenSidebar}
//               className="flex items-center cursor-pointer"
//             >
//               <div className="bg-white text-black py-2 px-4 flex-1">
//                 Live Specialist Guide
//               </div>
//               <div className="flex flex-col">
//                 <div className="bg-black p-4 group hover:bg-white cursor-pointer">
//                   <Image
//                     src="/icons/golive.svg"
//                     alt="Live Specialist Guide"
//                     width={20}
//                     height={20}
//                     className="group-hover:filter group-hover:invert"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Sidebar Overlay */}
//       {openSidebar && (
//         <div className="fixed top-0 right-0 w-[450px] overflow-y-auto bg-white h-full shadow-lg z-50 transition-transform transform translate-x-0">
//           <div className="flex justify-between items-center p-4">
//             <h2 className="text-lg font-semibold">Choose Products</h2>
//             <button onClick={handleCloseSidebar}>
//               <Image
//                 loading="lazy"
//                 src="/icons/cancel.svg"
//                 alt="close"
//                 width={20}
//                 height={20}
//               />
//             </button>
//           </div>

//           {/* Upload Your Room Button */}
//           <div className="p-4 flex flex-col items-center justify-center">
//             <button className="bg-blue-600 text-sm text-white py-3 px-4 rounded-full">
//               Upload Your Room
//             </button>
//             <div className=" flex mt-2 ">
//               <p className="px-[10px] text-center text-sm text-gray-800">
//                 Choose the Right (product name) for Your Rooms is the fast step
//                 of future of living
//               </p>
//             </div>
//           </div>

//           {/* Tab Section */}
//           <div className="p-4 flex justify-between">
//             <button
//               onClick={() => handleTabClick("livingroom")}
//               className={`${
//                 activeRoom === "Living Room"
//                   ? "text-blue-600 border-blue-600"
//                   : "text-black border-gray-400"
//               } px-4 py-2 border-b-2`}
//             >
//               Living Room
//             </button>
//             <button
//               onClick={() => handleTabClick("diningroom")}
//               className={`${
//                 activeRoom === "Dining Room"
//                   ? "text-blue-600 border-blue-600"
//                   : "text-black border-gray-400"
//               } px-4 py-2 border-b-2`}
//             >
//               Dining Room
//             </button>
//             <button
//               onClick={() => handleTabClick("bedroom")}
//               className={`${
//                 activeRoom === "Bedroom"
//                   ? "text-blue-600 border-blue-600"
//                   : "text-black border-gray-400"
//               } px-4 py-2 border-b-2`}
//             >
//               Bedroom
//             </button>
//           </div>

//           {/* Image Grid Section */}
//           <div className="grid grid-cols-3 gap-4 p-4">
//             {roomImages[activeRoom].map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={`${activeRoom} ${index}`}
//                 className="w-full h-32 object-cover cursor-pointer"
//                 onClick={() => handleImageClick(image)} // Click handler to update the left section image
//               />
//             ))}
//           </div>
//         </div>
//       )}
//       {/* Footer Section */}
//       <Footer handleCompareClick={handleCompareClick} />{" "}
//       {/* Pass the compare handler */}
//     </div>
//   );
// }

// export default Header;
// // "use client";
// // import React, { useState, useEffect } from "react";
// // import Link from "next/link";
// // import Image from "next/image";
// // import Footer from "./Footer";
// // import Slider from "./Slider";

// // function Header() {
// //   const [openSidebar, setOpenSidebar] = useState(false); // State to control sidebar visibility
// //   const [showSlider, setShowSlider] = useState(false); // State to control slider visibility
// //   const [activeRoom, setActiveRoom] = useState("Living Room"); // State for active room display
// //   const [roomType, setRoomType] = useState("livingroom"); // State for sending lowercase values in API
// //   const [roomImages, setRoomImages] = useState({
// //     "Living Room": [],
// //     "Dining Room": [],
// //     Bedroom: [],
// //   }); // State to store fetched images
// //   const [selectedImage, setSelectedImage] = useState(""); // State to store the selected image for the left section
// //   const [categoryName, setCategoryName] = useState("wallpaper"); // State to hold the categoryName from the query param

// //   // Fetch the product data based on roomType and categoryName
// //   const fetchProducts = async (roomType, categoryName) => {
// //     if (!categoryName) return; // Ensure categoryName is available

// //     const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aimodelcategories/${categoryName}/${roomType}`;
// //     console.log("Fetching from URL:", apiUrl);

// //     try {
// //       const response = await fetch(apiUrl);
// //       const data = await response.json();
// //       console.log("Fetched data:", data);

// //       // Check if 'images' exists and is an array
// //       if (data && Array.isArray(data.images)) {
// //         const images = data.images.map((imageObj) => imageObj.url); // Map image URLs from 'images' array
// //         setRoomImages((prevImages) => ({
// //           ...prevImages,
// //           [activeRoom]: images,
// //         }));

// //         // Set the first image as the default selected image for the left section
// //         if (images.length > 0) {
// //           setSelectedImage(images[0]);
// //         }
// //       } else {
// //         console.warn("No 'images' found or 'images' is not an array.");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching product data:", error);
// //     }
// //   };

// //   // Extract the categoryName from the query params using window.location
// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const params = new URLSearchParams(window.location.search);
// //       const category = params.get("category"); // Get 'category' from the URL
// //       if (category) {
// //         setCategoryName(category);
// //       }
// //     }
// //   }, []);

// //   // Use effect to fetch data when roomType or categoryName changes
// //   useEffect(() => {
// //     fetchProducts(roomType, categoryName); // Fetch products based on the roomType and categoryName
// //   }, [roomType, categoryName]);

// //   // Function to handle tab clicks and set both roomType and activeRoom
// //   const handleTabClick = (room) => {
// //     if (room === "livingroom") {
// //       setRoomType("livingroom");
// //       setActiveRoom("Living Room");
// //     } else if (room === "diningroom") {
// //       setRoomType("diningroom");
// //       setActiveRoom("Dining Room");
// //     } else if (room === "bedroom") {
// //       setRoomType("bedroom");
// //       setActiveRoom("Bedroom");
// //     }
// //   };

// //   const handleOpenSidebar = () => {
// //     setOpenSidebar(true); // Open the sidebar
// //   };

// //   const handleCloseSidebar = () => {
// //     setOpenSidebar(false); // Close the sidebar
// //   };

// //   const handleCompareClick = () => {
// //     setShowSlider(!showSlider); // Toggle the slider visibility
// //   };

// //   // Function to handle image click in the grid and update the left section
// //   const handleImageClick = (image) => {
// //     setSelectedImage(image); // Update the selected image to the clicked one
// //   };

// //   return (
// //     <div className="bg-gray-100 w-full h-[100vh] flex flex-col">
// //       {/* Header Section */}
// //       <div className="flex items-center justify-between py-4 px-8">
// //         <div className="flex">
// //           <Link href="/">
// //             <Image
// //               src="/images/ayatriologo.webp"
// //               alt="Ayatrio Logo"
// //               width={300}
// //               height={40}
// //               priority
// //               className="w-36 lg:w-36 object-cover"
// //             />
// //           </Link>
// //         </div>
// //         <button className="text-xl px-2 hover:bg-[#e5e5e5] rounded-full cursor-pointer">
// //           <Image
// //             loading="lazy"
// //             src="/icons/cancel.svg"
// //             alt="close"
// //             width={20}
// //             height={20}
// //             className="py-2 font-bold"
// //           />
// //         </button>
// //       </div>

// //       {/* Content Section */}
// //       <div className="flex-grow relative flex flex-col">
// //         <div className="flex-grow p-4">
// //           {showSlider ? (
// //             <Slider />
// //           ) : selectedImage ? (
// //             <img
// //               src={selectedImage}
// //               alt={`${activeRoom} default`}
// //               className="object-cover w-full h-96"
// //             />
// //           ) : (
// //             <p>No images available for {activeRoom}.</p>
// //           )}
// //         </div>

// //         {/* Right Section */}
// //         <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-end p-4">
// //           <div className="flex flex-col space-y-4">
// //             {/* Action buttons go here */}
// //           </div>
// //         </div>
// //       </div>

// //       {openSidebar && (
// //         <div className="fixed top-0 right-0 w-[450px] overflow-y-auto bg-white h-full shadow-lg z-50 transition-transform transform translate-x-0">
// //           <button
// //             onClick={handleCloseSidebar}
// //             className="absolute top-2 right-2 text-xl px-2 hover:bg-[#e5e5e5] rounded-full cursor-pointer"
// //           >
// //             <Image
// //               loading="lazy"
// //               src="/icons/cancel.svg"
// //               alt="close"
// //               width={20}
// //               height={20}
// //               className="py-2 font-bold"
// //             />
// //           </button>
// //           <div className="p-4">
// //             <div className="py-4">
// //               <h2 className="text-xl font-bold mb-4">Choose Your Options</h2>
// //               <ul>
// //                 <li>
// //                   <button
// //                     onClick={() => handleTabClick("livingroom")}
// //                     className={`${
// //                       activeRoom === "Living Room"
// //                         ? "text-blue-600 border-blue-600"
// //                         : "text-black border-gray-400"
// //                     } px-4 py-2 border-b-2`}
// //                   >
// //                     Living Room
// //                   </button>
// //                 </li>
// //                 <li>
// //                   <button
// //                     onClick={() => handleTabClick("diningroom")}
// //                     className={`${
// //                       activeRoom === "Dining Room"
// //                         ? "text-blue-600 border-blue-600"
// //                         : "text-black border-gray-400"
// //                     } px-4 py-2 border-b-2`}
// //                   >
// //                     Dining Room
// //                   </button>
// //                 </li>
// //                 <li>
// //                   <button
// //                     onClick={() => handleTabClick("bedroom")}
// //                     className={`${
// //                       activeRoom === "Bedroom"
// //                         ? "text-blue-600 border-blue-600"
// //                         : "text-black border-gray-400"
// //                     } px-4 py-2 border-b-2`}
// //                   >
// //                     Bedroom
// //                   </button>
// //                 </li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <Footer handleCompareClick={handleCompareClick} />
// //     </div>
// //   );
// // }

// // export default Header;
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./Footer";
import Slider from "./Slider";

function Header() {
  const [openSidebar, setOpenSidebar] = useState(false); // State to control sidebar visibility
  const [showSlider, setShowSlider] = useState(false); // State to control slider visibility
  const [activeRoom, setActiveRoom] = useState("Living Room"); // State for active room display
  const [roomType, setRoomType] = useState("livingroom"); // State for sending lowercase values in API
  const [roomImages, setRoomImages] = useState({
    "Living Room": [],
    "Dining Room": [],
    Bedroom: [],
  }); // State to store fetched images
  const [selectedImage, setSelectedImage] = useState(""); // State to store the selected image for the left section
  const [otherImage, setOtherImage] = useState(""); // Second image (variant B)

  // Fetch the product data based on roomType
  const fetchProducts = async (roomType) => {
    const categoryName = "wallpaper"; // Assuming "wallpaper" is the category name
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aimodelcategories/${categoryName}/${roomType}`;
    

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
    

      // Check if 'images' exists and is an array
      if (data && Array.isArray(data.images)) {
        const images = data.images.map((imageObj) => imageObj.url); // Map image URLs from 'images' array
        

        // Set the fetched images for the active room
        setRoomImages((prevImages) => ({
          ...prevImages,
          [activeRoom]: images,
        }));

        // Set the first image as the default selected image for the left section
        if (images.length > 0) {
          setSelectedImage(images[0]);
        }
      } else {
        console.warn("No 'images' found or 'images' is not an array.");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Use effect to fetch data when the roomType changes
  useEffect(() => {
    fetchProducts(roomType); // Send lowercase room type to API
  }, [roomType]);

  // Function to handle tab clicks and set both roomType and activeRoom
  const handleTabClick = (room) => {
    if (room === "livingroom") {
      setRoomType("livingroom");
      setActiveRoom("Living Room");
    } else if (room === "diningroom") {
      setRoomType("diningroom");
      setActiveRoom("Dining Room");
    } else if (room === "bedroom") {
      setRoomType("bedroom");
      setActiveRoom("Bedroom");
    }
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(true); // Open the sidebar
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false); // Close the sidebar
  };

  // Function to toggle the slider visibility when Compare button is clicked
  const handleCompareClick = () => {
    setShowSlider(!showSlider); // Toggle the slider visibility
  };

  // Function to handle image click in the grid and update the left section
  const handleImageClick = (image) => {
    if (!selectedImage) {
      setSelectedImage(image); // Set the first image
     } else if (!otherImage) {
      setOtherImage(image); // Set the first image
    } else if (selectedImage && !otherImage) {
      setOtherImage(image); // Set the second image for comparison
    } else {
      setSelectedImage(image); // Reset and set a new selected image
      setOtherImage(""); // Clear the other image
    }
  };
  


  return (
    <div className="bg-gray-100 w-full h-[100vh] flex flex-col ">
      {/* Header Section */}
      <div className="flex items-center justify-between py-4 px-8 ">
        <div className="flex">
          <Link href="/">
            <Image
              src="/images/ayatriologo.webp"
              alt="Ayatrio Logo"
              width={300}
              height={40}
              priority
              className="w-36 lg:w-36 object-cover"
            />
          </Link>
        </div>
        <button
  className="text-xl px-2 hover:bg-[#e5e5e5] rounded-full cursor-pointer"
  onClick={() => window.history.back()}
>
  <Image
    loading="lazy"
    src="/icons/cancel.svg"
    alt="close"
    width={20}
    height={20}
    className="py-2 font-bold"
  />
</button>


      </div>

      {/* Content Section */}
      <div className="flex-grow relative flex flex-col">
        {/* Left Section */}
        <div className="flex-grow p-4 flex justify-center items-center">
          {showSlider ? (
            <Slider variantA={selectedImage} variantB={otherImage}/>
          ) : selectedImage ? (
            <img
              src={selectedImage}
              alt={`${activeRoom} default`}
              className="object-cover w-[72vw] max-h-[75vh] "
            />
          ) : (
            <div>
              <p>No images available for {activeRoom}.</p>
               {/* <img
              src={"https://ayatrio-bucket.s3.ap-south-1.amazonaws.com/_Hall_St_0256_v2.jpg"}
              alt={`${activeRoom} default`}
              className="object-cover w-full h-[87vh]"
            /> */}

            </div>
          )}
        </div>

        {/* Right Section that stays on screen */}
        <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-end p-4">
          {/* Text and Icons */}
          <div className="flex flex-col space-y-4 bg-black">
            {/* Upload Your Room */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover */}
              <div className="absolute right-14 bg-white w-48 text-black p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Upload Your Room
              </div>
              <div className="flex flex-col">
                <div className="bg-black p-4 group-hover:bg-white cursor-pointer">
                  <Image
                    src="/icons/camera.svg"
                    alt="Upload Your Room"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
              </div>
            </div>

            {/* Choose a Room */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover */}
              <div className="absolute right-14 bg-white  text-black w-48 p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Choose a Room
              </div>
              <div className="flex flex-col">
                <div className="bg-black p-4 group-hover:bg-white cursor-pointer">
                  <Image
                    src="/icons/click and collect.svg"
                    alt="Choose a Room"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
              </div>
            </div>

            {/* Choose a Product */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover */}
              <div className="absolute right-14 bg-white text-black w-48 p-[14px]  flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Choose a Product
              </div>
              <div className="flex flex-col">
                <div className="bg-black p-4 group-hover:bg-white cursor-pointer">
                  <Image
                    src="/icons/instalation.svg"
                    alt="Choose a Product"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
              </div>
            </div>

            {/* Live Specialist Guide */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover */}
              <div className="absolute right-14 bg-white text-black w-48 p-[14px]  flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Live Specialist Guide
              </div>
              <div className="flex flex-col">
                <div className="bg-black p-4 group-hover:bg-white cursor-pointer">
                  <Image
                    src="/icons/golive.svg"
                    alt="Live Specialist Guide"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {openSidebar && (
        <div className="fixed top-0 right-0 w-[450px] overflow-y-auto bg-white h-full shadow-lg z-50 transition-transform transform translate-x-0">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Choose Products</h2>
            <button onClick={handleCloseSidebar}>
              <Image
                loading="lazy"
                src="/icons/cancel.svg"
                alt="close"
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Upload Your Room Button */}
          <div className="p-4 flex flex-col items-center justify-center">
            <button className="bg-blue-600 text-sm text-white py-3 px-4 rounded-full">
              Upload Your Room
            </button>
            <div className=" flex mt-2 ">
              <p className="px-[10px] text-center text-sm text-gray-800">
                Choose the Right (product name) for Your Rooms is the fast step
                of future of living
              </p>
            </div>
          </div>

          {/* Tab Section */}
          <div className="p-4 flex justify-between">
            <button
              onClick={() => handleTabClick("livingroom")}
              className={`${
                activeRoom === "Living Room"
                  ? "text-blue-600 border-blue-600"
                  : "text-black border-gray-400"
              } px-4 py-2 border-b-2`}
            >
              Living Room
            </button>
            <button
              onClick={() => handleTabClick("diningroom")}
              className={`${
                activeRoom === "Dining Room"
                  ? "text-blue-600 border-blue-600"
                  : "text-black border-gray-400"
              } px-4 py-2 border-b-2`}
            >
              Dining Room
            </button>
            <button
              onClick={() => handleTabClick("bedroom")}
              className={`${
                activeRoom === "Bedroom"
                  ? "text-blue-600 border-blue-600"
                  : "text-black border-gray-400"
              } px-4 py-2 border-b-2`}
            >
              Bedroom
            </button>
          </div>

          {/* Image Grid Section */}
          <div className="grid grid-cols-3 gap-4 p-4">
            {roomImages[activeRoom].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${activeRoom} ${index}`}
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => handleImageClick(image)} // Click handler to update the left section image
              />
            ))}
          </div>
          {/* Compare Button */}
          <div className="p-4 flex items-center justify-center">
            <button
              onClick={handleCompareClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer handleCompareClick={handleCompareClick} />
    </div>

  );
}

export default Header;
