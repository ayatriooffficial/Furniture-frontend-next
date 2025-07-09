"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  addAppliedOffer,
  selectBanks,
  selectSelectedBank,
  selectSumTotalPrice,
  setBankDiscount,
  setBanks,
  setSelectedBank,
} from "@/components/Features/Slices/externalOfferSlice";

function BankDiscountOptions() {
  // const [banks, setBanks] = useState([]);
  const dispatch = useDispatch();
  const banks = useSelector(selectBanks);
  const [loading, setLoading] = useState(false);
  const selectedBank = useSelector(selectSelectedBank);
  const sumTotalPrice = useSelector(selectSumTotalPrice);

  const handleChange = (event) => {
    dispatch(setSelectedBank(event.target.value));
    const chosenBank = banks.find((bank) => event.target.value === bank.bankId);
    dispatch(
      setBankDiscount(
        chosenBank?.discountType ?? "fixed",
        chosenBank?.discountValue ?? 0
      )
    );
    dispatch(addAppliedOffer("Bank offer applied"));
  };

  useEffect(function () {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBankOffers`
        );
        // console.log(response.data);
        dispatch(setBanks(response.data.bankOffers));
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!banks.length) fetchBanks();
  }, []);
 
  return (
    <div className="mt-5   border border-slate-500 p-[10px] lg:p-[20px] w-[100%] lg:w-[100%] h-auto">
      <p className="text-black font-[600]">Avail Extra Discount</p>
      <p className="text-[#757575] text-[12px] pt-[5px]">
        Avail extra discounts by paying through the following bank accounts:
      </p>
      <div className="pt-[10px]">
        {loading ? (
          // Loader
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          banks.map((bank) => (
            <label
              className="flex flex-col items-start pb-[10px]"
              key={bank.bankId}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  disabled={
                    bank.minimumPurchase &&
                    sumTotalPrice < bank.minimumPurchase
                  }
                  value={bank.bankId}
                  checked={selectedBank === bank.bankId}
                  onChange={handleChange}
                  className="mr-[10px]"
                />
                <span className="text-black font-medium">{bank.title}</span>
              </div>
              <p className="text-[#757575] text-[12px] pl-[25px]">
                {bank.description}
              </p>
              <p className="text-[#333] text-[12px] font-semibold pl-[25px]">
                Discount:{" "}
                {bank.discountType === "fixed" ? (
                  <>₹{bank.discountValue}</>
                ) : (
                  <>{bank.discountValue}%</>
                )}
                {bank.minimumPurchase && (
                  <span className="text-[#757575]">
                    {" "}
                    (Min Purchase: ₹{bank.minimumPurchase})
                  </span>
                )}
              </p>
            </label>
          ))
        )}
      </div>
      {!loading && (
        <p className="text-black font-[600] pt-[10px]">
          Selected Bank: {selectedBank || "None"}
        </p>
      )}
    </div>
  );
}

export default BankDiscountOptions;
