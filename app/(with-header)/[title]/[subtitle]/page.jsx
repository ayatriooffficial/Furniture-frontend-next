import { checkKeyword } from "@/actions/checkKeyword";
import { getProductByProductId } from "@/actions/getProductByProductId";
import { fetchSuggestionData } from "@/components/Features/api";
import ProductPage from "@/components/ProductPage/ProductPage";
import { RoomsPage } from "@/components/Rooms/RoomsPage";
import Suggestion from "@/components/suggestion/Suggestion";
import { BASE_URL } from "@/constants/base-url";
import { getAggregateRating } from "@/utils/getAggregateRating";
import axios from "axios";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  ProductJsonLd,
  WebPageJsonLd,
} from "next-seo";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const productId = params.subtitle;

  if (params.title === "category") {
    return null;
  }

  if (productId?.endsWith(".html") || productId?.endsWith(".svg")) {
    return null;
  }

  const isRoomPage = params.subtitle === "rooms";
  const isInspirationPage = params.subtitle === "inspiration";
  if (isRoomPage) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRoommain`,
      {
        params: {
          roomType: params.title.replace(/-/g, " "),
        },
      }
    );
    const roomData = response.data;

    return {
      title: roomData?.metadata?.title || roomData?.roomType || params.roomType,
      description: roomData?.summary || "",
      openGraph: {
        title:
          roomData?.metadata?.title || roomData?.roomType || params.roomType,
        description: roomData?.summary || "",
        images: [
          {
            url: roomData?.mainImage?.imgSrc,
            alt: roomData?.roomType || params.roomType,
          },
        ],
      },
      alternates: {
        canonical: `${BASE_URL}/${params.title}/rooms`,
      },
    };
  }

  if (isInspirationPage) {
    const suggestion = await fetchSuggestionData(
      params.title?.replace(/-/g, " ")
    );

    return {
      title: suggestion?.metadata?.title || "Inspiration",
      description: suggestion?.summary || "",
      openGraph: {
        title: suggestion?.metadata?.title || "Inspiration",
        description: suggestion?.summary || "",
        images: suggestion?.mainImage
          ? [
            {
              url: suggestion.mainImage.imgSrc,
            },
          ]
          : [],
      },
      alternates: {
        canonical: `${BASE_URL}/${params.title}/inspiration`,
      },
    };
  }

  const product = await getProductByProductId(productId);


  if (!product) {
    return null;
  }

  return {
    title: `Buy ${product?.productTitle || params.title?.replace(/-/g, " ")
      } at ${product?.offer || ""} | Ayatrio`,
    description: product?.productDescription || "",
    openGraph: {
      title: product?.productTitle || params.title?.replace(/-/g, " "),
      description:
        product?.shortDescription +
        " Price: " +
        product?.perUnitPrice +
        " INR " +
        " Status: " +
        product?.availability +
        " Brand: " +
        "Ayatrio",
      images: product?.images?.length
        ? [
          {
            url: product?.images[0], // Use the first image or a specific one
            alt: product?.productTitle || params.title?.replace(/-/g, " "),
          },
        ]
        : [],
      //Added FAQs here
      faqs: product?.faqs?.length ? product.faqs.map(faq => ({
        question: faq.title || "",
        answer: faq.description || ""
      })) : [{
        question: "",
        answer: ""
      }],
    },
    alternates: {
      canonical: `${BASE_URL}/${(product?.productTitle || '').replace(/ /g, "-")}/${product.productId
        }`,
    },
  };
}

const Page = async ({ params }) => {

  const productId = params.subtitle;

  if (productId === "collection") {
    return redirect(`/${params.title}/collection/all`);
  }

  if (productId === "subcollection") {
    const keywordDetails = await checkKeyword(params.title.replace(/-/g, " "));
    const parentCategory = keywordDetails?.parentCategory;

    if (!parentCategory) {
      return redirect("/");
    }

    return redirect(`/${params.title}/subcollection/${parentCategory}`);
  }

  if (productId?.endsWith(".html") || productId?.endsWith(".svg")) {
    return null;
  }

  const isRoomPage = params.subtitle === "rooms";
  const isInspirationPage = params.subtitle === "inspiration";

  const product =
    isRoomPage || isInspirationPage
      ? null
      : await getProductByProductId(productId);

  if (!product && !isRoomPage && !isInspirationPage) {
    return null;
  }

  const productImages = product?.images;

  const ratings = product?.ratings;

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

  if (isRoomPage) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllRoommain`,
      {
        params: {
          roomType: params.title.replace(/-/g, " "),
        },
      }
    );
    const roomData = response.data;



    return (
      <>
        <WebPageJsonLd
          useAppDir={true}
          name={
            roomData?.metadata?.title || roomData?.roomType || params.roomType
          }
          description={roomData?.summary || ""}
          id={`https://www.ayatrio.com/rooms/${params.roomType}`}
        />
        <RoomsPage params={params.title} />;
      </>
    );
  }

  if (isInspirationPage) {
    const suggestion = await fetchSuggestionData(
      params.title?.replace(/-/g, " ")
    );


    return (
      <>

        <ArticleJsonLd
          useAppDir={true}
          type="BlogPosting"
          title={suggestion.metadata.title}
          description={suggestion.summary}
          images={[suggestion.mainImage, suggestion.suggestionCardImage]}
          datePublished={suggestion.createdAt?.toString()}
          dateModified={suggestion.updatedAt?.toString()}
          authorName={suggestion.author?.name || "Ayatrio"}
        />

        <Suggestion id={params.title.replace(/-/g, " ")} />;
      </>
    );
  }

  return (
    <>

      <ProductJsonLd
        useAppDir={true}
        productName={product?.productTitle}
        images={productImages}
        //Added FAQs here
        faqs={product?.faqs}
        description={product?.productDescription}
        brand="Ayatrio"
        offers={[
          {
            price: product?.specialprice?.price,
            priceCurrency: "INR",
            priceValidUntil: product?.specialprice?.endDate,
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            url: `https://www.ayatrio.com/${params.title?.replace(/-/g, " ")}`,
            seller: {
              name: product?.seller || "Ayatrio",
            },
          },
        ]}
        reviews={!!reviews?.length ? reviews : null}
        aggregateRating={!!reviews?.length ? aggregateRating : null}
      />
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://www.ayatrio.com",
          },
          {
            position: 2,
            name: product?.productTitle || params.title?.replace(/-/g, " "),
            item: `https://www.ayatrio.com/${params.title?.replace(/-/g, " ")}`,
          },
        ]}
      />
      <ProductPage
        title={params.title.replace(/-/g, " ")}
        productId={productId}
        initialData={product}
      />
    </>
  );
};

export default Page;
