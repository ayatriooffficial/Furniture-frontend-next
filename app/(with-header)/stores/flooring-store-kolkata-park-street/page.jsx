"use client";
import Link from "next/link";
import React from "react";
import { storesInformation } from "@/Model/ContactUsData/StoreInfoData";

const ContactUsPage = () => {
  return (
    <div>
      {/* <div className="mt-20 sm:ml-[50px] ml-[20px] sm:mr-[50px] mr-[20px] p-10 space-y-10"> */}
      <div className="md:px-[55px] px-[20px]">
        {/* Contact us section starts */}
        <section className="mt-32">
          <div className="flex flex-col w-full space-y-10 mb-8">
            <div className="flex flex-col md:w-2/3 gap-4">
              <h1 className="font-bold text-4xl">Contact us</h1>
              <p>
                Whether you’re looking for answers, would like to solve a
                problem, or just want to let us know how we did, you’ll find
                many ways to contact us right here.
              </p>
              <p>
                We’ll help you resolve your issues quickly and easily, getting
                you back to more important things, like relaxing on your new
                sofa.
              </p>
              <p>Take a look at our FAQs for answers to your questions.</p>
            </div>
            <div >
              <Link href={"/customerservice/faq"}>
                <button className="bg-black text-white rounded-3xl p-3 px-4 text-sm font-semibold">
                  See all FAQs
                </button>
              </Link>
            </div>
          </div>
        </section>
        <hr />
        {/* our stores grid section starts */}
        <section className="mt-12 mb-8">
          <div className="flex flex-col w-full space-y-6">
            <div>
              <h2 className="font-bold text-xl">Our Stores</h2>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-10">
              {storesInformation.map((curElement) => {
                return (
                  <div>
                    <h3 className="font-bold">{curElement.storeName}</h3>
                    <p className="mt-1">{curElement.address}</p>
                    <p className="mt-1">{curElement.contactus}</p>
                    <a className="mt-1" href="mailto:customercare@ayatrio.com">{curElement.emailus}</a>
                    {curElement.linkus ? (
      <a 
        className="mt-1 block "
        href={curElement.linkus} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Direction
      </a>
    ) : (
      <p ></p>
    )}
                   </div>
                );
              })}
            </div>
          </div>
        </section>
        <hr />
        {/* Chat with us section starts */}
        <section className="mt-12">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-bold text-xl">Chat with us</h3>
              <p className="mt-1">Available from 8 am- 10 pm</p>
            </div>
            <div>
              <button className="bg-black text-white rounded-3xl p-3 px-4 text-sm font-semibold items-start">
                Start chat
              </button>
            </div>
            <div>
              <h3 className="font-bold text-xl">Call us</h3>
              <p className="mt-1">1800 419 4532</p>
              <p className="mt-1">Available from 8 am to 10 pm</p>
            </div>
            <div>
              <h3 className="font-bold text-xl">Email us</h3>
              <a href="mailto:customercare@ayatrio.com">customercare@ayatrio.com</a>
            </div>
          </div>
        </section>
        {/* Chat with us section ends */}
      </div>
    </div>
  );
};

export default ContactUsPage;
