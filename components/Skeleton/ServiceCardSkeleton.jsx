function ServiceCardSkeleton() {
  return (
    <div className=" w-full  flex items-center justify-between gap-2 py-4 sm:px-[20px]  md:px-[52px] mt-[100px] mb-[60px]">
      <div className="h-[255px] w-[420px] bg-[#EFEFEF] hidden lg:block"></div>
      <div className="h-[255px] w-[420px] bg-[#EFEFEF] hidden md:block"></div>
      <div className="h-[255px] w-[420px] bg-[#EFEFEF] hidden md:block"></div>
      <div className="h-[255px] w-[420px] bg-[#EFEFEF]"></div>
    </div>
  );
}

export default ServiceCardSkeleton;
