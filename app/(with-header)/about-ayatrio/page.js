const imageAndText = [
  {
    id: 1,
    image: "/images/thisIsAyatrio/main.jpg",
    heading: "The AYATRIO Concept",
    text: "At the heart of the AYATRIO concept is our vision - to create a better everyday life for the many people.",
  },
  {
    id: 2,
    image: "/images/thisIsAyatrio/design.jpg",
    heading: "Designed for everyone",
    text: "We feel good design combines form, function, quality, sustainability at a low price. We call it “Democratic Design” - we believe good home furnishing is for everyone.",
  },
  {
    id: 3,
    image: "/images/thisIsAyatrio/shopping.avif",
    heading: "About AYATRIO",
    text: "We are a values-driven company with a passion for life at home, and the best home furnishing solutions. The AYATRIO Group has 420 plus stores in 50 countries.",
  },
  {
    id: 4,
    image: "/images/thisIsAyatrio/environment.webp",
    heading: "Working at AYATRIO",
    text: "We believe that each and everyone has something unique to offer. So discover what it’s like to work at AYATRIO, and see our available jobs.",
  },
  {
    id: 5,
    image: "/images/thisIsAyatrio/ayatrio2.webp",
    heading: "AYATRIO in India",
    text: "AYATRIO is committed to India for the long term. Delhi NCR, Mumbai, and Bangalore are identified among the fast-growing cities for Ingka Group globally. In India, Our ambition is to reach 100 million people in India by 2022. We will establish a strong omnichannel presence in the markets and are also exploring other opportunities in India. It will be through a combination of big AYATRIO stores, smaller city-center stores, and online platforms. The AYATRIO Hyderabad store has completed 2+ years. We are today online in Mumbai, Pune, and Hyderabad. Our Navi Mumbai store opened in December 2020 and two smaller stores will also open in Mumbai during 2021. As a modern home furnishings retailer, AYATRIO will bring best practices from our 75+ years of experience, create employment opportunities, provide skill & competence and increase manufacturing, thereby creating a positive impact on the State, society, and the many people.",
  },
  {
    id: 6,
    image: "/images/thisIsAyatrio/community.jpg",
    heading: "Community Engagement",
    text: "We work hard to be the good neighbour and to support local and global causes through our product development and with the help of the AYATRIO Foundation.",
  },
  {
    id: 7,
    image: "/images/thisIsAyatrio/highlights.jpg",
    heading: "AYATRIO Highlights",
    text: "Check out this year’s top stories from around the AYATRIO world. AYATRIO Highlights is about people, life at home, design and innovation. From the future of augmented reality to giving plastic PET bottles a new lease on life, this is where we celebrate the very best of last year, 2018.",
  },
];

const ThisIsAyatrioPage = () => {
  return (
    <div>
      <div className="mt-32 ">
        {/* This is ayatrio section starts */}

       

        {/* About AYATRIO section starts */}
        <section className="flex flex-col px-[15px] md:px-[55px] gap-5">
          
          <div className="flex flex-col md:flex-row gap-5 w-full">
            {/* Left side: Text content */}
            <div className="md:w-2/3 p-[30px] flex flex-col gap-4">
            <div className="w-[80%] pl-[30px]">
            <h2 className="font-bold pt-[50px] text-[40px]">We Nation Brand</h2>
            <p className="text-lg font-normal">
             With a strong presence across India and wide network of delivery and support centers, 
             we’re here to create that feeling of home for everyone, anywhere.
            </p>
          

              <div className="mt-[30px]">
                <h4 className="font-bold text-lg">Retail Stores: Blue Pins</h4>
                <p>
                  AYATRIO operates stores in key cities like kolkata, Hyderabad, Navi
                  Mumbai, and Bangalore, bringing affordable home solutions to
                  millions.
                </p>
              </div>
              <div className="mt-[30px]">
                <h4 className="font-bold text-lg">
                  Online Presence: Orange Pins
                </h4>
                <p>
                  Our online platforms serve customers in Mumbai, Pune, and
                  Hyderabad, with plans to expand across India.
                </p>
              </div>
              <div className="mt-[30px]">
                <h4 className="font-bold text-lg">
                  Future Expansion: Green Pins
                </h4>
                <p>
                  AYATRIO is exploring new locations in Delhi NCR and other
                  cities to reach 100 million people by 2030.
                </p>
              </div>
            </div></div>
            {/* Right side: Image */}
            <div className="md:w-2/3 p-[30px]">
              <img
                src="/images/thisIsAyatrio/ayatrio-local-business-google-map.jpg"
                alt="AYATRIO India Presence Map"
                className="w-[95%] h-full  rounded-[30px] object-cover"
              />
            </div>
          </div>
        </section>

       

        <section className="bg-[#f5f5f5] p-[50px] mt-[50px]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[36px] font-extrabold text-[#181818] mb-12 text-center tracking-tight">
              Ayatrio Fast Facts
            </h2>
            <div className="flex flex-col md:flex-row md:gap-0 justify-between text-[#181818]">
              {/* Left Column */}
              <div className="md:w-1/3 mb-12 md:mb-0 flex flex-col items-center md:items-start">
                <p className="text-[16px] font-normal mb-1 text-center md:text-left">
                  One of the India&apos;s
                </p>
                <p className="text-[36px] font-extrabold leading-tight mb-1 text-center md:text-left">
                  Largest
                </p>
                <p className="text-[16px] font-normal mb-8 text-center md:text-left">
                  home retailers.
                </p>
                <p className="text-[28px] font-extrabold leading-tight mb-1 text-center md:text-left">
                  Founder-led
                </p>
                <p className="text-[15px] font-normal text-center md:text-left">
                  since inception in 1990.
                </p>
              </div>
              {/* Middle Column */}
              <div className="md:w-1/3 mb-12 md:mb-0 flex flex-col items-center">
                <p className="text-[40px] font-extrabold text-[#181818] leading-tight mb-1">
                  $10 Million
                </p>
                <p className="text-[15px] font-normal mb-8 text-center">
                  in net revenue for the twelve months ended
                  <br />
                  December 31, 2024.
                </p>
                <p className="text-[16px] font-normal mb-1 text-center">
                  Home to
                </p>
                <p className="text-[32px] font-extrabold leading-tight mb-1 text-center">
                  &gt;30 Million
                </p>
                <p className="text-[15px] font-normal text-center">
                  products for any home need from 20K+ suppliers.
                </p>
              </div>
              {/* Right Column */}
              <div className="md:w-1/3 flex flex-col items-center md:items-end">
                <p className="text-[40px] font-extrabold text-[#181818] leading-tight mb-1 text-center md:text-right">
                  10.4 Million
                </p>
                <p className="text-[15px] font-normal mb-8 text-center md:text-right">
                  active customers and counting.
                </p>
                <p className="text-[16px] font-normal mb-1 text-center md:text-right">
                  More than
                </p>
                <p className="text-[32px] font-extrabold leading-tight mb-1 text-center md:text-right">
                  3+K
                </p>
                <p className="text-[15px] font-normal text-center md:text-right">
                  employees with operations in North and South India.
                </p>
              </div>
            </div>
          </div>
        </section>

      
      </div>
    </div>
  );
};

export default ThisIsAyatrioPage;
