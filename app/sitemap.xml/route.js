import {
  fetchAllProducts,
  fetchHeaderCategoryData,
  getCategories,
  getOffers,
} from "@/components/Features/api";
import { BASE_URL } from "@/constants/base-url";

// Optional: remove this line if you don't specifically need edge runtime.
// export const runtime = "edge";  // ⚠️ Optional.

export async function GET() {
  try {
    const urls = await generateSitemapUrls();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(({ url }) => `<url><loc>${url}</loc></url>`).join("")}
    </urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function generateSitemapUrls() {
  const homedecorData = await fetchHeaderCategoryData("homedecor");
  const homedecorPaths = [];
  for (const category of homedecorData) {
    for (const sub of category.subcategories) {
      homedecorPaths.push(
        encodeURI(`/${category.name}/homedecor/${sub.name}`).replace(/&/g, "&amp;")
      );
    }
  }

  const walldecorData = await fetchHeaderCategoryData("walldecor");
  const walldecorPaths = [];
  for (const category of walldecorData) {
    for (const sub of category.subcategories) {
      walldecorPaths.push(
        encodeURI(`/${category.name}/walldecor/${sub.name}`).replace(/&/g, "&amp;")
      );
    }
  }

  const flooringData = await fetchHeaderCategoryData("flooring");
  const flooringPaths = [];
  for (const category of flooringData) {
    for (const sub of category.subcategories) {
      flooringPaths.push(
        encodeURI(`/${category.name}/flooring/${sub.name}`).replace(/&/g, "&amp;")
      );
    }
  }

  const categories = await getCategories();
  const categoryPaths = categories.map((category) =>
    encodeURI(`/${category.name}/category/all`.replace(" ", "-")).replace(/&/g, "&amp;")
  );

  const subcategoryPaths = [];
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategoryPaths.push(
        encodeURI(`/${category.name}/category/${subcategory.name}`.replace(" ", "-"))
          .replace(/&/g, "&amp;")
      );
    });
  });

  const products = await fetchAllProducts(100);
  const productPaths = products.map((product) =>
    encodeURI(`/${product.productTitle}`)
  );

  const offers = await getOffers();
  const offerPaths = offers.map((offer) =>
    encodeURI(`/offers/new/${offer.type}`.replace(" ", "-")).replace(/&/g, "&amp;")
  );

  const paths = [
    "/",
    "/ayatrio-map",
    "/businesstobusiness",
    "/cart",
    "/customerservice",
    "/customerservice/contactus",
    "/customerservice/faq",
    "/customerservice/giftcards",
    "/customerservice/priceguarantee",
    "/customerservice/privacypolicy",
    "/customerservice/returnpolicy",
    "/customerservice/services",
    "/customerservice/shoppinginfo",
    "/customerservice/termsandconditions",
    "/deliveryservice",
    "/designservice",
    "/freedesign",
    "/freesample",
    "/installationservice",
    "/priceguarantee",
    "/profile",
    "/returnpolicy",
    "/about-ayatrio",
    ...homedecorPaths,
    ...walldecorPaths,
    ...flooringPaths,
    ...categoryPaths,
    ...productPaths,
    ...subcategoryPaths,
    ...offerPaths,
  ];

  return paths.map((path) => ({ url: `${BASE_URL}${path}` }));
}
