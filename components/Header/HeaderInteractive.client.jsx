"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Asidebox from "./AsideSection/Asidebox";
import Expandedbar from "./Expandedbar";
import Midsection from "./Midsection/Midsection";
import { selecteddbItems, setDbItems } from "../Features/Slices/cartSlice";

// ✅ CLIENT ISLAND COMPONENT - isolated interactivity
// Handles: search, menu toggle, hover effects, modal, authentication, routing

export default function HeaderInteractive({ headerLinks }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // ===== STATE: Navigation & UI =====
  const [isScrolled, setIsScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toptext, setTopText] = useState([]);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ===== STATE: Search Modal =====
  const urlSearchQuery = searchParams.get("search");
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || "");
  const [isModalOpen, setModalOpen] = useState(false);

  // ===== STATE: User & Cart =====
  const CartItems = useSelector(selecteddbItems);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ===== REFS: Animated text =====
  const displayedTextRef = useRef("");
  const currentPhraseIndex = useRef(0);
  const currentCharIndex = useRef(0);
  const textElementRef = useRef(null);
  const textElementRef2 = useRef(null);

  // ===== EFFECT: Load cart data after FCP =====
  useEffect(() => {
    const loadCartData = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          async () => {
            try {
              const deviceId = localStorage.getItem("deviceId");
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
                { params: { deviceId }, timeout: 5000 },
              );
              if (response.status === 200) {
                dispatch(setDbItems(response.data));
              }
            } catch (error) {
              console.error("Cart fetch error:", error);
            }
          },
          { timeout: 2000 },
        );
      } else {
        setTimeout(() => {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
              params: { deviceId: localStorage.getItem("deviceId") },
              timeout: 5000,
            })
            .then((res) => {
              if (res.status === 200) dispatch(setDbItems(res.data));
            })
            .catch((err) => console.error("Cart error:", err));
        }, 1000);
      }
    };

    loadCartData();
  }, [dispatch]);

  // ===== EFFECT: Check authentication =====
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage?.getItem("token");
        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.data.isAuthenticated) {
            setLoggedInUser(response.data.user);
          } else {
            setLoggedInUser(null);
          }
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        setLoggedInUser(null);
      }
    };

    checkUser();
  }, []);

  // ===== EFFECT: Scroll detection (production-level with hide/show) =====
  useEffect(() => {
    let scrollTimeout;
    let lastScrollTime = 0;
    const SCROLL_THROTTLE = 150; // ms - throttle scroll handler

    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;

      // Throttle: only process scroll every 150ms
      if (currentTime - lastScrollTime < SCROLL_THROTTLE) return;
      lastScrollTime = currentTime;

      // Determine if scrolling down or up (with 30px threshold)
      const scrollDelta = currentScrollY - lastScrollY;

      if (scrollDelta > 30) {
        // Scrolling DOWN - hide header
        if (currentScrollY > 100 && !isHeaderHidden) {
          setIsHeaderHidden(true);
        }
      } else if (scrollDelta < -30) {
        // Scrolling UP - show header
        if (isHeaderHidden) {
          setIsHeaderHidden(false);
        }
      }

      // Update scroll states
      setIsScrolled(currentScrollY > 0);
      setAtTop(currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, isHeaderHidden]);

  // ===== EFFECT: Animated search text =====
  const phrases =
    pathname !== "/ayatrio-map"
      ? [` ' Wallpapers '`, ` ' Curtains '`, ` ' Blinds '`]
      : [` ' Bengaluru '`, ` ' Kolkata '`, ` ' Mumbai '`];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentPhrase = phrases[currentPhraseIndex.current];
      const nextCharIndex = currentCharIndex.current + 1;

      if (nextCharIndex > currentPhrase.length) {
        currentCharIndex.current = 0;
        currentPhraseIndex.current =
          (currentPhraseIndex.current + 1) % phrases.length;
      } else {
        displayedTextRef.current = currentPhrase.substring(0, nextCharIndex);
        currentCharIndex.current = nextCharIndex;
      }

      if (textElementRef.current) {
        textElementRef.current.textContent = displayedTextRef.current;
      }
      if (textElementRef2.current) {
        textElementRef2.current.textContent = displayedTextRef.current;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phrases]);

  // ===== HANDLERS =====

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setIsOpen(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsOpen(false);
    setIsHovered(false);
  };

  const toggleDropdown = (item) => {
    setIsOpen(!isOpen);
  };

  const handleChange = (value) => {
    setIsHovered(value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setHoveredIndex(null);
    if (toptext.length > 0) {
      setTopText([]);
    }

    // Only access document in browser environment
    if (typeof document !== "undefined" && document.body) {
      try {
        if (!isMobileMenuOpen) {
          // Opening menu - prevent scroll
          document.body.style.overflow = "hidden";
        } else {
          // Closing menu - restore scroll
          if (pathname !== "/" && pathname.includes("/")) {
            document.body.style.overflow = "visible";
          } else {
            document.body.style.overflow = "auto";
          }
        }
      } catch (error) {
        console.warn("Mobile menu toggle error:", error);
      }
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    if (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      document.body &&
      window.matchMedia("(max-width: 768px)").matches
    ) {
      try {
        document.body.style.overflow = "hidden";
      } catch (error) {
        console.warn("Modal open error:", error);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (typeof document !== "undefined" && document.body) {
      try {
        document.body.style.overflow = "auto";
      } catch (error) {
        console.warn("Modal close error:", error);
      }
    }
    setSearchQuery("");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTopValue = (text) => {
    setTopText((prev) => [...prev, text]);
  };

  const handlebackArrowClick = () => {
    setTopText([]);
  };

  const handleItemClick = (data) => {
    setTopText((prev) => [...prev, data.name]);
  };

  const handleClick = (link) => {
    toggleMobileMenu();
    router.push(link);
  };

  const handleLoginNav = () => {
    router.push("/login");
  };

  const handleProfileNav = (id) => {
    router.push(`/profile/${id}`);
  };

  const handleLogoutClick = () => {
    localStorage?.removeItem("token");
    window?.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      "_self",
    );
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  // ===== RENDER =====
  return (
    <>
      {/* Overlay for hover effect */}
      {isHovered && <div className="overlay"></div>}

      {/* Main fixed header - instant show/hide (no animation) */}
      <div
        className={`fixed w-full sm:bg-none ${
          !pathname.includes("/checkout") &&
          !pathname.includes("/ayatrio-map") &&
          !pathname.includes("/profile")
            ? atTop
              ? "md:top-[35px] top-[0px]"
              : "top-0"
            : "top-0"
        } z-[9998] bg-white ${isScrolled ? "border-b-[0.5px] border-[#f5f5f5]" : ""} ${
          isHeaderHidden ? "hidden" : "block"
        }`}
      >
        {!searchQuery ? (
          <>
            {/* Desktop Header */}
            <div className="flex flex-row justify-between z-[99999px] items-center sm:px-[20px] px-[20px] h-[60px]">
              {/* Logo */}
              <div className="flex mainlogo items-center mr-20 justify-start">
                <Link href="/">
                  <Image
                    src="/images/ayatriologo.webp"
                    alt="Ayatrio Furnishing"
                    width={300}
                    height={40}
                    priority
                    className="w-36 lg:w-36 object-cover"
                  />
                </Link>
              </div>

              {/* Navigation */}
              {!pathname.includes("/profile") && (
                <div className="flex justify-center items-center gap-1 md:gap-5">
                  <nav className="hidden md:flex">
                    {headerLinks.map((value, idx) => (
                      <div
                        className="px-[12px]"
                        key={idx}
                        onMouseEnter={() => handleMouseEnter(idx)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span
                          className={`text-md cursor-pointer font-semibold${
                            isOpen ? "border-b-2 border-black" : ""
                          }`}
                          onClick={() => toggleDropdown(value.label)}
                        >
                          <p
                            className={`block py-[15px] px-[5px] border-b-2 ${
                              hoveredIndex === idx
                                ? "border-black"
                                : "border-transparent"
                            }`}
                          >
                            {value.label}
                          </p>
                        </span>
                        {hoveredIndex === idx && (
                          <Asidebox
                            handleChange={handleChange}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                            label={value.label}
                          />
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              )}

              {/* Search, Cart, Profile */}
              <div className="flex flex-row items-center justify-between lg:gap-2">
                {/* Desktop Search */}
                <div
                  onClick={handleModalOpen}
                  className="bg-[#f5f5f5] items-center justify-end rounded-full w-[13rem] h-10 p-[9px] hover:bg-[#e5e5e5] cursor-pointer lg:block hidden"
                >
                  <Image
                    loading="lazy"
                    src="/icons/search.svg"
                    alt="Search Icon"
                    className="absolute z-10 w-[18px] h-[18px] mt-[2px] ml-[5px]"
                    width={27}
                    height={27}
                  />
                  <p className="ml-7 self-center lg:text-[13px] text-[12px] mt-0.5 text-gray-600">
                    Search for <span ref={textElementRef}></span>
                  </p>
                </div>

                {/* Wishlist */}
                {!pathname.includes("/profile") && (
                  <div className="sm:block hidden w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer">
                    <Link href="/login">
                      <Image
                        loading="lazy"
                        src="/icons/like.svg"
                        alt="Like Icon"
                        width={22}
                        height={22}
                      />
                    </Link>
                  </div>
                )}

                {/* Cart & Profile */}
                <div className="flex items-center flex-row-reverse lg:flex-row">
                  {/* Cart */}
                  <div className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer">
                    <Link href="/cart">
                      <Image
                        loading="lazy"
                        src="/icons/adtocart.svg"
                        alt="Cart Icon"
                        width={22}
                        height={22}
                      />
                    </Link>
                    {CartItems?.items?.length > 0 && (
                      <div className="cart-notification bg-black">
                        {CartItems?.items?.length}
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  {loggedInUser ? (
                    <div
                      className="pro w-10 h-10 flex p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer"
                      onClick={() => handleProfileNav(loggedInUser._id)}
                    >
                      <Image
                        loading="lazy"
                        src={loggedInUser?.image}
                        alt="Profile Icon"
                        className="header-div-icon rounded-full"
                        width={22}
                        height={22}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="pro w-10 h-10 flex p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer"
                      onClick={handleLoginNav}
                    >
                      <Image
                        loading="lazy"
                        src="/icons/profile.svg"
                        alt="Profile Icon"
                        width={18}
                        height={18}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer md:hidden">
                  <Image
                    loading="lazy"
                    src="/icons/menu.svg"
                    alt="Menu Icon"
                    width={21}
                    height={21}
                    onClick={toggleMobileMenu}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="flex md:mt-16 w-full items-center md:hidden px-[20px] sm:px-[50px] lg:px-[67px] mb-3">
              <div
                className="md:hidden py-[8px] flex items-center justify-between w-full bg-zinc-100 rounded-full h-[45px] p-[9px] hover:bg-zinc-200 cursor-pointer"
                onClick={handleModalOpen}
              >
                <div className="flex items-center">
                  <Image
                    loading="lazy"
                    src="/icons/search.svg"
                    alt="Search Icon"
                    width={20}
                    height={20}
                    className="ml-[10px]"
                  />
                  <p className="ml-3 line-clamp-1 text-[13px] mt-[2px] text-gray-400">
                    Search for <span ref={textElementRef2}></span>
                  </p>
                </div>
                <div className="relative flex items-center">
                  <Image
                    loading="lazy"
                    src="/icons/store.svg"
                    alt="Store icon"
                    width={25}
                    height={25}
                    className="mr-[10px] ml-[10px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/ayatrio-map");
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Search Results Modal */
          <Expandedbar
            searchText={searchQuery}
            onClose={handleModalClose}
            onSearch={handleSearchChange}
          />
        )}
      </div>

      {/* Search Modal */}
      {isModalOpen && (
        <Expandedbar
          searchText={searchQuery}
          onClose={handleModalClose}
          onSearch={handleSearchChange}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex flex-col px-[10px] overflow-y-hidden bg-white z-[9998] md:hidden">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center py-[5px] w-full h-fit mb-4">
            <div className="flex items-center">
              {toptext && toptext.length > 0 ? (
                <div className="flex items-center mt-2">
                  <Image
                    loading="lazy"
                    src="/icons/backarrowRevarce.svg"
                    alt="arrow icon"
                    height={18}
                    width={18}
                    className="rotate-180 cursor-pointer"
                    onClick={handlebackArrowClick}
                  />
                  <p className="text-[18px] ml-[10px] font-semibold">
                    {toptext[toptext.length - 1]}
                  </p>
                </div>
              ) : (
                <div className="mainlogo">
                  <Link href="/">
                    <Image
                      src="/images/ayatriologo.webp"
                      alt="logo"
                      width={300}
                      height={40}
                      priority
                      className="max-w-[135px] mt-[10px] ml-[10px] h-[29px]"
                    />
                  </Link>
                </div>
              )}
            </div>

            {toptext.length === 0 && (
              <div
                className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer md:hidden"
                onClick={toggleMobileMenu}
              >
                X
              </div>
            )}
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col space-y-2">
            {headerLinks.map((value, idx) => (
              <div
                key={idx}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  className={`text-md font-semibold flex items-center justify-between`}
                  href="#"
                  onClick={() => toggleDropdown(value.label)}
                >
                  <p
                    className={`block p-2 text-lg font-medium border-b-2 ${
                      hoveredIndex === idx
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => handleTopValue(value.label)}
                  >
                    {value.label}
                  </p>
                  <div className="pr-[14px]">
                    <Image
                      loading="lazy"
                      src="/icons/backarrowRevarce.svg"
                      height={15}
                      width={15}
                      alt="arrow icon"
                    />
                  </div>
                </Link>
                {hoveredIndex === idx && (
                  <Asidebox
                    hoveredIndex={hoveredIndex}
                    toggleMobileMenu={toggleMobileMenu}
                    onItemClick={handleItemClick}
                    handleClick={handleClick}
                  />
                )}
                {idx === 3 && hoveredIndex === idx && (
                  <Midsection
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                    handleChange={handleChange}
                    toggleMobileMenu={toggleMobileMenu}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t pt-6 pl-2">
            <div className="flex flex-col">
              <div
                onClick={() => handleClick("category/virtualexperience")}
                className="cursor-pointer"
              >
                <p className="text-[14px] py-[8px] font-normal">
                  Virtual shopping
                </p>
              </div>
              <div
                onClick={() => handleClick("/freedesign")}
                className="cursor-pointer"
              >
                <p className="text-[14px] py-[8px] font-normal">
                  Designer request
                </p>
              </div>
              <div
                onClick={() => handleClick("/freesample")}
                className="cursor-pointer"
              >
                <p className="text-[14px] py-[8px] font-normal">
                  Free sample request
                </p>
              </div>
              <div
                onClick={() => handleClick("/customerservice")}
                className="cursor-pointer"
              >
                <p className="text-[14px] py-[8px] font-normal">Help</p>
              </div>
              {loggedInUser ? (
                <p
                  className="text-[14px] font-medium cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  Logout
                </p>
              ) : (
                <p
                  className="text-[14px] font-medium cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Login
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
