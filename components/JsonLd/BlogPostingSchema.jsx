export default async function BlogPostingSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || baseUrl;

  // Fetch data with error handling
  const fetchData = async () => {
    try {
      const [roomsRes, suggestionsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/getAllRoommain`, { cache: "no-store" }),
        fetch(`${apiBaseUrl}/api/fetchAllSuggestions`, { cache: "no-store" }),
      ]);

      const rooms = roomsRes.ok ? await roomsRes.json() : [];
      const suggestions = suggestionsRes.ok ? await suggestionsRes.json() : [];

      

      return {
        rooms: Array.isArray(rooms) ? rooms : [],
        suggestions: Array.isArray(suggestions) ? suggestions : [],
      };
    } catch (error) {
      console.error("BlogPostingSchema - Error fetching data:", error.message);
      return { rooms: [], suggestions: [] };
    }
  };

  const { rooms = [], suggestions = [] } = await fetchData();

  
  const createBlogItemUrl = (room, suggestion, index) => {
    const safeRoom = room || {};
    const safeSuggestion = suggestion || {};
    const roomSlug = safeRoom.roomType
      ? encodeURIComponent(
          safeRoom.roomType.toLowerCase().replace(/\s+/g, "-")
        )
      : "home-decor";
    const itemId = [safeSuggestion._id, safeRoom._id].find(Boolean) || `item-${index}`;
    return `${baseUrl}/inspiration/${roomSlug}/${itemId}`;
  };

  // Generate Blog schema
  const generateBlogSchema = () => {
    const blogPostItems = [
      ...(rooms || []).map((room, index) => createBlogItem(room, null, index)),
      ...(suggestions || []).map((suggestion, index) =>
        createBlogItem(null, suggestion, index + (rooms?.length || 0))
      ),
    ].filter((item) => item && item["@id"]);

    
    if (blogPostItems.length === 0) {
      
      blogPostItems.push({
        "@type": "BlogPosting",
        "@id": `${baseUrl}/inspiration/home-decor/fallback`,
        headline: "Default Home Decor Inspiration",
        description: "Discover amazing home decor ideas from Ayatrio",
        url: `${baseUrl}/inspiration/home-decor/fallback`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/inspiration/fallback`,
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        image: [`${baseUrl}/images/default-image.jpg`],
        author: {
          "@type": "Organization",
          name: "Ayatrio",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Ayatrio",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
          },
        },
        keywords: ["home decor"],
      });
    }

    

    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Ayatrio Design Guides & Offers",
      description: "Explore home decor inspiration and design tips from Ayatrio",
      url: `${baseUrl}/inspiration`,
      publisher: {
        "@type": "Organization",
        name: "Ayatrio",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
      blogPost: blogPostItems,
    };
  };

  // Blog item creator
  const createBlogItem = (room, suggestion, index) => {
    const safeRoom = room || {};
    const safeSuggestion = suggestion || {};

    const url = createBlogItemUrl(room, suggestion, index);

    const blogItem = {
      "@type": "BlogPosting",
      "@id": url,
      headline:
        safeRoom.metadata?.title || safeRoom.heading || "Home Decor Inspiration",
      description:
        safeSuggestion.summary ||
        safeRoom.summary ||
        "Discover amazing home decor ideas",
      url: url,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      datePublished: new Date(safeRoom.createdAt || Date.now()).toISOString(),
      dateModified: new Date(
        safeSuggestion.updatedAt || safeRoom.updatedAt || Date.now()
      ).toISOString(),
      image: [
        ...(safeRoom.mainImage ? [`${baseUrl}/images/${safeRoom.mainImage}`] : []),
        ...(safeSuggestion.mainImage
          ? [`${baseUrl}/images/${safeSuggestion.mainImage}`]
          : []),
      ].filter(Boolean),
      author: {
        "@type": "Organization",
        name: "Ayatrio",
        url: baseUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Ayatrio",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
      keywords: [
        ...(safeRoom.roomType ? [safeRoom.roomType] : ["home decor"]),
        ...((safeSuggestion.features || [])
          .map((f) => f?.name)
          .filter(Boolean) || []),
      ],
    };

    
    return blogItem;
  };

  const schema = generateBlogSchema();

  

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}