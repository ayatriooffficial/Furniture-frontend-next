"use client";
import React from "react";
import "./styles.css";
import JoinAyatrioFamily from "./Footer_child/JoinAyatrioFamily";
import { footerData } from "../../Model/FooterColumnData/FooterColumnData";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
const FooterContent = dynamic(() => import("../molecules/FooterContent"), {
  ssr: false,
});

const Footer = () => {
  const pathname = usePathname();
  const liveRoomRoute = "/liveroom";
  const virtualRoomRoute = "/virtualexperience";
  const freeDesignRoute = "/freedesign";
  const freeSamplesRoute = "/freesample";
  const seeOnWallRoute = "/seeonwall";

  return (
    <footer
      aria-label="Site footer"
      data-component="footer"
      className={`${
        (pathname.includes(liveRoomRoute) ||
          liveRoomRoute === pathname ||
          virtualRoomRoute === pathname ||
          freeDesignRoute === pathname ||
          seeOnWallRoute === pathname ||
          freeSamplesRoute === pathname) &&
        "hidden"
      } bg-gray-100 lg:px-[60px] sm:px-[50px] px-[20px] p mt-20 pt-[50px] md-px-[27px]`}
    >
      <div
        className="grid md:grid-cols-6 grid-cols-1 pb-[50px] space-x-12"
        aria-label="Footer main grid"
        data-component="footer-main-grid"
      >
        <div
          className="md:col-span-2 row-span-1 col-span-1 mb-5"
          aria-label="Join Ayatrio Family"
          data-component="footer-join-ayatrio"
        >
          <JoinAyatrioFamily />
        </div>
        <hr className="border w-[75vw] sm:hidden block" />
        {footerData.map((column) => {
          return (
            <FooterContent
              key={column.id}
              headingId={column.id}
              categoryHeading={column.categoryHeading}
              categoryData={column.categoryData}
              aria-label={`Footer column: ${column.categoryHeading}`}
              data-component={`footer-column-${column.id}`}
            />
          );
        })}
      </div>
      <div
        className="flex sm:border-t sm:border-solid sm:border-gray-200 sm:flex-row flex-col justify-between py-[20px]"
        aria-label="Footer bottom bar"
        data-component="footer-bottom-bar"
      >
        <div
          className="flex items-center space-x-4 text-lg font-semibold tracking-tight"
          aria-label="Footer social links"
          data-component="footer-social-links"
        >
          <ul className="flex flex-wrap items-center justify-center text-gray-900 dark:text-white">
            <li className="flex">
              <a
                href="https://www.facebook.com/ayatrio.india/"
                className="me-4 hover:underline"
                aria-label="Facebook"
                data-component="footer-social-facebook"
              >
                <Image
                  width={35}
                  height={35}
                  className="list-socialicon"
                  src="/icons/social-icon/facebook.svg"
                  alt="facebook icon"
                />
              </a>
            </li>
            <li className="flex">
              <a
                href="https://www.instagram.com/ayatrio_india/"
                className="me-4 hover:underline"
                aria-label="Instagram"
                data-component="footer-social-instagram"
              >
                <Image
                  width={37}
                  height={37}
                  className="w-[37px] h-[37px] p-[5px] border border-[#ccc] rounded-full m-[10px]"
                  src="/icons/social-icon/instagram.svg"
                  alt="insta icon"
                />
              </a>
            </li>
            <li className="flex">
              <a
                href="https://twitter.com/ayatrio_india/"
                className="me-4 hover:underline"
                aria-label="Twitter"
                data-component="footer-social-twitter"
              >
                <Image
                  width={35}
                  height={35}
                  className="list-socialicon"
                  src="/icons/social-icon/twitter.svg"
                  alt="twitter icon"
                />
              </a>
            </li>
            <li className="flex">
              <a
                href="https://www.youtube.com/ayatrio/"
                className="me-4 hover:underline"
                aria-label="YouTube"
                data-component="footer-social-youtube"
              >
                <img
                  width={35}
                  height={35}
                  className="list-socialicon"
                  src="/icons/social-icon/youtube.svg"
                  alt="youtube icon"
                />
              </a>
            </li>
          </ul>
        </div>

        <div
          className="flex gap-3"
          aria-label="Footer copyright"
          data-component="footer-copyright"
        >
          <ul className="flex flex-wrap pt-2.5 justify-center text-[#111111] ">
            <li>
              <a href="#" className="me-4 text-xs">
                ©Ayatrio furnishing · 2015-2025
              </a>
            </li>
          </ul>
        </div>

        <div
          className="flex gap-3"
          aria-label="Footer cookie links"
          data-component="footer-cookie-links"
        >
          <ul className="flex flex-wrap pt-2.5 justify-center text-[#111111]">
            <li>
              <a href="/cookie-policy" className="me-4 text-xs hover:underline">
                Cookie policy
              </a>
            </li>
            <li>
              <a href="#" className="me-4 text-xs hover:underline">
                Cookie settings
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
