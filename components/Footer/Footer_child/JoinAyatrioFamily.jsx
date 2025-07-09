import Image from "next/image";
const JoinAyatrioFamily = () => {
  return (
    <div className="space-y-4 ">
      <p className="sm:text-base text-xl text-[#000000]">Join Ayatrio Family</p>
      <div>
        <Image width={200} height={40} src="/images/ayatriologo.webp" alt="Ayatrio Logo" priority />
      </div>
      <p className="text-[14px] text-[#484848]">
          Enjoy member-only discounts & offers, early access to Ayatrio sale,
          delicious gift offers and much more. Join for free.
        </p>
      <button className="bg-black py-3 sm:px-7 px-3 rounded-full text-white">
        Join the club
      </button>
    </div>
  );
};

export default JoinAyatrioFamily;
