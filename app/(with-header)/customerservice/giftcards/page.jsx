import Image from "next/image";
import React from "react";
import { giftCardFaqs } from "@/Model/GiftCardsFaqData/GiftCardsFaqData";

const GiftCards = () => {
  return (

    <div className="mt-20 sm:px-[50px] px-[20px]  space-y-10">
      <div className="space-y-7">
        <h1 className="font-bold text-4xl pt-10">AYATRIO Gift Cards</h1>


        {/* Three options with images section ends */}
        <section className="pt-[10px]">
          <div className="flex flex-col gap-3 lg:flex-row w-full">
            <div className="flex flex-col gap-3 lg:w-1/2">
              <h2 className="font-bold text-2xl">
                Check the balance of your gift or refund card
              </h2>
              <p>
                To check your card balance, first, log in. Then fill in your
                card number and if applicable, a pin code. If your card has an
                expiration date, this will also be shown. Once you use your
                card, the balance on your card will also appear on the
                receipt.
              </p>
              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <button className="md:w-1/2 border-2 border-black rounded-full px-5 py-4 font-bold">
                  Sign Up
                </button>
                <button className="md:w-1/2 border-2 bg-blue-800 rounded-full px-5 py-4 font-bold text-white">
                  Log in
                </button>
              </div>
            </div>
            <div className="lg:mr-8 lg:w-1/2 pl-[150px]">
              <div className=" ">
                <Image
                  width={600}
                  height={300}
                  src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770660156/ayatrio-shoping-card_iozqvg.avif"
                  alt="gift"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        {/* gift card faq section starts */}

        {/* Three options with images section starts */}

        <div className="flex flex-col w-full items-center ">
          <div className="flex flex-col lg:flex-row gap-8 w-full lg:space-x-5 space-y-5 lg:space-y-0 lg:mt-12">
            <div className="flex flex-col lg:w-1/3 border ">
              <div className=" ">
                <Image
                  width={600}
                  height={300}
                  src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770660194/ayatrio_digital_gift_fvpral.avif"
                  alt="gift"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex flex-col gap-4 p-4">
                <h2 className="font-bold text-xl">Digital Gift Card</h2>
                <p className="text-gray-700">
                  You can buy one or more AYATRIO Gift cards with any value up to 10,000 INR through our website, in just a few steps. Your AYATRIO Gift card is emailed straight to your inbox. Bought gift cards can only be redeemed in stores (for now).
                </p>
                <p className="text-gray-700">
                  Share the gift card number and its PIN with any of our checkout co-workers for gift card redemption.
                </p>
                <div>
                  <button className="bg-black text-white rounded-3xl py-2 px-4 text-sm font-semibold">
                    Buy AYATRIO Gift Card online
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:w-1/3 border ">
              <div className="">
                <Image
                  width={600}
                  height={300}
                  src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770660176/ayatrio_product_gift_hcf4k0.avif"
                  alt="gift"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex flex-col gap-4 p-4">
                <h2 className="font-bold text-xl">Physical Gift Card</h2>
                <p className="text-gray-700">
                  You can buy a physical AYATRIO Gift Card with any value up to 10,000 INR at AYATRIO stores (in Hyderabad, Mumbai (Navi Mumbai, Worli, RCity) and Bangalore (Nagasandra).
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:w-1/3  border">
              <div className="">
                <Image
                  width={600}
                  height={338}
                  src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770660221/ayatrio_business_gift_n9bm3b.avif"
                  alt="gift"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex flex-col gap-4 p-4">
                <h2 className="font-bold text-xl text-gray-700">
                  Interested in buying Gift Cards for your business (employee and business contacts)?
                </h2>
                <p className="text-gray-700">
                  Please submit a gift card request by filling out the webform. To access the webform, click the link below, Enter your company details and upload any files if needed.
                </p>
                <p className="text-gray-700">
                  One of our AYATRIO co-workers will reach out to you for further information and processing gift cards.
                </p>
                <div>
                  <button className="bg-black text-white rounded-3xl p-3 px-4 text-xs font-semibold">
                    Buy AYATRIO Gift Card for Business
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <section>
          <div className="flex flex-col gap-5 w-full">
            <h3 className="font-bold text-xl">FAQs</h3>
            {giftCardFaqs.map((curElement) => {
              return (
                <div className="space-y-1 md:w-1/2">
                  <h3 className="font-bold text-lg">{curElement.question}</h3>
                  <p>{curElement.answer}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GiftCards;
