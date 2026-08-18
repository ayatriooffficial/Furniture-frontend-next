"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateQuantity } from "@/components/Features/Slices/calculationSlice";
console.log("[Calculation.jsx] module loaded");

// Coverage assumptions for units sold in discrete packs (roll/box).
// These are business defaults, NOT product-specific. Ideally the Product
// schema should carry its own `coveragePerUnit` field (e.g. this particular
// wallpaper roll covers 45 sqft, this laminate box covers 22 sqft) since
// coverage genuinely varies by product. Until that field exists, we fall
// back to these defaults so the calculator is at least directionally right.
const DEFAULT_COVERAGE_SQFT = {
  roll: 50,
  box: 35,
};

// Display label for the unit the user actually types values into,
// derived from unitType (no separate/hardcoded input unit).
const UNIT_INPUT_LABEL = {
  sqft: "Feet",
  roll: "Feet",
  box: "Feet",
  m: "Meters",
  kg: "Kg",
  pcs: "Pieces",
};

// Maps each Product.unitType to how the calculator should behave:
// - "area"   -> needs Height + Width (entered in the unitType's own unit), computes area in sqft
// - "length" -> needs a single Length input
// - "weight" -> needs a single Weight input
// - "count"  -> needs a single Quantity (pieces) input
const UNIT_CONFIG = {
  sqft: { mode: "area", unitLabel: "sqft", roundUp: false },
  roll: { mode: "area", unitLabel: "Roll(s)", roundUp: true, coverage: DEFAULT_COVERAGE_SQFT.roll },
  box: { mode: "area", unitLabel: "Box(es)", roundUp: true, coverage: DEFAULT_COVERAGE_SQFT.box },
  m: { mode: "length", unitLabel: "m", roundUp: false },
  kg: { mode: "weight", unitLabel: "kg", roundUp: false },
  pcs: { mode: "count", unitLabel: "pcs", roundUp: true },
};

