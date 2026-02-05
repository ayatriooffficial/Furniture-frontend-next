"use client";
import { fetchProfileData } from "@/actions/fetchProfileData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProfileContent from "./ProfileContent";

const Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";

  useEffect(() => {
    // ⚡ DEFERRED: Load profile data after interactive
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          fetchProfileData().then((data) => {
            setProfileData(data);
          });
        },
        { timeout: 2500 },
      );
    } else {
      setTimeout(() => {
        fetchProfileData().then((data) => {
          setProfileData(data);
        });
      }, 2000);
    }
  }, []);

  // Generate Organization Schema
  // const generateOrganizationSchema = () => ({
  //   "@context": "https://schema.org",
  //   "@type": "Organization",
  //   "@id": `${baseUrl}/#organization`,
  //   "name": "Ayatrio Design Crew",
  //   "logo": `${baseUrl}/logo.png`,
  //   "url": baseUrl,
  //   "employee": profileData.map(person => ({
  //     "@type": "Person",
  //     "@id": `${baseUrl}/profile/${person.user?._id}/#person`
  //   })),
  //   "aggregateRating": {
  //     "@type": "AggregateRating",
  //     "ratingValue": "4.93",
  //     "ratingCount": "37600",
  //     "bestRating": "5"
  //   }
  // });

  // // Generate Person List Schema
  // const generatePersonListSchema = () => ({
  //   "@context": "https://schema.org",
  //   "@type": "TeamList",
  //   "itemListElement": profileData.map((person, index) => ({
  //     "@type": "ListItem",
  //     "position": index + 1,
  //     "item": {
  //       "@type": "Person",
  //       "@id": `${baseUrl}/profile/${person.user?._id}/#person`,
  //       "name": person.user?.displayName,
  //       "jobTitle": person.user?.role,
  //       "image": person.user?.image,
  //       "description": `Interior designer at Ayatrio${person.user?.authorDetails?.experience ? ` with ${person.user.authorDetails.experience} years experience` : ''}`,
  //       "affiliation": {
  //         "@type": "Organization",
  //         "name": "Ayatrio",
  //         "url": baseUrl
  //       },
  //       "sameAs": [
  //         ...(person.user?.links?.linkedin ? [person.user.links.linkedin] : []),
  //         ...(person.user?.links?.instagram ? [person.user.links.instagram] : []),
  //         ...(person.user?.links?.youtube ? [person.user.links.youtube] : [])
  //       ]
  //     }
  //   }))
  // });

  return (
    <section
      aria-label="Design consultation profile"
      data-component="profile-section"
      className="profile-container"
    >
      {/* Organization Schema
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
      /> */}

      {/* Person List Schema */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonListSchema()) }}
      /> */}

      <div className="pt-14 lg:pt-[90px] grid md:grid-cols-5 grid-cols-1 gap-4 bg-[#f5f5f5] sm:pl-[50px] pl-[12px]">
        <article
          className="col-span-2 md:mb-auto mb-0"
          aria-label="Design crew introduction"
          data-component="profile-intro"
        >
          <div className="col-span-1 mt-4">
            <h3 className="mb-2">IN STORE. AT HOME. VIRTUAL.</h3>
            <div className="font-bold text-3xl mb-4">
              <h2 className="leading-10 pr-[35px]">
                Our Design Crew Loves to Make You Smile
              </h2>
              <div className="mt-1 flex items-center">
                <div
                  className="star-rating flex gap-[3px]"
                  role="img"
                  aria-label="Rating: 4.91 out of 5 stars"
                >
                  <figure className="flex items-center gap-[3px]">
                    {[...Array(4)].map((_, i) => (
                      <Image
                        key={i}
                        src="/icons/star full black.svg"
                        width={17}
                        height={17}
                        alt="Full star"
                        aria-hidden="true"
                      />
                    ))}
                    <Image
                      src="/icons/half black half white.svg"
                      width={17}
                      height={17}
                      alt="Half star"
                      aria-hidden="true"
                    />

                    <figcaption className="ml-1 font-bold text-[18px]">
                      4.93
                    </figcaption>
                    <p className="lg:text-[13px] text-[13px] ">
                      (37.6k+ Happy Ayatrio Member)
                    </p>
                  </figure>
                </div>
              </div>
            </div>
          </div>

          <p className="mb-8">
            Design ideas & inspiration everything you need to express your
            unique style - You'll receive mood boards, product recommendations,
            3D room planing & cost.
          </p>

          <div aria-label="Appointment booking">
            <Link
              href="/freesample"
              className="bg-black pt-2 pb-2 mb-5 mt-16 md:mt-12 border-2 border-black rounded-full flex justify-center items-center text-white w-[270px]"
              aria-label="Book a free design appointment"
              data-component="book-appointment-cta"
            >
              <p>Book a Free Appointment</p>
              <div className="ml-5">
                <Image
                  src="/icons/top_arrow-black-dr.svg"
                  alt=""
                  height={15}
                  width={15}
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </div>

          <p className="text-xs">
            Note: Whether in person or virtual, please select the location
            that's nearest to you.
          </p>
        </article>

        <section
          className="col-span-3 my-auto overflow-x-auto"
          aria-label="Design team profiles"
          data-component="profile-content"
        >
          <ProfileContent initialData={profileData} />
        </section>
      </div>
    </section>
  );
};

export default Profile;
