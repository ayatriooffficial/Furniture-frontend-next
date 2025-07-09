"use client";
import Image from "next/image";
import Link from "next/link";

const CategoryGrid = ({ grid }) => {
  const GridContent = () => (
    <>
      {grid.image && (
        <figure className="relative z[-999999] w-fit" aria-hidden="true">
          <div className="relative flex h-full w-full items-center justify-center aspect-square">
            <Image
              src={grid.image}
              height={300}
              width={300}
              className="aspect-square w-[400px]"
              alt={grid.title || "Category image"}
            />
          </div>
        </figure>
      )}
      <div className="p-8">
        {grid.title && (
          <h3 className="text-sm text-[#757575]" id="category-title">
            {grid.title}
          </h3>
        )}
        {grid.description && (
          <p className="text-bold">{grid.description}</p>
        )}
      </div>
    </>
  );

  return (
    <article className="category-grid-item" aria-labelledby="category-title">
      {grid.link ? (
        <Link
          href={grid.link}
          className={`flex flex-col ${!grid.image && "justify-center "} border-b border-r sm:border-none bg-[#f5f5f5]`}
          aria-label={grid.title || "Category item"}
        >
          <GridContent />
        </Link>
      ) : (
        <div
          className={`flex flex-col ${!grid.image && "justify-center "} border-b border-r sm:border-none bg-[#f5f5f5]`}
          aria-labelledby="category-title"
        >
          <GridContent />
        </div>
      )}
    </article>
  );
};

export default CategoryGrid;
