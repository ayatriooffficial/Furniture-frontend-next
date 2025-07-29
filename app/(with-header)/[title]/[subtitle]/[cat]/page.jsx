import axios from "axios";
import { BreadcrumbJsonLd, WebPageJsonLd } from "next-seo";

import { getOffer } from "@/actions/getOffer";
import ProductPage from "@/app/(with-header)/[title]/[subtitle]/Meta";
import {
  createApiEndpoint,
  getCategoryByName,
} from "@/components/Features/api";
//import FreeSampleSchema from "@/components/JsonLd/FreeSampleSchema";
//import InstallationServiceSchema from "@/components/JsonLd/InstallationServiceSchema";
import { BASE_URL } from "@/constants/base-url";

export async function generateMetadata({ params }) {
  const { title, cat, subtitle } = params;
  const isCategoryPage = title !== "offers" && cat === "all";
  const isOfferPage = title === "offers";

  const isSubcategoryPage =
    !isCategoryPage && !isOfferPage && subtitle === "subcollection";

  const categoryName = isSubcategoryPage
    ? cat.replace(/-/g, " ")
    : title.replace(/-/g, " ");

  const subCategory = title.replace(/-/g, " ");

  const category = await getCategoryByName(categoryName);

  const subcategories = category?.subcategories;

  if (isCategoryPage) {
    return {
      title: category?.metadata?.title || category?.name || title,
      description: category?.description || "",
      openGraph: {
        title: category?.metadata?.title || category?.name || title,
        description: category?.description || "",
        images: [
          {
            url: category?.image,
            alt: category?.name || title,
          },
        ],
      },
      alternates: {
        canonical: `${BASE_URL}/${title}/${subtitle}/${cat}`,
      },
    };
  }

  if (isOfferPage) {
    const offerType = cat?.replace(/-/g, " ").replace("percent", "%");

    const offer = await getOffer(offerType);

    // Add default values if offer is undefined
    const offerTitle = offer?.metadata?.title || offerType;
    const offerDescription = offer?.description || "";

    return {
      title: offerTitle,
      description: offerDescription,
      openGraph: {
        title: offerTitle,
        description: offerDescription,
        images: [
          {
            url: "/ayatrio-room.jpg",
            width: 600,
            height: 600,
            alt: "Ayatrio India-Affordable Home Furnishing & Decor designs & ideas",
          },
        ],
      },
      alternates: {
        canonical: `${BASE_URL}/${title}/${subtitle}/${cat}`,
      },
    };
  }

  const currentSubcategory = subcategories?.find(
    (subcategory) => subcategory.name === subCategory
  );

  return {
    title:
      currentSubcategory?.metadata?.title || currentSubcategory?.name || cat,
    description: currentSubcategory?.description || "",
    openGraph: {
      title:
        currentSubcategory?.metadata?.title || currentSubcategory?.name || cat,
      description: currentSubcategory?.description || "",
      images: [
        {
          url: currentSubcategory?.img,
          alt: currentSubcategory?.name || cat,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/${title}/${subtitle}/${cat}`,
    },
  };
}

const page = async ({ params }) => {
  const { title, cat, subtitle } = params;

  if (title === "offers") {
    return <ProductPage params={params} isSubcategoryPage={false} />;
  }

  const isCategoryPage = title !== "offers" && cat === "all";
  const isOfferPage = title === "offers";

  const isSubcategoryPage =
    !isCategoryPage && !isOfferPage && subtitle === "subcollection";

  const categoryName = isSubcategoryPage
    ? cat.replace(/-/g, " ")
    : title.replace(/-/g, " ");

  const subCategory = title.replace(/-/g, " ");

  const category = await getCategoryByName(categoryName);


  let faqs = [];

  // Determine if it's a category or subcategory page and fetch the appropriate FAQs
  if (isSubcategoryPage) {
    const currentSubcategory = category?.subcategories?.find(
      (subcategory) => subcategory.name === title.replace(/-/g, " ")
    );
    faqs = currentSubcategory?.faq || [];
  } else {
    faqs = category?.faq || [];
  }

  // Create FAQ Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => {
        // Handle both category and subcategory FAQ structures
        return (
          (faq.question && faq.answer) || // For category FAQs
          (faq.heading && faq.description) // For subcategory FAQs
        );
      })
      .map((faq) => {
        // Map fields dynamically based on structure
        if (faq.question && faq.answer) {
          // Category FAQ structure
          return {
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          };
        } else if (faq.heading && faq.description) {
          // Subcategory FAQ structure
          return {
            "@type": "Question",
            name: faq.heading,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.description,
            },
          };
        }
      }),
  };

  const subcategories = category?.subcategories;

  const currentSubcategory = subcategories?.find((subcategory) => {
    if (isSubcategoryPage) return subcategory.name === title.replace(/-/g, " ");

    return subcategory.name === cat.replace(/-/g, " ");
  });

  const categoryProductsResponse = await axios.get(
    createApiEndpoint(`fetchProductsByCategory/${categoryName}`)
  );

  const categoryProducts = categoryProductsResponse?.data;

  const subcategoryProducts = categoryProducts?.filter?.((product) => {
    if (isSubcategoryPage)
      return product.subcategory === title.replace(/-/g, " ");

    return product.subcategory === cat.replace(/-/g, " ");
  });

  let productCollectionJsonLd = {};

  let categoryJsonLd = {};

  if (!isSubcategoryPage) {
    productCollectionJsonLd = {
      "@context": "http://schema.org",
      "@type": "ProductCollection",
      name: categoryName,
      url: `${BASE_URL}/${title}/${subtitle}/${cat}`,
      description: category?.description || "",
      image: category?.image,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30
      },
    };

    categoryJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${categoryName} Products`,
      itemListElement: categoryProducts.map((product, productIndex) => {
        // const reviews = product.ratings;

        // const productReviews = reviews?.map((review) => ({
        //   "@type": "Review",
        //   author: {
        //     "@type": "Person",
        //     name: review.name,
        //   },
        //   reviewBody: review.comment,
        //   reviewRating: {
        //     "@type": "Rating",
        //     ratingValue: review.rating.toString(),
        //   },
        // }));

        // const aggregateRating = reviews?.length
        //   ? {
        //       "@type": "AggregateRating",
        //       ratingValue: getAggregateRating(reviews)?.ratingValue || "0",
        //       reviewCount: getAggregateRating(reviews)?.reviewCount || "0",
        //     }
        //   : null;

        let price = product.perUnitPrice;

        // Check if special or discounted price exists
        if (
          (product.specialprice && product.specialprice.price) ||
          (product.discountedprice && product.discountedprice.price)
        ) {
          const currentDate = new Date();

          // Use first available special or discounted price details
          const startDate = new Date(
            product.specialprice?.startDate ||
            product.discountedprice?.startDate
          );

          const endDate = new Date(
            product.specialprice?.endDate || product.discountedprice?.endDate
          );

          const isPeriodApplicable =
            startDate < currentDate && currentDate < endDate;

          price = isPeriodApplicable
            ? product.specialprice?.price || product.discountedprice?.price
            : product.perUnitPrice;
        }

        return {
          "@type": "ListItem",
          position: productIndex + 1,
          // item: {
          // "@type": "Product",
          name: product.productTitle,
          // description: product.productDescription,
          price,
          priceCurrency: "INR",
          url: `${BASE_URL}/${product.productTitle.replace(/ /g, "-")}/${product.productId
            }`,
          image: product.productImages.flatMap(
            (imageObject) => imageObject.images
          )[0],
          // brand: {
          //   "@type": "Brand",
          //   name: product.brand || "Ayatrio",
          // },
          // offers: {
          //   "@type": "Offer",
          //   price: product.specialprice?.price ?? 0,
          //   priceCurrency: "INR",
          //   availability: product.specialprice?.price
          //     ? "https://schema.org/InStock"
          //     : "https://schema.org/OutOfStock",
          //   priceValidUntil: product.specialprice?.endDate || null,
          //   seller: {
          //     "@type": "Organization",
          //     name: "Ayatrio",
          //   },
          // },
          // aggregateRating: aggregateRating,
          // review: productReviews?.length ? productReviews : null,
          // },
        };
      }),
    };
  } else {
    productCollectionJsonLd = {
      "@context": "http://schema.org",
      "@type": "ProductCollection",
      name: currentSubcategory?.name,
      url: `${BASE_URL}/${title}/${subtitle}/${cat}`,
      description: currentSubcategory?.description || "",
      image: currentSubcategory?.img,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30
      },
    };

    categoryJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${currentSubcategory?.name} Products`,
      // description: currentSubcategory?.description || "",
      itemListElement: subcategoryProducts?.map((product, index) => {
        // const reviews = product.ratings;

        // const productReviews = reviews?.map((review) => ({
        //   "@type": "Review",
        //   author: {
        //     "@type": "Person",
        //     name: review.name,
        //   },
        //   reviewBody: review.comment,
        //   reviewRating: {
        //     "@type": "Rating",
        //     ratingValue: review.rating.toString(),
        //   },
        // }));

        // const aggregateRating = reviews?.length
        //   ? {
        //       "@type": "AggregateRating",
        //       ratingValue: getAggregateRating(reviews)?.ratingValue || "0",
        //       reviewCount: getAggregateRating(reviews)?.reviewCount || "0",
        //     }
        //   : null;

        let price = product.perUnitPrice;

        // Check if special or discounted price exists
        if (
          (product.specialprice && product.specialprice.price) ||
          (product.discountedprice && product.discountedprice.price)
        ) {
          const currentDate = new Date();

          // Use first available special or discounted price details
          const startDate = new Date(
            product.specialprice?.startDate ||
            product.discountedprice?.startDate
          );

          const endDate = new Date(
            product.specialprice?.endDate || product.discountedprice?.endDate
          );

          const isPeriodApplicable =
            startDate < currentDate && currentDate < endDate;

          price = isPeriodApplicable
            ? product.specialprice?.price || product.discountedprice?.price
            : product.perUnitPrice;
        }

        return {
          "@type": "ListItem",
          position: index + 1,
          // item: {
          // "@type": "Product",
          name: product.productTitle,
          // description: product.productDescription,
          // brand: {
          //   "@type": "Brand",
          //   name: product.brand || "Ayatrio",
          // },
          price,
          priceCurrency: "INR",
          url: `${BASE_URL}/${product.productTitle.replace(/ /g, "-")}/${product.productId
            }`,
          image: product.productImages.flatMap(
            (imageObject) => imageObject.images
          )[0],
          // offers: {
          //   "@type": "Offer",
          //   price: product.specialprice?.price ?? 0,
          //   priceCurrency: "INR",
          //   availability: product.specialprice?.price
          //     ? "https://schema.org/InStock"
          //     : "https://schema.org/OutOfStock",
          //   priceValidUntil: product.specialprice?.endDate || null,
          //   seller: {
          //     "@type": "Organization",
          //     name: "Ayatrio",
          //   },
          // },
          // aggregateRating: aggregateRating,
          // review: productReviews?.length ? productReviews : null,
          // },
        };
      }),
    };
  }

  return (
    <>
      {/* Existing schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productCollectionJsonLd),
        }}
      />
      {/* <FreeSampleSchema />
      <InstallationServiceSchema /> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <WebPageJsonLd
        useAppDir={true}
        name={
          isCategoryPage
            ? category?.metadata?.title ||
            category?.name ||
            params.parentCategory
            : currentSubcategory?.metadata?.title || currentSubcategory?.name
        }
        description={
          isCategoryPage
            ? category?.description || ""
            : currentSubcategory?.description || ""
        }
        id={`https://www.ayatrio.com/${title}/${subtitle}/${cat}`}
      />
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://www.ayatrio.com/",
          },
          {
            position: 2,
            name: decodeURIComponent(title),
            item: "https://www.ayatrio.com/" + title,
          },
          {
            position: 3,
            name: decodeURIComponent(subtitle),
            item: "https://www.ayatrio.com/" + title + "/" + subtitle,
          },
          {
            position: 4,
            name: decodeURIComponent(cat),
            item:
              "https://www.ayatrio.com/" + title + "/" + subtitle + "/" + cat,
          },
        ]}
      />
      {/* {isCategoryPage &&
        categoryProducts?.map((product) => {
          const ratings = product.ratings;

          const reviews = ratings?.map((review) => {
            return {
              author: review.name,
              name: review.comment,
              reviewBody: review.comment,
              reviewRating: {
                ratingValue: `${review.rating}`,
              },
            };
          });

          const aggregateRating = getAggregateRating(ratings);

          const images = [];

          product.productImages.forEach((imageObject) => {
            imageObject.images.forEach((image) => images.push(image));
          });

          return (
            <ProductJsonLd
              key={product._id}
              useAppDir={true}
              productName={product.productTitle}
              description={product.productDescription}
              images={images}
              brand={product.brand || "Ayatrio"}
              offers={[
                {
                  price: product.specialprice?.price,
                  priceCurrency: "INR",
                  priceValidUntil: product.specialprice?.endDate,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                  url: `${BASE_URL}/${product.productTitle}/${product.productId}`,
                  seller: {
                    name: "Ayatrio",
                  },
                },
              ]}
              reviews={!!reviews?.length ? reviews : null}
              aggregateRating={!!reviews?.length ? aggregateRating : null}
            />
          );
        })}
      {!isCategoryPage &&
        !isOfferPage &&
        subcategoryProducts?.map((product) => {
          const ratings = product.ratings;

          const reviews = ratings?.map((review) => {
            return {
              author: review.name,
              name: review.comment,
              reviewBody: review.comment,
              reviewRating: {
                ratingValue: `${review.rating}`,
              },
            };
          });

          const aggregateRating = getAggregateRating(ratings);

          const images = [];

          product.productImages.forEach((imageObject) => {
            imageObject.images.forEach((image) => images.push(image));
          });

          return (
            <ProductJsonLd
              key={product._id}
              useAppDir={true}
              productName={product.productTitle}
              description={product.productDescription}
              images={images}
              brand={product.brand || "Ayatrio"}
              offers={[
                {
                  price: product.specialprice?.price,
                  priceCurrency: "INR",
                  priceValidUntil: product.specialprice?.endDate,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                  url: `${BASE_URL}/${product.productTitle}/${product.productId}`,
                  seller: {
                    name: "Ayatrio",
                  },
                },
              ]}
              reviews={!!reviews?.length ? reviews : null}
              aggregateRating={!!reviews?.length ? aggregateRating : null}
            />
          );
        })} */}
      <ProductPage
        params={params}
        isSubcategoryPage={isSubcategoryPage}
        initialParentCategory={
          isSubcategoryPage ? cat.replace(/-/g, " ") : title.replace(/-/g, " ")
        }
        initialSubcategory={
          isSubcategoryPage
            ? subCategory
            : cat.replace(/-/g, " ").replace(/percent/g, "%")
        }
      />
    </>
  );
};

export default page;
