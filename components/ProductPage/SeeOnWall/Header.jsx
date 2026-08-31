"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import TopActionBar from "./TopActionBar";
import ProductSidebar from "./ProductSidebar";
import MobileBottomSheet from "./MobileBottomSheet";
import BottomToolbar from "./BottomToolbar";
import ShowroomGallery from "./ShowroomGallery";
import ShareModal from "./ShareModal";
import SaveAuthModal from "./SaveAuthModal";
import FiltersModal from "./FiltersModal";
import HistoryDrawer from "./HistoryDrawer";
import Slider from "./Slider";

const INITIAL_SHOWROOMS = [
  {
    id: "livingroom2",
    title: "Modern Living Room",
    category: "Living Room",
    image: "/3d/livingroom2.webp",
  },
  {
    id: "livingroom",
    title: "Classic Living Room",
    category: "Living Room",
    image: "/3d/livingroom.webp",
  },
  {
    id: "bedroom1",
    title: "Master Bedroom",
    category: "Bedroom",
    image: "/3d/bedroom1.webp",
  },
  {
    id: "kitchen",
    title: "Contemporary Kitchen",
    category: "Dining / Kitchen",
    image: "/3d/kitchen.webp",
  },
  {
    id: "washroom",
    title: "Luxury Bathroom",
    category: "Bathroom",
    image: "/3d/washroom.webp",
  },
];

// Helper to extract valid image URL
const getProductImage = (prod) => {
  if (!prod) return null;
  if (Array.isArray(prod.images) && prod.images.length > 0 && typeof prod.images[0] === "string") {
    return prod.images[0];
  }
  if (typeof prod.image === "string") return prod.image;
  if (Array.isArray(prod.productImages) && prod.productImages.length > 0) {
    const item = prod.productImages[0];
    if (Array.isArray(item?.images) && item.images.length > 0) return item.images[0];
  }
  return "/images/default.jpg";
};

