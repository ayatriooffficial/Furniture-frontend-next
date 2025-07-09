function ProductPageSkeleton() {
    return (
        <BodySkeletonLoader />
    )
}

export default ProductPageSkeleton


const BodySkeletonLoader = () => {
  return (
    <>
      <main className="relative" aria-busy="true" aria-label="Content loading">
        <section className="product-intro">
          {/* header/title */}
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-6 bg-[#f1f1f1] animate-pulse w-[30%] mt-4"></div>
          
          {/* description */}
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-24 bg-[#f1f1f1] animate-pulse w-[70%] mt-5"></div>
          
          {/* main image */}
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-[550px] bg-[#f1f1f1] animate-pulse mt-20 mb-[100px]" 
               role="img" aria-label="Product image loading"></div>
        </section>

        <section className="product-slider" aria-label="Product carousel loading">
          <div className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]">
            <div className="w-1/4 h-6 bg-[#f1f1f1] mb-[30px] px-[10px] sm:px-[20px] md:px-[52px]"></div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4" role="list">
              {[...Array(4)].map((_, index) => (
                <article key={`slider-item-1-${index}`} className="card w-full h-full pb-12" role="listitem">
                  <div className="relative w-full h-[300px] bg-[#f1f1f1]"></div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#f1f1f1] mb-2"></div>
                    <div className="w-1/2 h-4 bg-[#f1f1f1]"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-content" aria-label="Featured content loading">
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-6 bg-[#f5f5f5] animate-pulse w-[30%] mt-[100px]"></div>
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-12 bg-[#f5f5f5] animate-pulse w-[70%] mt-5 mb-5"></div>
          
          <div className="flex justify-between mx-auto px-3 md:px-13 mb-[120px] sm:px-[20px] md:px-[52px]">
            <div className="w-full flex justify-center screens">
              <div className="w-full h-[1000px] md:h-[420px] grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-4 auto-rows-fr" role="list">
                <article className="parent col-start-1 col-end-2 row-start-1 lg:mb-0 row-end-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-12" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
                
                <article className="parent col-start-1 col-end-2 row-start-3 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-12" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="related-products" aria-label="Related products loading">
          <div className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]">
            <div className="w-1/4 h-6 bg-[#f1f1f1] mb-[30px] px-[10px] sm:px-[20px] md:px-[52px]"></div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4" role="list">
              {[...Array(4)].map((_, index) => (
                <article key={`slider-item-2-${index}`} className="card w-full h-full pb-12" role="listitem">
                  <div className="relative w-full h-[300px] bg-[#f1f1f1]"></div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#f1f1f1] mb-2"></div>
                    <div className="w-1/2 h-4 bg-[#f1f1f1]"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="complementary-products" aria-label="Complementary products loading">
          <div className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]">
            <div className="w-1/4 h-6 bg-[#f1f1f1] mb-[30px] px-[10px] sm:px-[20px] md:px-[52px]"></div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4" role="list">
              {[...Array(4)].map((_, index) => (
                <article key={`slider-item-3-${index}`} className="card w-full h-full pb-12" role="listitem">
                  <div className="relative w-full h-[300px] bg-[#f1f1f1]"></div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#f1f1f1] mb-2"></div>
                    <div className="w-1/2 h-4 bg-[#f1f1f1]"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-grid" aria-label="Gallery grid loading">
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-6 bg-[#f1f1f1] animate-pulse w-[30%] mt-[100px]"></div>
          <div className="sm:mx-[20px] mx-[10px] md:mx-[52px] h-12 bg-[#f1f1f1] animate-pulse w-[70%] mt-5 mb-5"></div>
          
          <div className="flex justify-between mx-auto px-3 mb-[120px] sm:px-[20px] md:px-[52px]">
            <div className="w-full flex justify-center screens">
              <div className="w-full h-[1000px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr" role="list">
                <article className="parent col-start-1 col-end-3 row-start-1 lg:mb-0 row-end-6 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
              
                <article className="parent col-start-1 col-end-2 row-start-6 row-span-2 lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
                
                <article className="parent col-start-2 col-end-3 row-start-6 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
                
                <article className="parent col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
                
                <article className="parent col-start-2 col-end-3 row-start-9 row-span-2 lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12" role="listitem">
                  <div className="parent relative w-full h-full bg-[#f5f5f5]"></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <aside className="suggestions" aria-label="Product suggestions loading">
          <div className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]">
            <div className="w-1/4 h-6 bg-[#f1f1f1] mb-[30px] px-[10px] sm:px-[20px] md:px-[52px]"></div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4" role="list">
              {[...Array(4)].map((_, index) => (
                <article key={`slider-item-4-${index}`} className="card w-full h-full pb-12" role="listitem">
                  <div className="relative w-full h-[300px] bg-[#f1f1f1]"></div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#f1f1f1] mb-2"></div>
                    <div className="w-1/2 h-4 bg-[#f1f1f1]"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer className="mt-20" aria-label="Footer skeleton">
        <div className="h-48 bg-[#f1f1f1] animate-pulse w-full"></div>
      </footer>
    </>
  );
};