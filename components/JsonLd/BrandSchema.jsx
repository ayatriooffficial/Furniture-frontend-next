// components/BrandSchema.js
import { fetchBrandData } from "@/utils/fetchBrandData";
import { BrandJsonLd } from "next-seo";

const BrandSchema = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
  const { primaryLocation } = await fetchBrandData();

  return (
    <BrandJsonLd
      useAppDir={true}
      id={`${baseUrl}/#brand`}
      slogan="Transforming Homes, Enhancing Lives"
      logo={`${baseUrl}/logo.png`}
      aggregateRating={{
        ratingValue: "4.8",
        reviewCount: "12500",
        ratingCount: "12500"
      }}
      address={{
        "@type": "PostalAddress",
        streetAddress: primaryLocation.address,
        addressLocality: primaryLocation.city,
        addressRegion: primaryLocation.region,
        postalCode: primaryLocation.pincode,
        addressCountry: "IN"
      }}
    />
  );
};

export default BrandSchema;