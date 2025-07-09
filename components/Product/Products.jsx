import { FAQPageJsonLd } from "next-seo";

const FAQ_FALLBACKS = {
  flooring: [
    {
      questionName: "What is SPC flooring?",
      acceptedAnswerText: "SPC (Stone Plastic Composite) flooring is a rigid core waterproof flooring option that combines limestone powder, stabilizers, and PVC for durable, dimensionally stable flooring."
    },
    {
      questionName: "How long does flooring installation take?",
      acceptedAnswerText: "Professional installation typically takes 1-2 days for average-sized rooms, depending on floor preparation needs and product type."
    },
    {
      questionName: "Can I install new flooring over existing floors?",
      acceptedAnswerText: "Many modern flooring options can be installed over existing floors if they're properly prepared and level, though height transitions must be considered."
    }
  ],
  default: [
    {
      questionName: "What are your product quality standards?",
      acceptedAnswerText: "All our products meet international quality certifications and undergo rigorous testing for durability and safety."
    }
  ]
};

const Products = ({ filteredProductData, heading }) => {
  // Use the first product's category as the main heading if not provided
  const mainCategory = filteredProductData.length > 0 ? filteredProductData[0].category : "Products";
  const displayHeading = heading || mainCategory;
  const getFaqData = () => {
    const productWithFaqs = filteredProductData.find(p => p.faqs?.length > 0);
    
    if (productWithFaqs) {
      return productWithFaqs.faqs.map(faq => ({
        questionName: faq.question,
        acceptedAnswerText: faq.answer
      }));
    }
    
    return FAQ_FALLBACKS[mainCategory] || FAQ_FALLBACKS.default;
  };

  return (
    <section className="products-section relative top-20 sm:px-[50px] px-[20px]">
      {/* Main heading of products */}
      <header>
        <FAQPageJsonLd
        mainEntity={getFaqData()}
        keyOverride={`faq-${mainCategory}`}
      />
        <h1 className="text-3xl font-bold mb-10" id="product-heading">
          {displayHeading}
        </h1>
      </header>
  
      {/* Product thumbnails carousel */}
      <nav className="product-navigation" aria-label="Product thumbnails">
        <div className="flex flex-row gap-3 sm:w-[65vw] sm:overflow-x-hidden overflow-x-auto mb-16">
          {filteredProductData.map((product, idx) => (
            <article key={idx} className="flex flex-col gap-2" aria-labelledby={`product-${idx}`}>
              {/* Assuming the first image from the images array is used */}
              <img
                className="sm:min-w-[120px] sm:h-[70px] min-w-[120px] h-[70px]"
                src={product.images[0]}
                alt={product.productTitle}
              />
              <p>{product.productTitle}</p>
            </article>
          ))}
        </div>
      </nav>
  
      {/* Relevant text */}
      <article className="product-description" aria-labelledby="product-description">
        <p className="sm:w-[50vw] w-[100%] text-base text-justify">
          Waking up to harsh sunlight can put your mornings to an unpleasant
          start. And more than that, uncovered windows also take away your privacy.
          Curtains and blinds keep your home secured, and at the same time,
          regulate the amount of light inside it. From Ayatrio's wide range of
          curtains, there's a design for every individual taste. Smooth fabrics,
          unconventional patterns, and diverse colours make this collection truly
          unique. Apart from being stylish, these curtains also have excellent
          light blocking features that keep your interiors cool and safe.
        </p>
      </article>
    </section>
  );  
};

export default Products;