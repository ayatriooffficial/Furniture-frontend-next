import axios from "axios";
import { useEffect, useState } from "react";

const createApiEndpoint = (endpoint) => {
  const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
  return `${BASE_URL}/${endpoint}`;
};

const CategoryFeatures = (props) => {
  // Get categoryName from props if available (for server-side rendering)
  const initialCategoryName = props.categoryName || "";
  
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubcategoryPage, setIsSubcategoryPage] = useState(false);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [categoryName, setCategoryName] = useState(initialCategoryName);

  // Use router only in client-side
  useEffect(() => {
    // This ensures the router is only used in client-side rendering
    const router = window.location;
    if (router && router.pathname) {
      const pathname = router.pathname;
      // Extract the last part of the pathname after the last slash
      const pathParts = pathname.split("/");
      const extractedCategoryName = pathParts[pathParts.length - 1] || "";
      
      // If we have a valid category name from the path, use it
      if (extractedCategoryName && extractedCategoryName !== "") {
        setCategoryName(extractedCategoryName);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (!categoryName) {
          return; // Wait until categoryName is set
        }
        
        setLoading(true);
        // console.log("Fetching category data for:", categoryName);
        
        // Decode the category name first to handle any existing encoding
        const decodedCategory = decodeURIComponent(categoryName);
        const response = await axios.get(
          createApiEndpoint(`getCategoryByName/${encodeURIComponent(decodedCategory)}`)
        );
        
        // console.log("API Response:", response.data);
        
        const data = response.data;
        if (data && data.features) {
          setFeatures(data.features);
        } else if (data && data.subcategories && data.subcategories.length > 0) {
          // Handle subcategory case
          setIsSubcategoryPage(true);
          setFilteredSubCategory([{
            features: data.subcategories[0]?.features || []
          }]);
        } else {
          // console.log("No features found in the response data:", data);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(`Failed to load category features: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  const renderFeatureDescription = (feature) => {
    if (!feature?.description) return null;

    let { description, descriptionLinks } = feature;

    if (!descriptionLinks || descriptionLinks.length === 0) {
      return description[0]; // Return plain text if no links
    }

    let elements = [description[0]];

    descriptionLinks.forEach((item, i) => {
      elements = elements.flatMap((part, index) =>
        typeof part === "string"
          ? part.split(item.text).flatMap((chunk, idx, arr) =>
              idx < arr.length - 1
                ? [
                    chunk,
                    <a
                      key={`${item.text}-${i}-${idx}`}
                      href={item.link}
                      style={{ color: "#0152be", textDecoration: "none" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>,
                  ]
                : chunk
            )
          : part
      );
    });

    return elements;
  };

  if (loading) return <div className="p-4">Loading features...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!categoryName) return <div className="p-4">Loading category information...</div>;
  
  const renderFeaturesList = (featureItems) => {
    if (!featureItems || featureItems.length === 0) {
      return (
        <aside className="p-4" aria-live="polite">
          <p>No features available for {categoryName}</p>
        </aside>
      );
    }
  
    return featureItems.map((feature, featureIdx) => (
      <article key={featureIdx} className="feature-item mb-4" aria-labelledby={`feature-${featureIdx}`}>
        <h3 className="text-lg font-medium text-gray-800 mb-2" id={`feature-${featureIdx}`} aria-live="assertive">
          {feature.title}
        </h3>
        <ul className="list-disc pl-6 space-y-2" aria-describedby={`feature-description-${featureIdx}`}>
          {feature.description && feature.description.map((desc, i) => (
            <li key={i} className="text-gray-700">
              {renderFeatureDescription({ ...feature, description: [desc] })}
            </li>
          ))}
        </ul>
      </article>
    ));
  };
  
  return (
    <section className="features-section md:mx-12 sm:mx-5 mx-3 bg-white py-6" aria-live="polite">
      <h2 className="text-2xl font-bold mb-6" aria-label={`Features for ${categoryName}`}>
        Features for {categoryName}
      </h2>
      <div className="features-content space-y-6">
        {!isSubcategoryPage
          ? renderFeaturesList(features)
          : renderFeaturesList(filteredSubCategory[0]?.features)}
      </div>
    </section>
  );
}

export default CategoryFeatures;
  