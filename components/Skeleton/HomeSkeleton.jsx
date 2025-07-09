import { useState } from 'react';

// Define the base URL for Ayatrio at the top
const AYATRIO_BASE_URL = "https://www.ayatrio.com";

const BodySkeletonLoader = () => {
  // State to track image loading for each section
  const [loadedImages, setLoadedImages] = useState({});

  // Handle image load
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      {/* Define animated stride effect */}
      <style>
        {`
          @keyframes stride {
            0% {
              background-position: -400% 0;
            }
            100% {
              background-position: 400% 0;
            }
          }
          .animated-stride {
            background: linear-gradient(
              90deg,
              #e0e0e0 15%,
              #b0b0b0 25%,
              #fafafa 35%,
              #b0b0b0 45%,
              #e0e0e0 55%
            );
            background-size: 400% 100%;
            animation: stride 1.2s infinite linear;
          }
          .image-container {
            position: relative;
            background: #e0e0e0; /* Fallback background */
          }
          .image-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
          }
          .loaded-image {
            transition: opacity 0.1s ease-in;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <main
        aria-label="Homepage loading skeleton"
        data-component="homepage-skeleton"
      >
        {/* Header */}
        <header
          className="h-[95px] w-full sm:px-[20px] md:px-[52px]"
          aria-label="Top navigation skeleton"
          data-component="header-skeleton"
        />

        {/* Main promotional slider skeleton */}
        <section
          className="h-[70vh] w-full sm:px-[20px] md:px-[52px] image-container"
          aria-label="Main slider loading"
          data-component="main-slider-skeleton"
        >
          <img
            src="https://picsum.photos/1200/600"
            alt="Main promotional image"
            className="loaded-image"
            style={{ opacity: loadedImages['main-slider'] ? 1 : 0 }}
            onLoad={() => handleImageLoad('main-slider')}
          />
          {!loadedImages['main-slider'] && (
            <div className="image-placeholder animated-stride" />
          )}
        </section>

        {/* Category slider skeleton */}
        <nav
          className="h-[160px] w-full flex items-center justify-between gap-2 px-[10px] sm:px-[20px] md:px-[52px]"
          aria-label="Category navigation loading"
          data-component="category-slider-skeleton"
        >
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="h-[70%] w-[100px] image-container"
              aria-hidden="true"
            >
              <img
                src={`https://picsum.photos/100/70?random=${idx}`}
                alt={`Category ${idx + 1}`}
                className="loaded-image"
                style={{ opacity: loadedImages[`category-${idx}`] ? 1 : 0 }}
                onLoad={() => handleImageLoad(`category-${idx}`)}
              />
              {!loadedImages[`category-${idx}`] && (
                <div className="image-placeholder animated-stride" />
              )}
            </div>
          ))}
        </nav>

        {/* Product slider skeleton */}
        <section
          className="grid gap-4 sm:px-[20px] px-[10px] md:px-[52px] mb-[60px] grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-[30px]"
          aria-label="Product slider loading"
          data-component="product-slider-skeleton"
        >
          {[...Array(4)].map((_, idx) => (
            <article
              key={idx}
              className="card w-full h-full pb-12"
              aria-label={`Product card skeleton ${idx + 1}`}
            >
              <div className="image-container w-full h-[300px]">
                <img
                  src={`https://picsum.photos/300/300?random=${idx}`}
                  alt={`Product ${idx + 1}`}
                  className="loaded-image"
                  style={{ opacity: loadedImages[`product-${idx}`] ? 1 : 0 }}
                  onLoad={() => handleImageLoad(`product-${idx}`)}
                />
                {!loadedImages[`product-${idx}`] && (
                  <div className="image-placeholder animated-stride" />
                )}
              </div>
              <div className="pt-4">
                <div className="w-3/4 h-4 bg-[#e0e0e0] mb-2" />
                <div className="w-1/2 h-4 bg-[#e0e0e0]" />
              </div>
            </article>
          ))}
        </section>

        {/* 5-grid section skeleton */}
        <section
          className="flex justify-between mx-auto px-3 mt-[100px] mb-[120px] sm:px-[20px] md:px-[52px]"
          aria-label="Featured grid loading"
          data-component="five-grid-skeleton"
        >
          <div className="w-full flex justify-center screens">
            <div className="w-full h-[1000px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
              {[...Array(5)].map((_, idx) => (
                <article
                  key={idx}
                  className="parent image-container w-full h-full"
                  aria-label={`Grid card skeleton ${idx + 1}`}
                >
                  <img
                    src={`https://picsum.photos/400/400?random=${idx}`}
                    alt={`Grid item ${idx + 1}`}
                    className="loaded-image"
                    style={{ opacity: loadedImages[`grid-${idx}`] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(`grid-${idx}`)}
                  />
                  {!loadedImages[`grid-${idx}`] && (
                    <div className="image-placeholder animated-stride" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Additional sliders skeleton (3 sections) */}
        {[1, 2, 3].map((sectionIdx) => (
          <section
            key={sectionIdx}
            className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]"
            aria-label={`Additional slider loading ${sectionIdx}`}
            data-component={`additional-slider-skeleton-${sectionIdx}`}
          >
            <header className="w-1/4 h-6 bg-[#e0e0e0] mb-[30px]" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[...Array(4)].map((_, idx) => (
                <article
                  key={idx}
                  className="card w-full h-full pb-12"
                  aria-label={`Additional product card skeleton ${idx + 1}`}
                >
                  <div className="image-container w-full h-[300px]">
                    <img
                      src={`https://picsum.photos/300/300?random=${sectionIdx * 4 + idx}`}
                      alt={`Additional product ${idx + 1}`}
                      className="loaded-image"
                      style={{ opacity: loadedImages[`additional-${sectionIdx}-${idx}`] ? 1 : 0 }}
                      onLoad={() => handleImageLoad(`additional-${sectionIdx}-${idx}`)}
                    />
                    {!loadedImages[`additional-${sectionIdx}-${idx}`] && (
                      <div className="image-placeholder animated-stride" />
                    )}
                  </div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#e0e0e0] mb-2" />
                    <div className="w-1/2 h-4 bg-[#e0e0e0]" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* 2-grid section skeleton */}
        <section
          className="flex justify-between mx-auto px-3 sm:px-5 md:px-13 mt-[100px] mb-[120px] sm:px-[20px] md:px-[52px]"
          aria-label="Two grid loading"
          data-component="two-grid-skeleton"
        >
          <div className="w-full flex justify-center screens">
            <div className="w-full h-[1000px] md:h-[420px] grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-4 auto-rows-fr">
              {[...Array(2)].map((_, idx) => (
                <article
                  key={idx}
                  className="parent image-container w-full h-full"
                  aria-label={`Two grid card skeleton ${idx + 1}`}
                >
                  <img
                    src={`https://picsum.photos/600/400?random=${idx}`}
                    alt={`Two grid item ${idx + 1}`}
                    className="loaded-image"
                    style={{ opacity: loadedImages[`two-grid-${idx}`] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(`two-grid-${idx}`)}
                  />
                  {!loadedImages[`two-grid-${idx}`] && (
                    <div className="image-placeholder animated-stride" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* More sliders skeleton (2 sections) */}
        {[4, 5].map((sectionIdx) => (
          <section
            key={sectionIdx}
            className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]"
            aria-label={`More slider loading ${sectionIdx - 3}`}
            data-component={`more-slider-skeleton-${sectionIdx - 3}`}
          >
            <header className="w-1/4 h-6 bg-[#e0e0e0] mb-[30px]" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[...Array(4)].map((_, idx) => (
                <article
                  key={idx}
                  className="card w-full h-full pb-12"
                  aria-label={`More product card skeleton ${idx + 1}`}
                >
                  <div className="image-container w-full h-[300px]">
                    <img
                      src={`https://picsum.photos/300/300?random=${sectionIdx * 4 + idx}`}
                      alt={`More product ${idx + 1}`}
                      className="loaded-image"
                      style={{ opacity: loadedImages[`more-${sectionIdx}-${idx}`] ? 1 : 0 }}
                      onLoad={() => handleImageLoad(`more-${sectionIdx}-${idx}`)}
                    />
                    {!loadedImages[`more-${sectionIdx}-${idx}`] && (
                      <div className="image-placeholder animated-stride" />
                    )}
                  </div>
                  <div className="pt-4">
                    <div className="w-3/4 h-4 bg-[#e0e0e0] mb-2" />
                    <div className="w-1/2 h-4 bg-[#e0e0e0]" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Final slider skeleton */}
        <section
          className="mb-[60px] sm:px-[20px] px-[10px] md:px-[52px]"
          aria-label="Final slider loading"
          data-component="final-slider-skeleton"
        >
          <header className="w-1/4 h-6 bg-[#e0e0e0] mb-[30px]" />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <article
                key={idx}
                className="card w-full h-full pb-12"
                aria-label={`Final product card skeleton ${idx + 1}`}
              >
                <div className="image-container w-full h-[300px]">
                  <img
                    src={`https://picsum.photos/300/300?random=${idx + 20}`}
                    alt={`Final product ${idx + 1}`}
                    className="loaded-image"
                    style={{ opacity: loadedImages[`final-${idx}`] ? 1 : 0 }}
                    onLoad={() => handleImageLoad(`final-${idx}`)}
                  />
                  {!loadedImages[`final-${idx}`] && (
                    <div className="image-placeholder animated-stride" />
                  )}
                </div>
                <div className="pt-4">
                  <div className="w-3/4 h-4 bg-[#e0e0e0] mb-2" />
                  <div className="w-1/2 h-4 bg-[#e0e0e0]" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Discover how convenient shopping Ayatrio can be! */}
        <section
          className="w-full flex items-center justify-between gap-2 py-4 sm:px-[20px] md:px-[52px] mt-[100px] mb-[60px]"
          aria-label="Convenience section loading"
          data-component="convenience-skeleton"
        >
          {[...Array(4)].map((_, idx) => (
            <aside
              key={idx}
              className="h-[255px] w-[420px] image-container"
              aria-label={`Convenience card skeleton ${idx + 1}`}
            >
              <img
                src={`https://picsum.photos/420/255?random=${idx}`}
                alt={`Convenience ${idx + 1}`}
                className="loaded-image"
                style={{ opacity: loadedImages[`convenience-${idx}`] ? 1 : 0 }}
                onLoad={() => handleImageLoad(`convenience-${idx}`)}
              />
              {!loadedImages[`convenience-${idx}`] && (
                <div className="image-placeholder animated-stride" />
              )}
            </aside>
          ))}
        </section>

        {/* Inspiration for every room */}
        <section
          className="w-full flex items-center justify-start gap-2 py-4 sm:px-[20px] md:px-[52px] my-[60px]"
          aria-label="Room inspiration loading"
          data-component="room-inspiration-skeleton"
        >
          {[...Array(2)].map((_, idx) => (
            <article
              key={idx}
              className="h-[580px] w-[290px] image-container"
              aria-label={`Inspiration card skeleton ${idx + 1}`}
            >
              <img
                src={`https://picsum.photos/290/580?random=${idx}`}
                alt={`Inspiration ${idx + 1}`}
                className="loaded-image"
                style={{ opacity: loadedImages[`inspiration-${idx}`] ? 1 : 0 }}
                onLoad={() => handleImageLoad(`inspiration-${idx}`)}
              />
              {!loadedImages[`inspiration-${idx}`] && (
                <div className="image-placeholder animated-stride" />
              )}
            </article>
          ))}
        </section>

        {/* Inspiration and suggestion */}
        <section
          className="w-full flex items-center justify-between gap-2 py-4 sm:px-[20px] md:px-[52px] mb-[60px] mt-[450px]"
          aria-label="Suggestion section loading"
          data-component="suggestion-skeleton"
        >
          <article
            className="h-[580px] w-[290px] image-container"
            aria-label="Suggestion card skeleton"
          >
            <img
              src="https://picsum.photos/290/580?random=10"
              alt="Suggestion"
              className="loaded-image"
              style={{ opacity: loadedImages['suggestion'] ? 1 : 0 }}
              onLoad={() => handleImageLoad('suggestion')}
            />
            {!loadedImages['suggestion'] && (
              <div className="image-placeholder animated-stride" />
            )}
          </article>
        </section>

        {/* Services and financial help on shopping */}
        <section
          className="w-full flex items-center justify-between gap-2 py-4 sm:px-[20px] md:px-[52px] mt-[100px] mb-[60px]"
          aria-label="Services section loading"
          data-component="services-skeleton"
        >
          {[...Array(5)].map((_, idx) => (
            <aside
              key={idx}
              className="h-[255px] w-[420px] image-container"
              aria-label={`Service card skeleton ${idx + 1}`}
            >
              <img
                src={`https://picsum.photos/420/255?random=${idx + 5}`}
                alt={`Service ${idx + 1}`}
                className="loaded-image"
                style={{ opacity: loadedImages[`service-${idx}`] ? 1 : 0 }}
                onLoad={() => handleImageLoad(`service-${idx}`)}
              />
              {!loadedImages[`service-${idx}`] && (
                <div className="image-placeholder animated-stride" />
              )}
            </aside>
          ))}
        </section>

        {/* Design inspiration and modern ideas */}
        <section
          className="sm:px-[20px] px-[10px] md:px-[52px] pb-20 pt-10 h-full"
          aria-label="Design inspiration loading"
          data-component="design-inspiration-skeleton"
        >
          <div className="grid grid-cols-3 gap-[17px] auto-rows-[1fr]">
            {[...Array(6)].map((_, idx) => (
              <article
                key={idx}
                className={`w-full ${
                  idx % 2 === 0 ? "h-[871px]" : "h-[429px]"
                } image-container`}
                aria-label={`Design inspiration card skeleton ${idx + 1}`}
              >
                <img
                  src={`https://picsum.photos/400/${idx % 2 === 0 ? 871 : 429}?random=${idx}`}
                  alt={`Design inspiration ${idx + 1}`}
                  className="loaded-image"
                  style={{ opacity: loadedImages[`design-${idx}`] ? 1 : 0 }}
                  onLoad={() => handleImageLoad(`design-${idx}`)}
                />
                {!loadedImages[`design-${idx}`] && (
                  <div className="image-placeholder animated-stride" />
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default BodySkeletonLoader;