import Image from "next/image";

export default function Emptycart() {
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center md:justify-between"
      aria-label="Empty shopping bag section"
      data-component="empty-cart"
    >
      <div
        className="order-1 md:order-2 md:ml-8 w-full md:w-1/2 lg:w-1/2"
        aria-label="Empty bag illustration"
        data-component="empty-cart-image"
      >
        <Image
          src="/images/empty_bag.webp"
          className="md:w-[80%] h-full object-cover md:ml-[140px]"
          alt="Illustration of an empty shopping bag"
          width={250}
          height={250}
          loading="lazy"
          role="img"
        />
      </div>
      <div
        className="order-2 md:order-1 text-center md:text-left w-full md:w-1/2 lg:w-1/2"
        aria-label="Empty cart message"
        data-component="empty-cart-message"
      >
        <h1 className="text-3xl md:text-5xl font-semibold mb-4">
          Your shopping bag is empty
        </h1>
        <p className="text-gray-600 mb-6">
          When you add products to your shopping bag, they will appear here.
        </p>
        <a
          className="bg-black text-white inline-block px-6 py-3 md:px-8 md:py-4 rounded-full text-center w-full"
          href="/login"
          aria-label="Log in or sign up to start shopping"
          data-component="empty-cart-cta"
        >
          Log in or sign up
        </a>
      </div>
    </div>
  );
}
