// components/Features/Schemas/OrganizationSchema.js
const generateOrganizationSchema = (stores) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
    
    return {
      "@context": "https://schema.org",
      "@type": ["Organization", "Store", "HomeGoodsStore"],
      "@id": `${baseUrl}/#organization`,
      "name": "Ayatrio",
      "alternateName": "Ayatrio Home Furnishing & Decor",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "description": "India's premier destination for luxury home furnishing & decor brands with 25+ years of design excellence",
      "foundingDate": "1999",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "sameAs": [
        `${baseUrl}/facebook`,
        `${baseUrl}/instagram`,
        `${baseUrl}/twitter`,
        `${baseUrl}/linkedin`
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-9876543210",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        }
      ],
      "department": stores.map(store => {
        const addressParts = store.address?.split(', ') || [];
        const [streetAddress, city, state] = addressParts;
        
        return {
          "@type": "LocalBusiness",
          "@id": `${baseUrl}/stores/${store._id}/#localbusiness`,
          "name": store.name,
          "image": [
            store.profileImg,
            ...(store.images?.map(img => img.url) || [])
          ],
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": streetAddress,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": store.pincode,
            "addressCountry": "IN"
          },
          "geo": store.geo_location ? {
            "@type": "GeoCoordinates",
            "latitude": store.geo_location.latitude,
            "longitude": store.geo_location.longitude
          } : undefined,
          "telephone": `+91-${store.phone}`,
          "parentOrganization": {
            "@id": `${baseUrl}/#organization`
          },
          "keywords": store.category?.join(', '),
          "additionalProperty": store.category?.map(cat => ({
            "@type": "PropertyValue",
            "name": "Category",
            "value": cat
          })),
          "hasMap": `${baseUrl}/stores/map/${store._id}`,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/stores/${store._id}`
          }
        };
      })
    };
  };
  
  export default generateOrganizationSchema;