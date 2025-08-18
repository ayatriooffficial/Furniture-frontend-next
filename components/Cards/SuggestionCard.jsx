import "./styles.css";

import Image from "next/image";
import Link from "next/link";
import PopUp from "../Reviews/PopUp";

function SuggestionCard(props) {
  
  return (
    <article aria-labelledby={`card-title-${props.cardkey}`}>
      <div key={props.cardkey} className="pb-8 cursor-pointer">
        <Link href={`/${props.title.replace(/ /g, "-")}/inspiration`} aria-label={`View inspiration for ${props.title}`}>

          <figure className="flex h-full w-full items-center justify-center cursor-pointer overflow-hidden">
            <Image
              src={props.mainImage}
              alt={`Featured image for ${props.title}`}
              height={600}
              width={600}
              className={"aspect-square w-full object-cover"}
            />
          </figure>

          <div className={`${props.bgColorClass} p-8 overflow-hidden`}>
            <h3 id={`card-title-${props.cardkey}`} className="sm:text-[14px] md:text-[16px] lg:text-[20px] font-semibold hover:underline text-ellipsis mb-1">
              {props.title}
            </h3>
            <div className={`text-sm overflow-hidden text-ellipsis`} aria-label="Description">
              {props.desc}
            </div>
            
            <div className="bg-[#000000] rounded-full max-w-fit p-2 mt-[60px] lg:mt-[90px]" aria-hidden="true">
              <Image
                src={"/icons/top_arrow-white.svg"}
                height={25}
                width={25}
                className="p-1"
                alt=""
                loading="lazy"
              />
            </div>
          </div>
        </Link>
      </div>
      {props.isPopupVisible && (
        <aside aria-modal="true" aria-label={`Additional information for ${props.title}`}>
          <PopUp
            isPopupVisible={props.isPopupVisible}
            closePopup={props.closePopup}
          />
        </aside>
      )}
    </article>
  );
}

export default SuggestionCard;