// `selectedDimension` is optional — an entry from priceData.dimensions
// (e.g. { dimension: "2mm", price: 115, discountedprice: 90, _id }).
// When it's not provided (no spec selected yet), the calculator falls
// back to the product's own top-level perUnitPrice/discountedprice.
const Calculation = ({ priceData, selectedDimension }) => {
  console.log("[Calculation debug]", {
  perUnitPrice: priceData?.perUnitPrice,
  discountedprice: priceData?.discountedprice,
  specialprice: priceData?.specialprice,
  dimensions: priceData?.dimensions,
  selectedDimension,
});
  const dispatch = useDispatch();

  const unitType = priceData?.unitType || "sqft";
  const config = UNIT_CONFIG[unitType] || UNIT_CONFIG.sqft;
  const inputUnitLabel = UNIT_INPUT_LABEL[unitType] || UNIT_INPUT_LABEL.sqft;

  // Regular price: selected dimension's price if one is chosen,
  // otherwise the product's top-level perUnitPrice (unchanged default).
  const perUnitPrice = Number(
    selectedDimension?.price ?? priceData?.perUnitPrice
  ) || 0;

  // --- Discount handling ---
  // dimensions[].discountedprice is stored as a plain NUMBER (e.g. 90),
  // while priceData.discountedprice is an OBJECT { price, startDate, endDate }.
  // Normalize both into the same object shape so the logic below is uniform.
  const rawDiscounted = selectedDimension
    ? selectedDimension.discountedprice
    : priceData?.discountedprice;

  const discounted =
    typeof rawDiscounted === "number"
      ? { price: rawDiscounted, startDate: null, endDate: null }
      : rawDiscounted;

  // discounted.price overrides perUnitPrice when it is not null,
  // and (if startDate/endDate are set) only while "now" falls in that window.
  const isDiscountActive = () => {
    if (!discounted || discounted.price == null) return false;
    const now = new Date();
    if (discounted.startDate && now < new Date(discounted.startDate)) return false;
    if (discounted.endDate && now > new Date(discounted.endDate)) return false;
    return true;
  };

  const discountActive = isDiscountActive();
  const effectivePrice = discountActive ? Number(discounted.price) : perUnitPrice;

  // Area inputs (sqft / roll / box)
  const [heightstate, setheightstate] = useState("");
  const [widthstate, setwidthstate] = useState("");
  // Length input
  const [lengthstate, setlengthstate] = useState("");
  // Weight input
  const [weightstate, setweightstate] = useState("");
  // Count input (pcs)
  const [countstate, setcountstate] = useState("");

  const [pricestate, setpricestate] = useState(0);
  const [originalPriceState, setOriginalPriceState] = useState(0);
  const [requiredQty, setRequiredQty] = useState(0);

  // Reset every input when switching to a different product/unitType/dimension,
  // so leftover values from a previous product/spec don't linger.
  useEffect(() => {
    setheightstate("");
    setwidthstate("");
    setlengthstate("");
    setweightstate("");
    setcountstate("");
    setpricestate(0);
    setOriginalPriceState(0);
    setRequiredQty(0);
  }, [unitType, priceData?._id, selectedDimension?._id]);

  useEffect(() => {
    let qty = 0;

    if (config.mode === "area") {
      // Height/width are entered directly in the unitType's own unit
      // (feet for sqft/roll/box), so no separate conversion factor is applied.
      const h = parseFloat(heightstate) || 0;
      const w = parseFloat(widthstate) || 0;
      const areaSqft = h * w;
      qty = config.coverage ? areaSqft / config.coverage : areaSqft;
    } else if (config.mode === "length") {
      qty = parseFloat(lengthstate) || 0;
    } else if (config.mode === "weight") {
      qty = parseFloat(weightstate) || 0;
    } else if (config.mode === "count") {
      qty = parseFloat(countstate) || 0;
    }

    if (config.roundUp && qty > 0) {
      qty = Math.ceil(qty);
    }

    const price = qty * effectivePrice;
    const originalPrice = qty * perUnitPrice;

    setRequiredQty(Number(qty.toFixed(2)));
    setpricestate(Number(price.toFixed(2)));
    setOriginalPriceState(Number(originalPrice.toFixed(2)));
  }, [heightstate, widthstate, lengthstate, weightstate, countstate, effectivePrice, perUnitPrice, unitType]);

  // Pushes the computed quantity into the same Redux slice the manual
  // +/- counter (IncDecCounter) uses, so "Add to Cart" actually reflects it.
  const handleUseQuantity = () => {
    if (requiredQty > 0) {
      dispatch(updateQuantity(Math.max(1, Math.ceil(requiredQty))));
    }
  };

  const inputClass =
    "input-field focus:outline-none w-full h-full ml-2 active:border-none";

  const renderInputs = () => {
    if (config.mode === "area") {
      return (
        <div className="dim flex flex-row">
          <div
            className="height border border-gray-300 w-1/2 p-2 flex flex-col"
            style={{ borderRadius: "10px 0px 0px 0px" }}
          >
            <h3 className="mb-2 ml-2 font-semibold">Height ({inputUnitLabel})</h3>
            <input
              value={heightstate}
              onChange={(e) => setheightstate(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
          <div
            className="width border border-gray-300 w-1/2 p-2 flex flex-col"
            style={{ borderRadius: "0px 10px 0px 0px" }}
          >
            <h3 className="mb-2 ml-2 font-semibold">Width ({inputUnitLabel})</h3>
            <input
              value={widthstate}
              onChange={(e) => setwidthstate(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
        </div>
      );
    }

    if (config.mode === "length") {
      return (
        <div
          className="border border-gray-300 w-full p-2 flex flex-col"
          style={{ borderRadius: "10px 10px 0px 0px" }}
        >
          <h3 className="mb-2 ml-2 font-semibold">Length ({inputUnitLabel})</h3>
          <input
            value={lengthstate}
            onChange={(e) => setlengthstate(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
          />
        </div>
      );
    }

    if (config.mode === "weight") {
      return (
        <div
          className="border border-gray-300 w-full p-2 flex flex-col"
          style={{ borderRadius: "10px 10px 0px 0px" }}
        >
          <h3 className="mb-2 ml-2 font-semibold">Weight ({inputUnitLabel})</h3>
          <input
            value={weightstate}
            onChange={(e) => setweightstate(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
          />
        </div>
      );
    }

    // count (pcs)
    return (
      <div
        className="border border-gray-300 w-full p-2 flex flex-col"
        style={{ borderRadius: "10px 10px 0px 0px" }}
      >
        <h3 className="mb-2 ml-2 font-semibold">Quantity ({inputUnitLabel})</h3>
        <input
          value={countstate}
          onChange={(e) => setcountstate(e.target.value)}
          type="number"
          min="0"
          step="1"
          className={inputClass}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="calculation-container sm">
        <div className="calc mr-4 mb-4 mt-4 flex-col">
          {renderInputs()}

          <div
            className="price border border-gray-300 w-full p-2 flex flex-col"
            style={{ borderRadius: "0px 0px 10px 10px" }}
          >
            <h3 className="mb-2 ml-2 font-semibold">Price</h3>
            <h2 className="ml-2 mb-2">
              ₹{pricestate}
              {discountActive && originalPriceState > pricestate && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  ₹{originalPriceState}
                </span>
              )}
              {requiredQty > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({requiredQty} {config.unitLabel} required)
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={handleUseQuantity}
              disabled={!requiredQty}
              className="mt-2 ml-2 self-start bg-black text-white text-sm px-4 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Use This Quantity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculation;