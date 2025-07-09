"use client";
function CategorySliderSkeleton() {
  return (
    <section className="h-[160px] w-full flex items-center justify-between gap-2 px-[10px] sm:px-[20px] md:px-[52px]">
      {Array.from({ length: 9 }).map((_, index) => (
        <article
          key={index}
          className={`h-[100px] w-[100px] bg-[#f1f1f1] ${
            index < 3 ? "md:block hidden" :
            index < 6 ? "sm:block hidden" : ""
          }`}
        />
      ))}
    </section>
  );  
}

export default CategorySliderSkeleton;
