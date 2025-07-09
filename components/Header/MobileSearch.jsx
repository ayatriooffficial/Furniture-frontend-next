import React, { useRef, useState, useEffect } from "react";

const MobileSearch = ({ isOpen, onClose, onSearch }) => {
  const inpRef = useRef(null);
  const [searchEngine, SetSeacrhEngine] = useState("");

  useEffect(() => {
    // Reset searchEngine state when the modal opens
    SetSeacrhEngine("");
  }, [isOpen]);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`modal-overlay  z-[9999]  bg-white h-[40vh] w-full ${
        isOpen ? "" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-search-heading"
      data-component="mobile-search-overlay"
    >
      <div
        className="modal"
        onClick={handleModalClick}
        data-component="mobile-search-modal"
      >
        <div className="flex flex-row gap-2 justify-evenly pt-10">
          <section
            className="searchDiv flex flex-col"
            aria-label="Search input and popular searches"
            data-component="search-section"
          >
            <div
              className="searchCon relative sm:w-[600px] w-[70vw] bg-zinc-100 p-2 rounded-full"
              role="search"
            >
              <label htmlFor="mobile-search-input" className="sr-only">
                Search
              </label>
              <input
                id="mobile-search-input"
                ref={inpRef}
                type="text"
                placeholder="Search"
                className="search-input bg-transparent h-full sm:w-full w-[60vw] pl-10 border-0 focus:outline-none "
                value={searchEngine}
                onChange={(e) => {
                  SetSeacrhEngine(e.target.value);
                  onSearch(e);
                }}
                aria-label="Search input"
                data-component="search-input"
              />
              <img
                src="/icons/search.svg"
                alt="Search icon"
                className="w-5 mx-1 my-1.5 top-[10%] right-[1%] absolute z-10"
                aria-hidden="true"
                data-component="search-icon"
              />
            </div>
            <div
              className="flex flex-col gap-4 font-bold"
              aria-label="Popular searches"
              data-component="popular-searches"
            >
              <h2
                id="mobile-search-heading"
                className="font-normal text-slate-600"
              >
                Popular Searches
              </h2>
              <div>
                <div tabIndex={0} role="button" className="cursor-pointer">
                  Engneering Flooring
                </div>
                <div tabIndex={0} role="button" className="cursor-pointer">
                  Grass flooring
                </div>
                <div tabIndex={0} role="button" className="cursor-pointer">
                  Vinial
                </div>
                <div tabIndex={0} role="button" className="cursor-pointer">
                  Wallpaper for Home
                </div>
              </div>
            </div>
          </section>
          <div>
            <button
              onClick={onClose}
              className="border border-black rounded-3xl p-1"
              aria-label="Close search modal"
              data-component="close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;
