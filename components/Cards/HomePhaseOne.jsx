import MainSliderWrapper from "../MainSlider/MainSliderWrapper";
import Cookies from "./Cookies";
import Trending from "./Trending";
import CategoriesSlider from "./categorySlider";
function HomePhaseOne() {

  return (
    <main className="w-full h-auto" aria-label="Homepage main content">
      {/* Hero Banner Section */}
      <header>
        <nav aria-label="Main site navigation">
          {/* (Assuming your main nav is inside the layout, not here) */}
        </nav>
        <section aria-label="Featured promotions" data-component="hero-banner">
          <h1 className="sr-only">Welcome to AYATRIO</h1>
          <MainSliderWrapper />
        </section>
      </header>

      {/* Categories Navigation */}
      <section
        aria-label="Product categories"
        data-component="category-navigation"
      >
        <h2 className="sr-only">Browse categories</h2>
        <CategoriesSlider />
      </section>

      {/* Cookie Consent */}
      <aside
        aria-label="Cookie consent notice"
        data-component="cookie-notification"
      >
        <Cookies />
      </aside>

      {/* Trending Products Section */}
      <section aria-label="Trending products" data-component="trending-items">
        <h2 className="sr-only">Trending Products</h2>
        <Trending />
      </section>
    </main>
  );
}

export default HomePhaseOne;
