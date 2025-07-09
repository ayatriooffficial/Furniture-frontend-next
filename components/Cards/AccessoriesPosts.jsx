import AccessoriesSlider from "./AccessoriesSlider";

const AccessoriesPosts = ({ accessories }) => {
  return (
    <div className="border-b-[0.5px] border-[#f5f5f5] ">
      {accessories && accessories.length > 0 && (
        <div>
          <h2 className="font-semibold text-2xl pb-[8px] ">
            {accessories[0].subcategory}
          </h2>
        </div>
      )}
      <AccessoriesSlider accessories={accessories} />
    </div>
  );
};

export default AccessoriesPosts;
