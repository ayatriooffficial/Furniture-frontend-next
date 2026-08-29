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
  // --- OLD STATE (Commented out for fallback) ---
  // const [selectedImage, setSelectedImage] = useState(""); 
  // const [otherImage, setOtherImage] = useState(""); 
  
  const [sidebarMode, setSidebarMode] = useState(""); // 'room' or 'product'
  const [activeMainRoomImage, setActiveMainRoomImage] = useState("/3d/livingroom2.webp");
  const [activeProductImage, setActiveProductImage] = useState("");
  const [otherImage, setOtherImage] = useState(""); // Second image (variant B)
  const [categoryName, setCategoryName] = useState(""); // State to hold the category from URL
  const [categoryProducts, setCategoryProducts] = useState([]); // NEW STATE to hold fetched products
  
  const staticRoomImages = {
    "Living Room": ["/3d/livingroom.webp", "/3d/livingroom2.webp"],
    "Dining Room": ["/3d/kitchen.webp"], 
    "Bedroom": ["/3d/bedroom1.webp"]
  };

  // Extract the category from the URL query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");
      if (category) {
        setCategoryName(category);
      }
    }
  }, []);

  // Fetch the product data based on categoryName
  const fetchProducts = async (currentCategory) => {
    if (!currentCategory) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetchProductsByCategory/${currentCategory}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
    
      if (Array.isArray(data)) {
        // Keep the full product object as long as it has at least one image
        const products = data.filter(product => product.images && product.images.length > 0);
        setCategoryProducts(products);
      } else {
        console.warn("No products found or incorrect response format.");
        setCategoryProducts([]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Use effect to fetch data when the categoryName changes
  useEffect(() => {
    if (categoryName) {
      fetchProducts(categoryName);
    }
  }, [categoryName]);

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

  // const handleOpenSidebar = () => {
  //   setOpenSidebar(true); // Open the sidebar
  // };

  const handleOpenSidebarForRoom = () => {
    setSidebarMode('room');
    setOpenSidebar(true);
  };

  const handleOpenSidebarForProduct = () => {
    setSidebarMode('product');
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false); // Close the sidebar
  };

  // Function to toggle the slider visibility when Compare button is clicked
  const handleCompareClick = () => {
    setShowSlider(!showSlider); // Toggle the slider visibility
  };

  // /* OLD LOGIC */
  // const handleImageClick = (image) => {
  //   if (!selectedImage) {
  //     setSelectedImage(image); // Set the first image
  //    } else if (!otherImage) {
  //     setOtherImage(image); // Set the first image
  //   } else if (selectedImage && !otherImage) {
  //     setOtherImage(image); // Set the second image for comparison
  //   } else {
  //     setSelectedImage(image); // Reset and set a new selected image
  //     setOtherImage(""); // Clear the other image
  //   }
  // };

  const handleImageClick = (image) => {
    if (sidebarMode === 'room') {
      setActiveMainRoomImage(image);
    } else if (sidebarMode === 'product') {
      setActiveProductImage(image);
    }
    // Auto-close the popup after a selection so the user can see the
    // updated room / product overlay without manually dismissing it.
    setOpenSidebar(false);
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
          {/* OLD LOGIC
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
            </div>
          )} 
          */}
          
          <div className="relative w-full sm:w-[72vw] h-[55vh] sm:h-[75vh]">
             {/* The Main Room Background */}
             <img
                src={activeMainRoomImage}
                alt={`Room default`}
                className="object-cover w-full h-full"
              />
              
              {/* Overlay active product as a floating thumbnail for now (until AI merge is ready) */}
              {activeProductImage && (
                <div className="absolute top-4 left-4 bg-white p-2 shadow-lg border-2 border-blue-500 rounded-md">
                   <p className="text-xs font-bold text-center mb-1">Selected Product</p>
                   <img src={activeProductImage} alt="Selected Product" className="w-24 h-24 object-cover" />
                </div>
              )}
          </div>
        </div>

        {/* Right Section that stays on screen */}
        <div className="absolute inset-x-0 bottom-3 sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-auto sm:h-full flex flex-row sm:flex-col justify-center sm:justify-center items-center sm:items-end gap-2 sm:gap-4 p-2 sm:p-4 z-30 pointer-events-none">
          {/* Text and Icons */}
          <div className="flex flex-row sm:flex-col items-center space-x-1 sm:space-x-0 sm:space-y-4 bg-black rounded-full sm:rounded-none px-2 sm:px-0 py-1.5 sm:py-0 pointer-events-auto shadow-lg">
            {/* Upload Your Room */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover (desktop only) */}
              <div className="hidden sm:block absolute right-14 bg-white w-48 text-black p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Upload Your Room
              </div>
              <div className="flex flex-col items-center justify-center w-12 sm:w-auto">
                <div className="bg-black p-2 sm:p-4 group-hover:bg-white cursor-pointer rounded-full sm:rounded-none">
                  <Image
                    src="/icons/camera.svg"
                    alt="Upload Your Room"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
                <span className="text-white text-[10px] sm:hidden mt-0.5">Upload</span>
              </div>
            </div>

            {/* Choose a Room */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebarForRoom}
            >
              {/* Hidden text that appears on hover (desktop only) */}
              <div className="hidden sm:block absolute right-14 bg-white text-black w-48 p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Choose a Room
              </div>
              <div className="flex flex-col items-center justify-center w-12 sm:w-auto">
                <div className="bg-black p-2 sm:p-4 group-hover:bg-white cursor-pointer rounded-full sm:rounded-none">
                  <Image
                    src="/icons/click and collect.svg"
                    alt="Choose a Room"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
                <span className="text-white text-[10px] sm:hidden mt-0.5">Room</span>
              </div>
            </div>

            {/* Choose a Product */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebarForProduct}
            >
              {/* Hidden text that appears on hover (desktop only) */}
              <div className="hidden sm:block absolute right-14 bg-white text-black w-48 p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Choose a Product
              </div>
              <div className="flex flex-col items-center justify-center w-12 sm:w-auto">
                <div className="bg-black p-2 sm:p-4 group-hover:bg-white cursor-pointer rounded-full sm:rounded-none">
                  <Image
                    src="/icons/instalation.svg"
                    alt="Choose a Product"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
                <span className="text-white text-[10px] sm:hidden mt-0.5">Product</span>
              </div>
            </div>

            {/* Live Specialist Guide */}
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={handleOpenSidebar}
            >
              {/* Hidden text that appears on hover (desktop only) */}
              <div className="hidden sm:block absolute right-14 bg-white text-black w-48 p-[14px] flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Live Specialist Guide
              </div>
              <div className="flex flex-col items-center justify-center w-12 sm:w-auto">
                <div className="bg-black p-2 sm:p-4 group-hover:bg-white cursor-pointer rounded-full sm:rounded-none">
                  <Image
                    src="/icons/golive.svg"
                    alt="Live Specialist Guide"
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:invert-0 invert"
                  />
                </div>
                <span className="text-white text-[10px] sm:hidden mt-0.5">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {openSidebar && (
        <>
          {/* Mobile-only backdrop — clicking closes the popup */}
          <div
            className="fixed inset-0 bg-black/40 z-40 block sm:hidden"
            onClick={handleCloseSidebar}
          />
          <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:w-[450px] overflow-y-auto bg-white h-full shadow-lg z-50 transition-transform transform translate-x-0">
            <div className="sticky top-0 bg-white flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 z-10">
              <h2 className="text-base sm:text-lg font-semibold">Choose Products</h2>
              <button onClick={handleCloseSidebar} aria-label="Close">
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
            <div className="p-3 sm:p-4 flex flex-col items-center justify-center">
              <button className="bg-blue-600 text-sm text-white py-3 px-4 rounded-full w-full sm:w-auto">
                Upload Your Room
              </button>
              <div className=" flex mt-2 ">
                <p className="px-[10px] text-center text-sm text-gray-800">
                  Choose the Right (product name) for Your Rooms is the fast step
                  of future of living
                </p>
              </div>
            </div>

            {/* Tab Section - Only show for rooms */}
            {sidebarMode === 'room' && (
              <div className="p-3 sm:p-4 flex justify-start sm:justify-between gap-2 overflow-x-auto">
                <button
                  onClick={() => handleTabClick("livingroom")}
                  className={`${
                    activeRoom === "Living Room"
                      ? "text-blue-600 border-blue-600"
                      : "text-black border-gray-400"
                  } px-3 sm:px-4 py-2 border-b-2 whitespace-nowrap text-sm sm:text-base`}
                >
                  Living Room
                </button>
                <button
                  onClick={() => handleTabClick("diningroom")}
                  className={`${
                    activeRoom === "Dining Room"
                      ? "text-blue-600 border-blue-600"
                      : "text-black border-gray-400"
                  } px-3 sm:px-4 py-2 border-b-2 whitespace-nowrap text-sm sm:text-base`}
                >
                  Dining Room
                </button>
                <button
                  onClick={() => handleTabClick("bedroom")}
                  className={`${
                    activeRoom === "Bedroom"
                      ? "text-blue-600 border-blue-600"
                      : "text-black border-gray-400"
                  } px-3 sm:px-4 py-2 border-b-2 whitespace-nowrap text-sm sm:text-base`}
                >
                  Bedroom
                </button>
              </div>
            )}

            {/* Image Grid Section */}
            {/* OLD LOGIC
            <div className="grid grid-cols-3 gap-4 p-4">
              {roomImages[activeRoom].map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${activeRoom} ${index}`}
                  className="w-full h-32 object-cover cursor-pointer"
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
            */}
            {/* Content Section */}
            <div className={`${sidebarMode === 'room' ? 'grid grid-cols-2 sm:grid-cols-3' : 'flex flex-col'} gap-3 sm:gap-4 p-3 sm:p-4`}>
              {/* Rooms (Grid) */}
              {sidebarMode === 'room' && staticRoomImages[activeRoom]?.map((image, index) => (
                <img
                  key={`room-${index}`}
                  src={image}
                  alt={`Static ${activeRoom} ${index}`}
                  className={`w-full h-24 sm:h-32 object-cover cursor-pointer ${activeMainRoomImage === image ? 'border-4 border-blue-500' : ''}`}
                  onClick={() => handleImageClick(image)}
                />
              ))}

              {/* Products (Vertical Cards) */}
              {sidebarMode === 'product' && categoryProducts.map((product, index) => (
                <div
                  key={`product-${index}`}
                  className={`flex gap-4 p-2 sm:p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-white ${activeProductImage === product.images[0] ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200'}`}
                  onClick={() => handleImageClick(product.images[0])}
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img src={product.images[0]} alt={product.productTitle} className="w-full h-full object-cover" />
                  </div>
                  {/* Product Info */}
                  <div className="flex flex-col flex-grow justify-center">
                     <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.productTitle}</p>
                     <p className="text-base sm:text-lg font-bold text-black mt-1">
                       ₹{product.perUnitPrice || product.discountedprice?.price || "N/A"}
                       <span className="text-xs font-normal text-gray-500 ml-1">/sq.ft</span>
                     </p>
                     {/* Dummy Rating (can be replaced with real data later) */}
                     <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-sm">★★★★☆</span>
                        <span className="text-xs text-blue-600 hover:underline">124</span>
                     </div>
                  </div>
                </div>
              ))}

              {/* Fallbacks */}
              {sidebarMode === 'room' && (!staticRoomImages[activeRoom] || staticRoomImages[activeRoom].length === 0) && (
                <p className="col-span-2 sm:col-span-3 text-center text-gray-500">No 3D rooms uploaded for {activeRoom} yet.</p>
              )}
              {sidebarMode === 'product' && categoryProducts.length === 0 && (
                <p className="text-center text-gray-500">No products available for this category.</p>
              )}
            </div>
            {/* Compare Button (sticky on mobile so it stays reachable) */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex items-center justify-center">
              <button
                onClick={handleCompareClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-full w-full sm:w-auto"
              >
                Compare
              </button>
            </div>
          </div>
        </>
      )}

      {/* Footer Section — desktop only; the right-side icon stack pill
          already provides the mobile action surface. */}
      <div className="hidden sm:block">
        <Footer handleCompareClick={handleCompareClick} />
      </div>
    </div>

  );
}

export default Header;
