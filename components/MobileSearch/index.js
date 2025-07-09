import React from "react";
import "./styles.css";
import { useEffect, useState } from "react";
function MobileSeachBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.scrollY);
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  return (
    <div
      className={`mobile-search-bar sm:invisible w-full fixed top-0 left-0  transition-all ease-in-out duration-300  z-[99]
               ${isScrolled ? "bg-white" : "bg-white"}
               `}
    >
      <div className="seachBar">
        {/* <SearchIcon className="seachbar-icom" /> */}
        <input
          className="seachbar-input"
          placeholder="Anywhere Any week add guests"
        />
      </div>
      <div className="filter">{/* <TuneIcon /> */}</div>
    </div>
  );
}
export default MobileSeachBar;
