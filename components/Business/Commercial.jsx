import React from "react";

const Commercial = () => {
  return (
    <div className=" justify-between md:p-12 bg-white animate-slide-in">
      <h1 className="text-black font-bold text-xl sm:text-2xl md:text-3xl text-black py-9">
        Help you run your business smoothly
      </h1>
      <div className="flex">
        <div className="m-2 w-full md:w-[55%]  ">
          <img
            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1770669575/ayatrio_furnishing_for_office_pmesfr.avif"
            alt="Loadin..Furinture"
            className="w-[620px]
            cursor-pointer"
          ></img>
        </div>
        <div className=" w-full md:w-[55%]  text-black w-80 m-10 my-24 gap-20 ">
          <h1 className="text-1xl sm:text-xl text-black font-bold ">
            Commercial Spaces for MSMEs
          </h1>
          <p>
            Since Ayatrio started its corporate design and procurement services in
            2010, we have served more than 100,000 SME customers. We offer
            professional market-leading designs and convenient procurement
            services. From large furniture to fine decorative touches, find
            products and customized solutions for every industry at Ayatrio. We
            support spot deliveries and fast installation to help you seize
            business opportunities.
          </p>
          <p>
            <u className=" text-black font-bold">Become an Ayatrio Business member</u> and
            enjoy exclusive benefits
          </p>
          <a href="#">
            <button className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-10">
              Know More ....
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Commercial;
