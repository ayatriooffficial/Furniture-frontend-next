"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const faqsDataJson = {
    "installation": [
        {
            "title": "How can I contact the ayatrio installation experts and how can I submit a floor/wallpaper/curtain/blinds design for review?",
            "content": "This question explains the process of contacting Ayatrio's installation experts and submitting a floor/wallpaper/curtain/blinds design for review. It includes a link to a web form where users can submit their designs for review over the phone."
        },
        {
            "title": "Can I use the Ayatrio Shoppable App to book services such as Assembly?",
            "content": "This question addresses whether the Ayatrio Shoppable App allows users to book services like assembly. The answer states that such services are not currently available within the app."
        },
        {
            "title": "How much does it cost to have an Ayatrio floor/wallpaper/curtain/blinds installation professionally installed?",
            "content": "This question provides information on the typical cost of professional installation for Ayatrio floor/wallpaper/curtain/blinds. It states that installation costs are typically around 50% of the purchased floor/wallpaper/curtain/blinds price but may vary depending on the project."
        },
        {
            "title": "Is there a follow up after the floor/wallpaper/curtain/blinds installation is complete?",
            "content": "This question discusses whether there is follow-up after the completion of floor/wallpaper/curtain/blinds installation. The answer confirms that Ayatrio follows up with customers to ensure satisfaction and offers ongoing support."
        },
        {
            "title": "Why are our appliances delivered without a power cord?",
            "content": "This question explains why Ayatrio appliances are delivered without a power cord, stating that skilled professionals will install the appropriate cords based on customers' homes."
        },
        {
            "title": "How come I can’t get the drawer fronts to align? The top drawer is in the way of the lower ones, and can't be closed properly.",
            "content": "This question addresses alignment issues with drawer fronts and suggests that improper assembly of the lowest drawer may be the cause."
        },
        {
            "title": "What are filler pieces?",
            "content": "This question defines filler pieces as elements used to fill the space between cabinets and walls to ensure proper installation."
        },
        {
            "title": "Can I adjust the hinges?",
            "content": "This question confirms that Ayatrio hinges are adjustable and explains their functionality."
        },
        {
            "title": "How much ventilation space is needed above the fridge/freezer?",
            "content": "This question provides guidance on the ventilation space needed above the fridge/freezer."
        },
        {
            "title": "How do I secure my island cabinets to the floor?",
            "content": "This question discusses securing island cabinets to the floor and suggests using specific support brackets while advising consultation with a professional."
        }
    ],
}

