import Link from "next/link";
import React from "react";

const Recomend = () => {
  return (
    <section className="flex-col justify-between  p-10 sm:p-1  md:p-10 bg-white">
      <h1 className="text-xl sm:text-2xl md:text-3xl text-black m-9">Recently Recommended</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-black gap-8 m-4 md:m-10">
        <div>
          <img
            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770669317/ayatrio-slider-offedadwr-M-_24.11.2025_gs51l0.avif"
            className="w-full h-[195px]"
            alt="Loadin....
            cursor-pointer"
          />
          <h3 className="text-xl pt-[15px]">Become an Ayatrio Business Member</h3>
          <p>
            We're dedicated to helping SMEs thrive. Register to enjoy 11
            exclusive benefits and receive membership gifts available for a
            limited time!
          </p>
          <Link
            href="#"
            className="cursor-pointer text-blue-600"
          >
            learn more.....
          </Link>
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770669195/ayatrio_busness_to_busniess_s3mhzq.avif"
            className="w-full h-auto"
            alt="Loading...Ayatrio
            cursor-pointer"
          />
          <h3 className="text-xl pt-[15px]">
            Join Ayatrio engineering channel service provider
          </h3>
          <p>
            Let more business partners enjoy Ayatrio's corporate business products
            and services, and jointly develop a market full of opportunities for
            win-win cooperation!
          </p>
          <Link
            href="#"
            className="cursor-pointer text-blue-500"
          >
            learn more.....
          </Link>
        </div>

        <div>
          <img src="/images/Business/room.gif" className="w-full h-auto" alt="Loading...." />
          <h3 className="text-xl pt-[15px]">3D rendering example</h3>
          <p>15㎡ Apartment: Fully Utilizing a Small Space</p>
          <Link
            href="#"
            className="cursor-pointer text-blue-500 "
          >
            learn more.....
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Recomend;
