function CategorySlideSkeleton() {
  return (
    <article className="card pb-12 h-[700px]" role="region" aria-label="Category Slide Skeleton">
      {/* Image Placeholder */}
      <figure
        className="relative flex h-full w-full items-center justify-center aspect-square bg-[#f1f1f1] animate-pulse"
        role="img"
        aria-label="Loading image placeholder"
      />

      {/* Card Content */}
      <main className="mt-4 h-full">
        <div className="h-4 w-3/4 bg-[#f1f1f1] animate-pulse my-2" />
        <div className="h-4 w-2/4 bg-[#f1f1f1] animate-pulse my-2" />
        <div className="h-4 w-2/5 bg-[#f1f1f1] animate-pulse my-2" />
      </main>
    </article>
  );
}

export default CategorySlideSkeleton;