function Header() {
  // Visualizer & Room State
  const [activeCategory, setActiveCategory] = useState("Flooring");
  const [activeRoomImage, setActiveRoomImage] = useState("/3d/livingroom2.webp");
  const [activeRoomTitle, setActiveRoomTitle] = useState("Modern Living Room");
  const [rotation, setRotation] = useState(0); // 0 or 90
  const [zoomLevel, setZoomLevel] = useState(100); // 100 to 200

  // Sidebar Collapse / Expand state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mobile Bottom Sheet real-time dynamic height state
  const [sheetHeight, setSheetHeight] = useState(280);
  const [isSheetDragging, setIsSheetDragging] = useState(false);

  // Pan offset for zoomed state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Dynamic Surfaces State
  const [surfaces, setSurfaces] = useState({
    Flooring: { enabled: true, product: null },
    Wallpapers: { enabled: false, product: null },
    Curtains: { enabled: false, product: null },
  });

  // Products Cache by Category
  const [categoryProductsMap, setCategoryProductsMap] = useState({});
  const [originalProduct, setOriginalProduct] = useState(null);
  const [userUploadedRooms, setUserUploadedRooms] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [activeFilters, setActiveFilters] = useState({
    material: "All",
    style: "All",
    room: "All",
    price: "All",
  });
  const [history, setHistory] = useState([]);

  // Modals State
  const [isRoomOptionsOpen, setIsRoomOptionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareActive, setIsCompareActive] = useState(false);

  // Active Category Key Normalization
  const currentCategoryKey = useMemo(() => {
    const lower = (activeCategory || "").toLowerCase();
    if (lower.includes("floor")) return "Flooring";
    if (lower.includes("wall")) return "Wallpaper";
    if (lower.includes("curtain")) return "Curtains";
    if (lower.includes("blind")) return "Window Blinds";
    if (lower.includes("carpet") || lower.includes("rug")) return "Carpet & Rugs";
    if (lower.includes("furnish") || lower.includes("home")) return "Home furnishing";
    if (lower.includes("green") || lower.includes("grass") || lower.includes("plant")) return "Artificial Green";
    if (lower.includes("upholster")) return "Upholstery";
    return activeCategory;
  }, [activeCategory]);

  const activeProduct = surfaces[currentCategoryKey]?.product;

  // 1. EXTRACT URL PARAMETERS ON INITIAL MOUNT
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      const roomParam = params.get("room");
      const rotParam = params.get("rot");

      if (catParam) {
        const lower = catParam.toLowerCase();
        if (lower.includes("wall")) setActiveCategory("Wallpaper");
        else if (lower.includes("curtain")) setActiveCategory("Curtains");
        else if (lower.includes("blind")) setActiveCategory("Window Blinds");
        else if (lower.includes("carpet") || lower.includes("rug")) setActiveCategory("Carpet & Rugs");
        else if (lower.includes("furnish") || lower.includes("home")) setActiveCategory("Home furnishing");
        else if (lower.includes("green")) setActiveCategory("Artificial Green");
        else if (lower.includes("upholster")) setActiveCategory("Upholstery");
        else setActiveCategory("Flooring");
      }

      if (rotParam) {
        setRotation(parseInt(rotParam, 10) === 90 ? 90 : 0);
      }

      if (roomParam) {
        const matched = INITIAL_SHOWROOMS.find((r) => r.id === roomParam || r.image.includes(roomParam));
        if (matched) {
          setActiveRoomImage(matched.image);
          setActiveRoomTitle(matched.title);
        }
      }
    }
  }, []);

  // 2. FETCH PRODUCTS BY CATEGORY WITH CACHING & BACKEND ALIAS FALLBACKS
  const fetchProductsForCategory = async (catKey) => {
    if (categoryProductsMap[catKey]?.length > 0) return;

    // Normalizing category query candidate names for backend
    const queryCandidates = [];
    if (catKey === "Wallpaper" || catKey === "Wallpapers") queryCandidates.push("Wallpaper", "Wallpapers", "wallpaper");
    else if (catKey === "Window Blinds" || catKey === "Blinds") queryCandidates.push("Window Blinds", "Blinds", "blinds");
    else if (catKey === "Curtains") queryCandidates.push("Curtains", "curtains");
    else if (catKey === "Carpet & Rugs" || catKey === "Rugs") queryCandidates.push("Carpet & Rugs", "Carpet and Rugs", "rugs", "carpets");
    else if (catKey === "Home furnishing" || catKey === "Home Decor") queryCandidates.push("Home furnishing", "home furnishing", "Home Decor", "homedecor");
    else if (catKey === "Artificial Green") queryCandidates.push("Artificial Green", "artificial green", "Artificial Grass");
    else if (catKey === "Upholstery") queryCandidates.push("Upholstery", "upholstery", "Fabric");
    else queryCandidates.push(catKey, catKey.toLowerCase());

    let rawList = [];
    for (const q of queryCandidates) {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetchProductsByCategory/${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        if (response.ok) {
          const resJson = await response.json();
          const list = Array.isArray(resJson) ? resJson : Array.isArray(resJson?.products) ? resJson.products : [];
          if (list.length > 0) {
            rawList = list;
            break;
          }
        }
      } catch (err) {
        // Try next alias candidate
      }
    }

    // Fallback 1: If category endpoint is empty, search by keyword query
    if (rawList.length === 0) {
      try {
        const fallbackSearch = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchProducts?query=${encodeURIComponent(catKey)}`);
        if (fallbackSearch.ok) {
          const searchData = await fallbackSearch.json();
          const list = Array.isArray(searchData) ? searchData : Array.isArray(searchData?.products) ? searchData.products : [];
          if (list.length > 0) rawList = list;
        }
      } catch (err) {
        // Continue to fallback 2
      }
    }

    // Fallback 2: Query /api/products and filter by category/subcategory/title
    if (rawList.length === 0) {
      try {
        const allProductsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
        if (allProductsRes.ok) {
          const allProducts = await allProductsRes.json();
          const list = Array.isArray(allProducts) ? allProducts : Array.isArray(allProducts?.products) ? allProducts.products : [];

          const lowerKey = catKey.toLowerCase().replace(/s$/, ""); // "curtain", "blind", "wall decor", "home decor"
          const matched = list.filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const sub = (p.subcategory || "").toLowerCase();
            const title = (p.productTitle || "").toLowerCase();
            return cat.includes(lowerKey) || sub.includes(lowerKey) || title.includes(lowerKey);
          });

          rawList = matched.length > 0 ? matched : list.slice(0, 40);
        }
      } catch (err) {
        console.warn(`Could not fallback fetch for ${catKey}:`, err);
      }
    }

    if (rawList.length > 0) {
      const validProducts = rawList.filter(
        (p) =>
          (Array.isArray(p.images) && p.images.length > 0) ||
          (Array.isArray(p.productImages) && p.productImages.length > 0) ||
          typeof p.image === "string"
      );

      setCategoryProductsMap((prev) => ({
        ...prev,
        [catKey]: validProducts,
      }));

      setSurfaces((prev) => {
        if (prev[catKey]?.product) return prev;

        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const productId = params?.get("id");

        let initial = null;
        if (productId) {
          initial = validProducts.find((p) => p._id === productId);
        }
        if (!initial && validProducts.length > 0) {
          initial = validProducts[0];
        }

        if (initial && !originalProduct) {
          setOriginalProduct(initial);
        }

        return {
          ...prev,
          [catKey]: {
            ...prev[catKey],
            product: initial,
            enabled: true,
          },
        };
      });

      if (validProducts.length > 0) {
        setHistory((prev) => {
          const first = validProducts[0];
          return prev.find((x) => x._id === first._id) ? prev : [first, ...prev];
        });
      }
    }
  };

  useEffect(() => {
    fetchProductsForCategory(currentCategoryKey);
  }, [currentCategoryKey]);

  // 3. SYNCHRONIZE URL STATE
  const updateUrlParams = (catKey, productId, roomImg, rot) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (catKey) url.searchParams.set("category", catKey);
      if (productId) url.searchParams.set("id", productId);
      if (roomImg) {
        const roomObj = INITIAL_SHOWROOMS.find((r) => r.image === roomImg);
        url.searchParams.set("room", roomObj ? roomObj.id : "custom");
      }
      if (rot !== undefined) url.searchParams.set("rot", rot.toString());
      window.history.replaceState({}, "", url.toString());
    }
  };

  // 4. FILTERING & SEARCH LOGIC
  const currentCategoryProducts = categoryProductsMap[currentCategoryKey] || [];

  const filteredProducts = useMemo(() => {
    return currentCategoryProducts.filter((item) => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.productTitle?.toLowerCase().includes(term);
        const matchesCategory = item.category?.toLowerCase().includes(term);
        const matchesMaterial = item.material?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesCategory && !matchesMaterial) return false;
      }

      // Material filter
      if (activeFilters.material !== "All") {
        const itemMat = (item.material || item.subcategory || "").toLowerCase();
        if (!itemMat.includes(activeFilters.material.toLowerCase())) return false;
      }

      // Price filter
      const price = item.perUnitPrice || item.discountedprice?.price || item.price || 95;
      if (activeFilters.price === "Under ₹80" && price >= 80) return false;
      if (activeFilters.price === "₹80 - ₹120" && (price < 80 || price > 120)) return false;
      if (activeFilters.price === "₹120+" && price < 120) return false;

      return true;
    });
  }, [currentCategoryProducts, searchTerm, activeFilters]);

  const activeFilterCount =
    (activeFilters.material !== "All" ? 1 : 0) +
    (activeFilters.style !== "All" ? 1 : 0) +
    (activeFilters.room !== "All" ? 1 : 0) +
    (activeFilters.price !== "All" ? 1 : 0);

  // 5. HANDLERS
  const handleSelectCategory = (catKey) => {
    setActiveCategory(catKey);

    const lower = (catKey || "").toLowerCase();
    const key = lower.includes("floor")
      ? "Flooring"
      : lower.includes("wall")
      ? "Wallpaper"
      : lower.includes("curtain")
      ? "Curtains"
      : lower.includes("blind")
      ? "Window Blinds"
      : lower.includes("carpet") || lower.includes("rug")
      ? "Carpet & Rugs"
      : lower.includes("furnish") || lower.includes("home")
      ? "Home furnishing"
      : lower.includes("green") || lower.includes("grass")
      ? "Artificial Green"
      : lower.includes("upholster")
      ? "Upholstery"
      : catKey;

    fetchProductsForCategory(key);

    setSurfaces((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: true,
      },
    }));

    const prod = surfaces[key]?.product;
    updateUrlParams(catKey, prod?._id, activeRoomImage, rotation);
  };

  const handleSelectProduct = (product) => {
    setSurfaces((prev) => ({
      ...prev,
      [currentCategoryKey]: {
        ...prev[currentCategoryKey],
        product,
        enabled: true,
      },
    }));

    updateUrlParams(currentCategoryKey, product._id, activeRoomImage, rotation);

    setHistory((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const handleSelectRoom = (roomImg, roomTitle) => {
    setActiveRoomImage(roomImg);
    setActiveRoomTitle(roomTitle);
    updateUrlParams(currentCategoryKey, activeProduct?._id, roomImg, rotation);
  };

  const handleUploadRoom = (newRoom) => {
    setUserUploadedRooms((prev) => [newRoom, ...prev]);
    handleSelectRoom(newRoom.image, newRoom.title);
  };

  // ROTATE: 0° (vertical) vs 90° (horizontal)
  const handleToggleRotate = () => {
    const nextRot = rotation === 0 ? 90 : 0;
    setRotation(nextRot);
    updateUrlParams(currentCategoryKey, activeProduct?._id, activeRoomImage, nextRot);
  };

  // ZOOM CONTROLS
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 25, 100);
      if (next === 100) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleSetZoom = (val) => {
    setZoomLevel(val);
    if (val === 100) setPanOffset({ x: 0, y: 0 });
  };

  // RESET
  const handleReset = () => {
    const defaultProduct = originalProduct || currentCategoryProducts[0] || null;
    setActiveCategory("Flooring");
    setRotation(0);
    setZoomLevel(100);
    setPanOffset({ x: 0, y: 0 });
    setActiveRoomImage(INITIAL_SHOWROOMS[0].image);
    setActiveRoomTitle(INITIAL_SHOWROOMS[0].title);
    setSurfaces({
      Flooring: { enabled: true, product: defaultProduct },
      Wallpapers: { enabled: false, product: null },
      Curtains: { enabled: false, product: null },
    });
    setActiveFilters({ material: "All", style: "All", room: "All", price: "All" });
    setSearchTerm("");
    updateUrlParams("Flooring", defaultProduct?._id, INITIAL_SHOWROOMS[0].image, 0);
  };

  // SAVE TO PROJECT HANDLER (Redirects to existing /login if not authenticated)
  const handleOpenSave = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token && !user) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
      setIsSaveOpen(true);
    }
  };

  // PANNING HANDLERS WHEN ZOOMED
  const handleMouseDown = (e) => {
    if (zoomLevel > 100) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && zoomLevel > 100) {
      setPanOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  // 6. CLIENT-SIDE SNAPSHOT DOWNLOAD
  const handleDownloadSnapshot = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    const baseImg = new window.Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = activeRoomImage;

    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, 1200, 800);

      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 740, 1200, 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("AYATRIO 3D VISUALIZER", 32, 777);

      ctx.font = "normal 16px sans-serif";
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(
        `${activeProduct?.productTitle || currentCategoryKey} • ₹${
          activeProduct?.perUnitPrice || 95
        }/sq.ft`,
        310,
        777
      );

      const link = document.createElement("a");
      link.download = `ayatrio-${currentCategoryKey.toLowerCase()}-${(
        activeProduct?.productTitle || "design"
      )
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    };
  };

  // Safe surface texture image URLs
  const flooringImg = surfaces.Flooring.enabled
    ? getProductImage(surfaces.Flooring.product)
    : null;

  const wallpaperImg = surfaces.Wallpapers.enabled
    ? getProductImage(surfaces.Wallpapers.product)
    : null;

  const curtainImg = surfaces.Curtains.enabled
    ? getProductImage(surfaces.Curtains.product)
    : null;

  return (
    <div className="relative w-full h-[100dvh] flex flex-col lg:flex-row bg-[#111111] overflow-hidden select-none">
      {/* 1. DESKTOP LEFT STUDIO SIDEBAR WITH SMOOTH HIDE/EXPAND (>= 1024px) */}
      <div
        className={`hidden lg:block h-full transition-all duration-300 ease-in-out overflow-hidden z-20 flex-shrink-0 ${
          isSidebarOpen
            ? "w-[380px] lg:w-[410px] opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="w-[380px] lg:w-[410px] h-full">
          <ProductSidebar
            activeCategory={currentCategoryKey}
            onSelectCategory={handleSelectCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenFilters={() => setIsFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((v) => (v === "grid" ? "list" : "grid"))}
            onOpenHistory={() => setIsHistoryOpen(true)}
            originalProduct={originalProduct || currentCategoryProducts[0]}
            activeProduct={activeProduct}
            products={filteredProducts}
            onSelectProduct={handleSelectProduct}
          />
        </div>
      </div>

      {/* 2. FLOATING HALF-AND-HALF SEAM COLLAPSE/EXPAND BUTTON (CENTERED ON THE CUT LINE) */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        className={`hidden lg:flex absolute top-[56px] -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-white border border-gray-300 shadow-md hover:shadow-lg text-gray-800 hover:text-black hover:bg-gray-50 items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 ${
          isSidebarOpen
            ? "left-[380px] lg:left-[410px] -translate-x-1/2"
            : "left-2 translate-x-0"
        }`}
      >
        {isSidebarOpen ? (
          <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>

      {/* 3. RIGHT / CANVAS COLUMN */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* TOP ACTION BAR */}
        <TopActionBar
          activeRoomTitle={activeRoomTitle}
          onOpenRoomOptions={() => setIsRoomOptionsOpen(true)}
          onOpenUpload={() => setIsRoomOptionsOpen(true)}
          onOpenSave={handleOpenSave}
          onOpenShare={() => setIsShareOpen(true)}
          onClose={handleClose}
        />

        {/* CENTER VISUALIZER CANVAS STAGE */}
        <main
          className="flex-1 relative h-full flex flex-col items-center justify-between bg-white lg:bg-[#111111] overflow-hidden"
          style={{
            paddingBottom: !isRoomOptionsOpen && typeof window !== "undefined" && window.innerWidth < 1024 ? `${sheetHeight}px` : undefined,
            transition: isSheetDragging ? "none" : "padding-bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* SHOWROOM GALLERY OVERLAY */}
          {isRoomOptionsOpen && (
            <ShowroomGallery
              isOpen={isRoomOptionsOpen}
              onClose={() => setIsRoomOptionsOpen(false)}
              activeRoomImage={activeRoomImage}
              onSelectRoom={handleSelectRoom}
              userUploadedRooms={userUploadedRooms}
              onUploadRoom={handleUploadRoom}
            />
          )}

          {/* COMPARE SLIDER MODE */}
          {isCompareActive ? (
            <div className="w-full h-full p-4 sm:p-8 flex items-center justify-center">
              <Slider
                variantA={activeRoomImage}
                variantB={getProductImage(activeProduct) || activeRoomImage}
              />
            </div>
          ) : (
            /* DYNAMIC MULTI-SURFACE 3D CANVAS WITH INTERACTIVE ZOOM & ROTATE */
            <div
              className="flex-1 w-full min-h-0 relative flex items-center justify-center overflow-hidden transition-transform duration-200"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
                cursor: zoomLevel > 100 ? (isDragging.current ? "grabbing" : "grab") : "default",
              }}
            >
              {/* Room Base Image Frame */}
              <div className="relative w-full h-full max-w-full max-h-[88vh] flex items-center justify-center overflow-hidden">
                <img
                  src={activeRoomImage}
                  alt={activeRoomTitle}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />

                {/* 1. DYNAMIC WALLPAPER SURFACE LAYER */}
                {wallpaperImg && surfaces.Wallpapers.enabled && (
                  <div
                    key={`wall-${wallpaperImg}`}
                    className="absolute top-[8%] inset-x-0 h-[58%] overflow-hidden pointer-events-none transition-all duration-500"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                      opacity: currentCategoryKey === "Wallpapers" ? 0.95 : 0.65,
                    }}
                  >
                    <div
                      className="w-full h-full absolute inset-0 transition-all duration-500"
                      style={{
                        backgroundImage: `url(${wallpaperImg})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "240px 240px",
                        mixBlendMode: "multiply",
                        filter: "contrast(1.08) brightness(0.98)",
                      }}
                    />
                  </div>
                )}

                {/* 2. DYNAMIC FLOORING SURFACE LAYER WITH REALISTIC PERSPECTIVE & 90° ROTATION */}
                {flooringImg && surfaces.Flooring.enabled && (
                  <div
                    key={`floor-container-${rotation}-${flooringImg}`}
                    className="absolute bottom-0 inset-x-0 h-[48%] overflow-hidden pointer-events-none transition-all duration-300"
                    style={{
                      clipPath: "polygon(0 20%, 100% 20%, 100% 100%, 0 100%)",
                      WebkitMaskImage: "linear-gradient(to top, black 82%, rgba(0,0,0,0.6) 96%, transparent 100%)",
                      maskImage: "linear-gradient(to top, black 82%, rgba(0,0,0,0.6) 96%, transparent 100%)",
                    }}
                  >
                    <div
                      key={`floor-mesh-${rotation}-${flooringImg}`}
                      className="w-[280%] h-[280%] -left-[90%] -top-[50%] absolute origin-bottom transition-all duration-300"
                      style={{
                        transform: `perspective(450px) rotateX(64deg) rotate(${rotation}deg)`,
                        backgroundImage: `url(${flooringImg})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: rotation === 90 ? "280px 90px" : "90px 280px",
                        mixBlendMode: "multiply",
                        filter: "contrast(1.18) brightness(0.92)",
                      }}
                    />
                  </div>
                )}

                {/* 3. DYNAMIC CURTAIN & DRAPES SURFACE LAYER */}
                {curtainImg && surfaces.Curtains.enabled && (
                  <div
                    key={`curtain-${curtainImg}`}
                    className="absolute top-[12%] left-[4%] w-[24%] h-[68%] overflow-hidden pointer-events-none transition-all duration-500 rounded-lg"
                    style={{
                      maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)",
                      opacity: currentCategoryKey === "Curtains" ? 0.95 : 0.70,
                    }}
                  >
                    <div
                      className="w-full h-full absolute inset-0 transition-all duration-500"
                      style={{
                        backgroundImage: `url(${curtainImg})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "160px 160px",
                        mixBlendMode: "multiply",
                        filter: "contrast(1.1) brightness(0.95)",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FLOATING CANVAS TOOLBAR WITH REAL ROTATE, RESET, ZOOM */}
          {!isRoomOptionsOpen && (
            <div className="w-full shrink-0 relative lg:absolute lg:bottom-6 z-30 flex justify-center inset-x-0 pointer-events-auto">
              <BottomToolbar
                onReset={handleReset}
                onRotate={handleToggleRotate}
                onToggleCompare={() => setIsCompareActive((prev) => !prev)}
                isCompareActive={isCompareActive}
                zoomLevel={zoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onSetZoom={handleSetZoom}
                rotation={rotation}
              />
            </div>
          )}
        </main>
      </div>

      {/* 4. MOBILE EXPANDABLE BOTTOM SHEET (< 1024px) */}
      {!isRoomOptionsOpen && (
        <div className="block lg:hidden">
          <MobileBottomSheet
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            activeProduct={activeProduct}
            originalProduct={originalProduct || currentCategoryProducts[0]}
            products={filteredProducts}
            onSelectProduct={handleSelectProduct}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenFilters={() => setIsFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
            onOpenHistory={() => setIsHistoryOpen(true)}
            sheetHeight={sheetHeight}
            setSheetHeight={setSheetHeight}
            isDragging={isSheetDragging}
            setIsDragging={setIsSheetDragging}
          />
        </div>
      )}

      {/* MODALS */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        activeRoomName={activeRoomTitle}
        roomImageUrl={activeRoomImage}
        productTitle={activeProduct?.productTitle || currentCategoryKey}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        onDownloadSnapshot={handleDownloadSnapshot}
      />

      <SaveAuthModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        productTitle={activeProduct?.productTitle || currentCategoryKey}
        activeRoomName={activeRoomTitle}
        activeRoomImage={activeRoomImage}
        rotation={rotation}
      />

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        activeFilters={activeFilters}
        onApplyFilters={(filters) => setActiveFilters(filters)}
        totalResultsCount={filteredProducts.length}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectProduct={handleSelectProduct}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}

export default Header;
