"use client";

function RoomCardSkeleton() {
  // const [offers, setOffers] = useState([]);

  // useEffect(() => {
  //   const fetchServiceOffers = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`
  //       );
  //       setOffers(data);
  //     } catch (error) {
  //       console.error("Offer fetch error:", error);
  //       setOffers([]);
  //     }
  //   };
  //   fetchServiceOffers();
  // }, []);

  return (
    <section className="flex justify-between mx-auto mt-[100px] mb-[100px] sm:px-[20px] md:px-[52px] px-[12px]">
      {/* Structured Data for Promotion Events */}
      {/* {offers.map((offer) => (
        <script
          key={offer._id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PromotionEvent",
              "name": offer.name,
              "description": offer.description,
              "offers": {
                "@type": "Offer",
                "discount": `${offer.percentageOff}%`,
                "eligibleCustomerType": "Ayatrio members"
              },
              "startDate": new Date(offer.startDate).toISOString().split('T')[0],
              "endDate": new Date(offer.endDate).toISOString().split('T')[0]
            })
          }}
        />
      ))} */}

      <div className="w-full flex justify-center screens">
        <div className="w-full h-[1600px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
          <figure className="parent col-start-1 col-end-3 row-start-1 lg:mb-0 row-end-6 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12">
            <div className="parent relative w-full h-full bg-[#f1f1f1]"></div>
          </figure>

          <figure className="parent col-start-1 col-end-2 row-start-6 row-span-2 lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6">
            <div className="parent relative w-full h-full bg-[#f1f1f1]"></div>
          </figure>

          <figure className="parent col-start-2 col-end-3 row-start-6 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7">
            <div className="parent relative w-full h-full bg-[#f1f1f1]"></div>
          </figure>

          <figure className="parent col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12">
            <div className="parent relative w-full h-full bg-[#f1f1f1]"></div>
          </figure>

          <figure className="parent col-start-2 col-end-3 row-start-9 row-span-2 lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12">
            <div className="parent relative w-full h-full bg-[#f1f1f1]"></div>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default RoomCardSkeleton;