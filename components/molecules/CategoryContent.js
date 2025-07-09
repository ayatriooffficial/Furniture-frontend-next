import Image from "next/image";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

const CategoryContent = (props) => {
  const {
    key,
    categoryGap,
    containerPadding,
    headingStyle,
    headingSize,
    headingColor,
    gapHeadingItems,
    itemsGap,
    textStyle,
    textSize,
    textColor,
    containerBgColor,
    displayedOn,
  } = props;

  const heading = props.categoryHeading;

  const categoryData = props.categoryData;
  const router = useRouter();
  let parentCategoryVar;
  const handleClick = (cat) => {
    if (displayedOn === "menu") {
      // console.log("heading : ", heading)
      // console.log("cat : ", cat)
      // console.log("cat.text : ", cat.text)
      cat.text === "Virtual Experience"
        ? router.push("/category/virtualexperience")
        : router.push("/magazine");
    } else {
      // console.log("heading : ", heading);
      // console.log("cat : ", cat);
      // console.log("cat.text : ", cat.text);
      if (heading.split(" ")[2].toLowerCase() === "collections") {
        parentCategoryVar = "collection";
      } else if (heading.split(" ")[2].toLowerCase() === "rooms") {
        parentCategoryVar = "roomCategory";
      } else if (heading.split(" ")[2].toLowerCase() === "styles") {
        parentCategoryVar = "style";
      } else if (heading.split(" ")[2].toLowerCase() === "colours") {
        parentCategoryVar = "colors";
      }
      router.push(
        props.parentCategory + "/" + parentCategoryVar + "/" + cat.text
      );
    }
  };



  return (
    <section 
      className={`category-list flex flex-col ${categoryGap} ${containerPadding} ${gapHeadingItems} ${containerBgColor}`}
      aria-labelledby="category-heading"
    >
      <header className={`${headingStyle} ${headingSize} ${headingColor}`}>
        <h2 id="category-heading">{heading}</h2>
      </header>
      
      <nav className={`category-items flex flex-col ${itemsGap}`}>
        <ul className="list-none p-0 m-0">
          {categoryData.map((dataItem) => {
            return (
              <li
                key={dataItem.id}
                className={`flex gap-1`}
                onClick={() => handleClick(dataItem)}
              >
                <article className="category-item flex items-center">
                  {dataItem.image ? (
                    <figure className="m-0">
                      <Image 
                        loading="lazy"
                        src={dataItem.image}
                        width={20}
                        height={20}
                        alt={dataItem.text}
                        className="rounded-full"
                      />
                    </figure>
                  ) : null}
                  <p
                    className={`${textStyle} ${textSize} ${textColor} cursor-pointer`}
                  >
                    {dataItem.text}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
};

CategoryContent.propTypes = {
  categoryGap: PropTypes.string,
  containerPadding: PropTypes.string,
  headingStyle: PropTypes.string,
  headingSize: PropTypes.string,
  headingColor: PropTypes.string,
  gapHeadingItems: PropTypes.string,
  itemsGap: PropTypes.string,
  textStyle: PropTypes.string,
  textSize: PropTypes.string,
  textColor: PropTypes.string,
  containerBgColor: PropTypes.string,
  displayedOn: PropTypes.string,
};

CategoryContent.defaultProps = {
  categoryGap: "space-x-1",
  containerPadding: "p-1",
  headingStyle: "not-italic",
  headingSize: "font-md",
  headingColor: "text-black",
  gapHeadingItems: "space-y-5",
  itemsGap: "space-y-3",
  textStyle: "not-italic",
  textSize: "text-sm",
  textColor: "text-black",
  containerBgColor: "bg-white",
  displayedOn: "filterDropdown",
};

export default CategoryContent;