const Faq = ({ faqFor }) => {
    let faqsData = faqsDataJson[`${faqFor}`];
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <div className="lg:col-span-2">

                <div>
                    {faqsData.map((faq, index) => (
                        <div key={index} className="mb-4">
                            <hr className="my-4 border-gray-300" />
                            <button
                                className="flex items-center justify-between w-full px-4 py-2 text-left focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="font-semibold">{faq.title}</span>
                                <Image loading="lazy"
                                    src={`/icons/${index === activeIndex ? 'uparrow.svg' : 'downarrow.svg'}`}
                                    width={300}
                                    height={300}
                                    alt={index === activeIndex ? 'Collapse' : 'Expand'}
                                    className="w-4 h-4 transition-transform transform"
                                />
                            </button>
                            <div className={`mt-2 px-4  transition-all duration-100 ${index === activeIndex ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                <p>{faq.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CabinetItem = ({ imageSrc, title, price, description }) => {
    return (
        <div className="pub-layout-50-50 flex flex-wrap">
            <div className="">
                <div className="b">
                    <Image loading="lazy"
                        width={600}
                        height={300}
                        src={imageSrc}
                        alt="Cabinet image"
                        className='h-[300px] w-[700px] object-cover overflow-hidden'
                    />
                </div>
            </div>
            <div className="w-full p-4 pt-0">
                <div className="">
                    <h3 className=" font-semibold text-2xl pb-[20px] lg:pt-[30px]">{title}</h3>
                    <ul className="list-disc pl-4">
                        {description.map((item, index) => (
                            <li key={index} className="mb-2">{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default function Installation() {
    return (
        <div className=' mx-auto px-[20px] sm:px-[50px] lg-px[27px] '>
            <section className="w-full mb-12 pt-40 ">
                <div className="flex flex-wrap md:flex-nowrap gap-12 justify-between w-full ">
                    <div className="w-full md:w-3/5 flex flex-col justify-center ">
                        <h2 className="Blinds font-semibold text-2xl pb-[20px] lg:pt-[30px] text-black ">
                            Floor Installation Near You
                        </h2>
                        <p className="text-justify  opacity-90 mb-3">
                            <strong>Why Choose AYATRIO for Your Flooring Installation Service?</strong><br></br>
                            When it comes to installation, you deserve reliability and expertise. Our team at Ayatrio Furnishing is here to support you every step of the way throughout your project. Choosing Ayatrio means partnering with professional, background-checked, and insured contractors who share your vision. Our experts are skilled in a variety of installation projects, and are here to ensure that your flooring journey is smooth and successful.
                        </p>
                        <div className="h-10">
                            <button className="bg-black mt-[15px] py-3 sm:px-7 px-3 rounded-full text-white">Schudle your installation</button>
                        </div>

                    </div>
                    <div className="w-full md:w-3/5 flex items-center justify-center">
                        <Image loading="lazy"
                            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1769540217/ayatrio_installation_hjt5xy.avif"
                            width={600}
                            height={350}
                            alt="Financial service"
                            className="object-cover  w-[100%] h-[350px]"
                        />
                    </div>
                </div>


                <div className="md:w-2/3 mt-12">
                    <p className="text-justify  opacity-80 mb-3">
                        Ayatrio floor installation service includes surfacing and installation of flooring from vinyl plank to cover laminate or spc flooring. You choose what you need. Pricing is based on surface type. Of course, you can always DIY for free, with help from our guides.
                    </p>

                    <ol className="px-10 opacity-80 list-disc">
                        <li className="mb-3">Installers are insured and covered warranty. Ask a planning specialist for more details.</li>
                        <li className="mb-3">Carried out to the highest industry standards.</li>
                        <li className="mb-3">Covered by a 5-year workmanship guarantee.</li>
                        <li className="mb-3">Flooring installation starts from Rs:10 to Rs:12/sqft.</li>
                        <li className="mb-3">After planning, you get an itemized installation price quote.</li>
                    </ol>

                </div>
                <hr className="mt-20" />
            </section>

            <section className="w-full mb-12 ">
                <div className="flex flex-wrap md:flex-nowrap gap-12 justify-between w-full ">
                    <div className="w-full md:w-3/5 flex flex-col justify-center ">
                        <h2 className="Blinds font-semibold text-2xl pb-[20px] lg:pt-[30px] text-black ">
                            Wallpaper Installation Near You
                        </h2>
                        <p className="text-justify  opacity-90 mb-3">
                            <strong>Why Choose AYATRIO for Your wallpaper Installation Service?</strong><br></br>
                            Wallpapers are a beautiful way to spruce up your home, and they blend in with any type of design style or ambience that you’ve decided on for your home. With the perfect choice of wallpaper, you can create a perfectly balanced home. This is where the ayatrio wallpaper installer services step in; with their help, you will be able to choose the perfect wallpaper for your home, the right way to apply the wallpaper, and even the tricks and tips to maintain it.
                        </p>
                        <div className="h-10">
                            <button className="bg-black mt-[15px] py-3 sm:px-7 px-3 rounded-full text-white">Schudle your installation</button>
                        </div>

                    </div>
                    <div className="w-full md:w-3/5 flex items-center justify-center">
                        <Image loading="lazy"
                            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1769545184/wallpaper_installation_xkgkne.avif"
                            width={600}
                            height={350}
                            alt="Financial service"
                            className="object-cover  w-[100%] h-[350px]"
                        />
                    </div>
                </div>


                <div className="md:w-2/3 mt-12">
                    <p className="text-justify  opacity-80 mb-3">
                        Ayatrio Professional wallpaper installation costs range from Rs:₹6–₹15 sqft.
                    </p>

                    <ol className="px-10 opacity-80 list-disc">
                        <li className="mb-3">Installers are insured and covered warranty. Ask a planning specialist for more details.</li>
                        <li className="mb-3">Carried out to the highest industry standards.</li>
                        <li className="mb-3">Covered by a 5-year workmanship guarantee.</li>
                        <li className="mb-3">After wallpaper planning, you get an itemized installation price quote.</li>
                    </ol>

                </div>
            </section>

            <section className="w-full mb-12 ">
                <div className="flex flex-wrap md:flex-nowrap gap-12 justify-between w-full ">
                    <div className="w-full md:w-3/5 flex flex-col justify-center ">
                        <h2 className="Blinds font-semibold text-2xl pb-[20px] lg:pt-[30px] text-black ">
                            Curtain Installation Near You
                        </h2>
                        <p className="text-justify  opacity-90 mb-3">
                            <strong>Why Choose AYATRIO for Your Curtain Installation Service?</strong><br></br>
                            Take the hassle out of curtain and blind selection with our personalised curtain measurement service and in-home consultation. Our experts visit your home to take precise measurements, showcase our extensive fabric (Cotton & Linens) collection, and provide design recommendations tailored to your interiors.
                        </p>
                        <div className="h-10">
                            <button className="bg-black mt-[15px] py-3 sm:px-7 px-3 rounded-full text-white">Schudle your installation</button>
                        </div>

                    </div>
                    <div className="w-full md:w-3/5 flex items-center justify-center">
                        <Image loading="lazy"
                            src="https://res.cloudinary.com/dcvabpy6e/image/upload/v1769546248/ayatrio_curtain_installation_uxs39x.avif"
                            width={600}
                            height={350}
                            alt="Financial service"
                            className="object-cover  w-[100%] h-[350px]"
                        />
                    </div>
                </div>


                <div className="md:w-2/3 mt-12">
                    <p className="text-justify  opacity-80 mb-3">
                        Ayatrio Professional wallpaper installation costs range from Rs:₹10–₹25 sqft.
                    </p>

                    <ol className="px-10 opacity-80 list-disc">
                        <li className="mb-3">Installers are insured and covered warranty. Ask a planning specialist for more details.</li>
                        <li className="mb-3">Carried out to the highest industry standards.</li>
                        <li className="mb-3">Covered by a 5-year workmanship guarantee.</li>
                        <li className="mb-3">After wallpaper planning, you get an itemized installation price quote.</li>
                    </ol>

                </div>
            </section>



            <section id='works'>
                <div className="md:w-2/3 mt-6">
                    <h2 className="text-black text-2xl font-semibold mb-12">
                        How Ayatrio installation service works
                    </h2>
                    <h4 className='text-black text-lg font-bold my-6'>Before and after Ayatrio  installation</h4>
                    <ol className="px-10 opacity-80 list-decimal">
                        <li className="mb-3">Measure, plan and buy your Ayatrio products. If you haven’t done this already, we can help! Start things off right with correct specifications from our kitchen measuring service. Then, let us design your new kitchen with our kitchen planning service.</li>
                        <li className="mb-3">Book an installation appointment. Our Ayatrio product service team can install your new product.</li>
                        <li className="mb-3">Join the service provider for a site inspection. During this visit, the service provider checks the design vs. the floor plan and confirms measurements. We also will make sure electricity, plumbing, and HVAC have been done to fit the new surface layout.</li>
                        <li className="mb-3">Get your Ayatrio products home. Delivery is not included in Ayatrio installation service.</li>
                        <li className="mb-3">Prepare your space. Clean everything out and take care of any work like patching, wall painting, redoing floors, etc. Set up a temporary kitchen. Place all packages in the room where the ayatrio product will be installed.</li>
                    </ol>
                </div>
                <ul className="flex gap-x-1 mt-3 px-3 flex-wrap md:w-2/3">
                    <li>
                        <a href="#pricing" className="underline opacity-90 hover:opacity-100"> Pricing information  </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#booking" className="underline opacity-90 hover:opacity-100"> How to book a installation service </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#works" className="underline opacity-90 hover:opacity-100"> How it works </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#DIY" className="underline opacity-90 hover:opacity-100">  Do-it-yourself guides </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#warranty" className="underline opacity-90 hover:opacity-100">  Warranty </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#" className="underline opacity-90 hover:opacity-100">  Become an Ayatrio flooring subcontractor </a>
                    </li>
                    <li className="opacity-50"> | </li>
                    <li>
                        <a href="#faq" className="underline opacity-90 hover:opacity-100">FAQ</a>
                    </li>
                </ul>
                <hr className="mt-20" />
            </section>

            <section id="faq" className='mt-8'>
                <h2 className="text-black text-2xl font-semibold mb-12">
                    Frequently asked questions
                </h2>
                <Faq faqFor='installation' />
            </section>

        </div>
    )
}