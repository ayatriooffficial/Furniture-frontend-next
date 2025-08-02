import axios from "axios";
import Link from "next/link";
import Image from "next/image";
// Define the base URL for Ayatrio at the top
const AYATRIO_BASE_URL = "https://www.ayatrio.com";

const Phone = async () => {
  // Fetch trending categories for the footer links and schema
  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trendingCategoriesNames`
      );
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Fetch subcategories for each category for schema
  const fetchCategoryDataForSchema = async (categories) => {
    try {
      const categoryData = await Promise.all(
        categories.map(async (category) => {
          const subcategoriesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getSubCategories/${encodeURIComponent(category.name)}`
          );
          const subcategories = subcategoriesResponse.data;

          return {
            name: category.name,
            subcategories: subcategories.map(subcategory => ({
              name: subcategory.name
            }))
          };
        })
      );

      return categoryData;
    } catch (error) {
      console.error("Error fetching subcategories for schema:", error);
      return [];
    }
  };

  const categories = await fetchCategory();
  const categoryDataForSchema = await fetchCategoryDataForSchema(categories);

  // Construct the schema dynamically based on fetched data
  // const schemaData = {
  //   "@context": "https://schema.org",
  //   "@type": "BrandEntityRelationship",
  //   "mainEntityOfPage": `${AYATRIO_BASE_URL}/`,
  //   "primaryEntity": {
  //     "@type": "Brand",
  //     "name": "Ayatrio",
  //     "description": "Premium home furnishing & decor brand with nationwide presence in India"
  //   },
  //   "hasEntityCategory": categoryDataForSchema.map(category => ({
  //     "@type": "ProductCategory",
  //     "name": category.name,
  //     "url": `${AYATRIO_BASE_URL}/${category.name.toLowerCase().replace(/ /g, '-')}/`,
  //     "hasCategoryItem": category.subcategories.map(subcategory => ({
  //       "@type": "ProductCategory",
  //       "name": subcategory.name,
  //       "url": `${AYATRIO_BASE_URL}/${subcategory.name.replace(/ /g, '-').replace(/&/g, '-and-')}/subcollection/${category.name.replace(/ /g, '-')}`
  //     }))
  //   }))
  // };

  return (
    <article className="md:px-[52px] sm:ml-[12px] ml-[12px] md:ml-[0px] g">
      {/* Add the schema as a script tag */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      /> */}
      <div>
        <h1 itemProp="name" id="main-heading" className="font-semibold xl:text-2xl text-xl pt-4 pb-2 pr-[100px]">
          Ayatrio: Premium Home Flooring, Rugs & Wallpaper | Window Curtains & Blinds Online
        </h1>
        <p itemProp="description" className="text-[14px]  text-[#484848]">
          We’re the India's premier luxury home furnishing destination with <strong>25+</strong> years expertise. Trusted by<strong> 1.5M+ homes</strong>. <strong>10000+</strong> premium flooring, carpets, rugs, wallpaper, upholstery & fabric, artificial grass & plants, wall panels, Made-to-measure window treatments curtains & blinds options in <strong>1500+</strong> colors and pattern. Live face to face video shoping direct from <strong>30+</strong> ayatrio store.
        </p>
        <div className="mx-auto grid grid-cols-1 items-start sm:pr-[0px] md:pr-[100px] lg:pr-[300px] gap-6 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
          <div className="rounded-xl bg-white p-4 text-left ">
            <Image src="/icons/ayatrio member love it.svg" loading="lazy" alt="1M+ Satisfied Customers with 25+ Years Experience" width={30} height={30} className="mb-3" />
            <h2 className="sm:text-xs md:text-xs lg:text-sm font-medium text-gray-700">1M+ Satisfied Customers with 25+ Years Experience</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-left ">
            <Image src="/icons/45 day trial prioed.svg" loading="lazy" alt="1M+ Satisfied Customers with 25+ Years Experience" width={30} height={30} className="mb-3" />
            <h2 className="sm:text-xs md:text-xs lg:text-sm font-medium text-gray-700">45-Day trial Guarantee with 3 free yearly services</h2>
          </div>

          <div className="rounded-xl bg-white p-4 text-left ">
            <Image src="/icons/planning and consultation.svg" loading="lazy" alt="1M+ Satisfied Customers with 25+ Years Experience" width={30} height={30} className="mb-3" />
            <h2 className="sm:text-xs md:text-xs lg:text-sm font-medium text-gray-700">Expert Design Consultation and Free Home Samples</h2>
          </div>
          <div className="rounded-xl bg-white p-4 text-left ">
            <Image src="/icons/warranty registration.svg" loading="lazy" alt="1M+ Satisfied Customers with 25+ Years Experience" width={30} height={30} className="mb-3" />
            <h2 className="sm:text-xs md:text-xs lg:text-sm font-medium text-gray-700">Authentic Premium Materials, Quality Global Certification</h2>
          </div>
          <div className="rounded-xl bg-white p-4 text-left ">
            <Image src="/icons/instalation.svg" loading="lazy" alt="1M+ Satisfied Customers with 25+ Years Experience" width={30} height={30} className="mb-3" />
            <h2 className="sm:text-xs md:text-xs lg:text-sm font-medium text-gray-700">Professional Installation, EMI Options and Pan-India Delivery</h2>
          </div>
        </div></div>

      <div className="text-[14px] text-[#484848] pt-5">
        <h2 className="text-[14px] font-semibold text-[#000000]">Premium Home Flooring | Waterproof Laminate & Engineered Wood Flooring & Vinyl Flooring</h2>
        <p itemProp="description">Discover an extensive collection of flooring online, catering to every need and aesthetic. Explore durable and stylish options including laminate flooring, known for its versatility and affordability. Our range of SPC flooring (Stone Plastic Composite) offers a perfect blend of style and resilience, with <strong>Click-N-Lock®</strong> SPC flooring providing easy installation and featuring real wood-inspired designs like oak and teak, as well as elegant stone textures such as terracotta and sandstone. We also offer a wide selection of vinyl flooring, known for its <strong>waterproof</strong> and <strong>low-maintenance</strong> properties, and classic wooden flooring, including hardwood flooring, bringing warmth and timeless elegance to any space. Our focus is on providing <strong>durable</strong>, convenient, and stylish flooring solutions for homes and commercial spaces.</p>

        <div className="mx-auto gap-[7px] items-start flex mt-[5px]">

          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              Laminate Flooring
            </a>
          </div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium">
              <p className="text-sm text-gray-700">Vinyl Flloring </p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">SPC flooring</p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Engineering Wood Flooring</p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Deck Flooring</p>

            </a></div>

        </div></div>

      <div itemScope itemType="https://schema.org/Product" className="text-[14px] text-[#484848] pt-5">
        <h2 itemProp="name" className="text-[14px] font-semibold text-[#000000]">Expert Wallpaper for Walls: Transform Your Space with Premium Designs</h2>
        <p itemProp="description">Elevate your home with our premium, <strong>eco-friendly</strong> wallpaper for walls. Explore a vast collection of <strong>customizable, durable designs</strong>—from modern and 3D to Indian and Chinoiserie, and unique murals—perfect for any space including bedrooms, living rooms, and offices. Our <strong>expert guidance</strong> ensures seamless transformation, <strong>creating stylish</strong>, <strong>personality-rich</strong> interiors with <strong>unmatched quality</strong> and <strong>easy maintenance</strong>.</p>

        <div className="mx-auto gap-[7px] items-start flex mt-[5px]">

          <div className="bg-white text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Abstract Wallpaper</p>
            </a>
          </div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium">
              <p className="text-sm text-gray-700">Animal Wallpapers </p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Floral wallpapers </p>

            </a></div>
          <span> | </span>
          <div className="bg-white text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Damask Wallpaper</p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Plain and Textured Wallpaper</p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Tree and Tropical Wallpaper </p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Geometric Wallpaper</p>

            </a></div>

        </div></div>

      <div itemScope itemType="https://schema.org/Product" className="text-[14px]  text-[#484848] pt-3">
        <h2 itemProp="name" className="text-[14px] font-semibold text-[#000000]">Premium Window Curtains Online - Blackout, Thermal Insulated & Linen Sheer Curtains for Bedroom, Living Room</h2>
        <p itemProp="description">Discover our extensive collection of window curtains online. Find functional options like dimout curtains and blackout curtains for optimal light control and privacy, as well as stylish choices such as elegant linen sheer curtains and visually appealing ombre curtains. Our range includes a variety of designs, from classic plain curtains to patterned floral curtains and geometric curtains, catering to diverse aesthetic preferences. Explore our selection of fabrics, including luxurious satin, natural linen and jute, soft velvet, and textured options like herringbone and slub matte fabrics.</p>

        <div className="mx-auto gap-[7px] items-start flex mt-[3px] ">


          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium">
              <p className="text-sm text-gray-700">Animal Curtain </p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left  hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Floral Curtain </p>

            </a></div>

          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Plain and Textured Curtain</p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Tropical Window Curtain </p>

            </a></div>
          <span> | </span>
          <div className="bg-white  text-left hover:text-black ">
            <a href="#" class="flex font-medium ">
              <p className="text-sm text-gray-700">Geometric Curtain</p>

            </a></div>

        </div>

      </div>

      <div itemScope itemType="https://schema.org/Product" className="text-[14px] text-[#484848] pt-3">
        <h2 itemProp="name" className="text-[14px] font-semibold text-[#000000]">Carpet & Rugs</h2>
        <p itemProp="description">Explore a rich assortment of carpets online and rugs online, designed to add comfort, warmth, and style to your floors. Discover luxurious handmade carpets (hand-knotted, hand-tufted, handwoven) crafted from premium materials like wool, silk, viscose, and jute, showcasing exquisite craftsmanship. Our collection includes a variety of styles, from traditional rugs and contemporary carpets to bohemian rugs and regional designs. We also offer practical and stylish options such as carpet tiles for commercial environments and plush wall-to-wall carpets ideal for hotels.</p>
      </div>

      <div itemScope itemType="https://schema.org/Product" className="text-[14px] text-[#484848] pt-3">
        <h2 itemProp="name" className="text-[14px] font-semibold text-[#000000]">Window Blinds</h2>
        <p itemProp="description">Find the perfect window blinds online to control light and enhance privacy in your home or office. Our selection includes a variety of styles to suit different needs and preferences. Explore classic and elegant roman blinds, versatile and easy-to-operate roller blinds, warm and natural wooden blinds, and modern and stylish zebra blinds.</p>
      </div>

      <div itemScope itemType="https://schema.org/Product" className="text-[14px] text-[#484848] pt-3">
        <h2 itemProp="name" className="text-[14px] font-semibold text-[#000000]">Artificial Grass, Artificial Wall, Artificial Plants</h2>
        <p itemProp="description">Enhance your interiors and exteriors with our low-maintenance greenery solutions. Browse our premium-quality artificial grass online, designed to mimic natural grass for both residential and commercial spaces, providing a lush and realistic look with minimal upkeep. Explore our selection of artificial walls, perfect for adding texture and visual interest, and a wide variety of artificial plants and flowers online, bringing the beauty of nature indoors without the need for watering. Consider incorporating nature-inspired decor to create a refreshing and inviting ambiance.</p>
      </div>

      <div className="text-[14px] text-[#484848] pt-3">
        <span className="text-[14px] text-[#000000]"> For the living, dining room & bedroom:</span> Looking for Our comprehensive collection of modern design of Wallpaper, Flooring, Curtain, Blinds, Artificial Grass, Bedding, Mattresses, Pillows, Cushion & Covers, Dinnerware, Kitchenware offers everything you need to refresh a room or completely remodel your home
      </div>

      <div className="text-[14px] text-[#484848] pt-3">
        <h2 className="text-[14px] font-semibold text-[#000000]">Ayatrio Care+:</h2>
        <p>was kickstarted as a loyalty reward programme for all its ayatrio regular family member at zero subscription fee. All you need is your fast purches with above Rs:1000 to be a part of this service. Free delivery, early access during sales and shopping festivals, exchange offers and priority customer service are the top benefits to a Ayatrio Care+ family member. In short, earn more when you shop more!</p>
      </div>

      <div className="text-[14px] text-[#484848] pt-3">
        <span className="text-[14px] text-[#000000]">No Cost EMI:</span> In an attempt to make high-end products accessible to all, our No Cost EMI plan enables you to shop with us under EMI, without shelling out any processing fee. Applicable on select all furnishing & décor items Wallpaper, Flooring, Curtain, Blinds, Artificial Grass, Bedding, Mattresses, Pillows, Cushion & Covers, Dinnerware, Kitchenware and more, chances are it may be up for a no cost EMI. Take a look ASAP! Terms and conditions apply.
      </div>

      <div className="text-[14px] text-[#000000] pt-3">
        Enjoy Online or In-Store Shopping Experience
      </div>
      <div className="text-[14px] text-[#484848] pt-1">
        Since we are an offline and online furnishing & décor store, you can shop with us as per your liking. You could walk into one of our furniture showrooms and handpick items for your home or opt for online furniture shopping to avoid any hassle.
      </div>
      <div className="text-[14px] text-[#484848] pt-3">
        If you want to continue furniture shopping online, you can rely on our easy-to-use website and peruse through our entire catalogue from the comfort of your home. With our clean interface and easily navigable website, furniture shopping online has never been easier.
      </div>
      <div className="text-[14px] text-[#484848] pt-3">
        Regardless of whether you choose to shop for home furnishing & décor items online or offline, we do everything we can to assist you in creating a space you would be dream of future of living.
      </div>

      <p className="w-5/6 font-light text-sm text-[#666] py-4">
        {categories?.map((category) => (
          <span key={category.id}>
            <span className="cursor-pointer hover:underline">
              <Link
                href={`/${category.name.replace(/ /g, "-")}/collection/all`}
              >
                {category.name}
              </Link>
            </span>
            {categories.indexOf(category) !== categories.length - 1 && (
              <span> | </span>
            )}
          </span>
        ))}
      </p>
      <br />
    </article>
  );
};

export default Phone;