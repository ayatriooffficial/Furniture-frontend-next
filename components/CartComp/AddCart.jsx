"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRoomData } from "../Features/Slices/roomSlice";
import {
  selectQuantity,
  updateQuantity,
} from "../Features/Slices/calculationSlice";
import { selecteddbItems, setDbItems } from "../Features/Slices/cartSlice";
import Link from "next/link";
import axios from "axios";
import Emptycart from "./EmptyCart";
import CartProduct from "./Main/CartProduct";
import { removeFromCart } from "@/tag-manager/events/remove_from_cart";
import { isUserAuth } from "@/actions/isUserAuth";
import {
  addAppliedOffer,
  selectAppliedOffers,
  selectBankDiscountedAmount,
  selectOtherApplicableExternalOffers,
  selectSelectedBank,
  setOtherApplicableExternalOffers,
  setSumTotalPrice,
} from "@/components/Features/Slices/externalOfferSlice";

const AddCart = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector((state) => state.rooms.selectedActivity);
  const roomData = useSelector(selectRoomData);
  
  const quantity = useSelector(selectQuantity);
  // const [cartdata, setcartdata] = useState("");
  const [cartStatus, setCartStaus] = useState("");
  const dbItems = useSelector((state) => state.cart.dbItems);

  const cartdata = useSelector(selecteddbItems);
  // console.log(cartdata)
  // console.log()
  // #####################My Code
  const [userId, setUserId] = useState(null);
  const otherApplicableExternalOffers = useSelector(
    selectOtherApplicableExternalOffers
  );
  const bankDiscountedAmount = useSelector(selectBankDiscountedAmount);
  const selectedBank = useSelector(selectSelectedBank);
  const appliedExternalOffers = useSelector(selectAppliedOffers);

  //############### my logic pieces
  useEffect(function () {
    async function getUserId() {
      try {
        const userId = await isUserAuth();

        setUserId(userId);
      } catch (error) {
        // console.log("Error while fetching userId");
      }
    }

    getUserId();
  }, []);

  // ##########################

  let id;
  if (typeof window !== "undefined") {
    id = localStorage.getItem("deviceId");
    
  }

  useEffect(() => {
    // console.log("Updated cartdata", cartdata);
    // console.log("Updated cartStatus", cartStatus);
  }, [cartdata, cartStatus]);

  let totalPrice = 0;
  let quantities = 0;

  let totalServicesPrice = 0;

  if (cartdata) {
    totalServicesPrice = cartdata.items.reduce((total, item) => {
      const serviceTotalCost = item.selectedServices.reduce(
        (serviceTotal, service) =>
          serviceTotal + parseFloat(service.cost * service.quantity),
        0
      );
      return total + serviceTotalCost;
    }, 0);
  }

  // console.log(cartdata);

  // console.log(totalServicesPrice);

  let totalAccessoryPrice = 0;

  if (cartdata) {
    totalAccessoryPrice = cartdata.items.reduce((total, item) => {
      const serviceTotalCost = item.selectedAccessories.reduce(
        (serviceTotal, service) =>
          serviceTotal + parseFloat(service.perUnitPrice * service.quantity),
        0
      );
      return total + serviceTotalCost;
    }, 0);
  }

  // console.log(totalAccessoryPrice);

  let SumtotalPrice = 0;

  // console.log(cartdata);

  if (cartdata) {
    SumtotalPrice = cartdata.items.reduce((total, item) => {
      const serviceTotalCost = item.selectedServices.reduce(
        (serviceTotal, service) =>
          serviceTotal + parseFloat(service.cost * service?.quantity),
        0
      );
      const accessoriesTotalCost = item.selectedAccessories.reduce(
        (accessoryTotal, accessory) =>
          accessoryTotal +
          parseFloat(accessory.totalPrice * accessory?.quantity),
        0
      );
      const itemTotalPrice =
        (item.price + serviceTotalCost + accessoriesTotalCost) * item.quantity;
      return total + itemTotalPrice;
    }, 0);
  }

  dispatch(setSumTotalPrice(SumtotalPrice));

  if (cartdata && cartdata.items) {
    totalPrice = cartdata.items.reduce((total, item) => {
      return total + (item?.price || 0) * (item?.quantity || 0);
    }, 0);
    quantities = cartdata.items.reduce((total, item) => {
      return total + (item?.quantity || 0);
    }, 0);
  }

  //my Code##############
  useEffect(
    function () {
      async function getExtoffersApplicablePrice() {
        // My Code################
        //check any offer applicable price
        
        if (userId && !otherApplicableExternalOffers) {
          //if user is registered
          // check fro first and second purcahse offer

          const externalOfferPriceResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getExternalOfferApplicablePrice/${userId}/${SumtotalPrice}`
          );
          const externalOffersData = await externalOfferPriceResponse.json();
          // console.log("externalOffersData");
          // console.log(externalOffersData);

          if (
            externalOfferPriceResponse.ok &&
            externalOfferPriceResponse.status === 200
          ) {
            const data = externalOffersData;
            dispatch(setOtherApplicableExternalOffers(data));
            if (data.discountedAmount > 0) {
              dispatch(addAppliedOffer(data.message));
            }
          }
        }
        //##########################
      }

      if (userId && SumtotalPrice > 0 && !otherApplicableExternalOffers)
        getExtoffersApplicablePrice();
    },
    [userId, SumtotalPrice]
  );

  //#####################

  const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`;
  const postData = {
    deviceId: id,
    productId: roomData._id,
    quantity: quantity,
  };

  const quantityCart = useSelector(selectQuantity);

  const handleDelete = async (itemid) => {
 
    try {
      const response = await axios.delete(postUrl, {
        params: {
          owner: id,
          productId: itemid,
        },
      });

      // console.log(response.data);

      if (response.status !== 200) {
        console.error("HTTP status", response.status);
      }

      const updatedItems = cartdata.items.filter(
        (item) => item.productId._id !== itemid
      );

      // Check if there are no items left
      if (updatedItems.length === 0) {
        // If no items left, update state to indicate an empty cart
        setcartdata(null); // or set to an empty object depending on your state structure
      } else {
        // If items are left, update the state with remaining items
        setcartdata((prevstate) => ({
          ...prevstate,
          items: updatedItems,
        }));
      }

      dispatch(setDbItems(response.data));
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  // console.log(cartdata);

  const handleItemDelete = async (productId) => {
    removeFromCart({
      item: cartdata?.items?.find?.((item) => item.productId._id === productId)
        ?.productId,
    });

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
        {
          params: {
            owner: id,
            productId: productId,
          },
        }
      );
      if (response.status === 200) {
        setCartStaus("succeeded");
        // console.log(responce.data)
        // fetchData();
        // dispatch(setDbItems(response.data));
        dispatch(setDbItems(response.data));
      }
    } catch (error) {
      setCartStaus("failed");
      console.error("Error while deleting product:", error);
    }
  };

  async function updateQuantityInDatabase(productId, quantity) {
    const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`;
    const postData = {
      deviceId: id,
      productId: productId,
      quantity: quantity,
    };
    try {
      const response = await axios.put(postUrl, postData);
      if (response.status === 200) {
        // fetchData();
        setCartStaus("succeeded");
        dispatch(setDbItems(response.data));
      }

      // Reload cart data after updating quantity in the database
    } catch (error) {
      // setloading("failed");
      setCartStaus("failed");
      console.error("Error updating quantity in database:", error);
    }
  }

  function handleItemIncr(productId, quantity) {
    let quant = quantity + 1;
    updateQuantityInDatabase(productId, quant);
  }

  function handleItemDecr(productId, quantity) {
    let quant = quantity - 1;
    if (quant < 1) {
      handleItemDelete(productId);
    }
    updateQuantityInDatabase(productId, quant);
  }

  const updateServiceQuantity = async (productId, serviceId, Quant) => {
    const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/service/quantity`;
    const postData = {
      deviceId: id,
      productId: productId,
      serviceId: serviceId,
      quantity: Quant,
    };

    try {
      const response = await axios.post(postUrl, postData);
      if (response.status === 200) {
        // fetchData();
        setCartStaus("succeeded");
        dispatch(setDbItems(response.data));
      }
      // Reload cart data after updating quantity in the database
    } catch (error) {
      // setloading("failed");
      setCartStaus("failed");
      console.error("Error updating quantity in database:", error);
    }
  };

  const handleServiceIncrease = (productId, serviceId, quantity) => {
    let Quant = quantity + 1;
    updateServiceQuantity(productId, serviceId, Quant);
  };

  const handleServiceDecrease = (productId, serviceId, quantity) => {
    let Quant = quantity - 1;
    if (Quant > 0) {
      updateServiceQuantity(productId, serviceId, Quant);
    }
  };

  const updateAccessoryQuantity = async (productId, accessoryId, Quant) => {
    const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/accessory/quantity`;
    const postData = {
      deviceId: id,
      productId: productId,
      accessoryId: accessoryId,
      quantity: Quant,
    };
    // console.log(postData);
    try {
      const response = await axios.post(postUrl, postData);
      // console.log(response.data);
      if (response.status === 200) {
        // fetchData();
        dispatch(setDbItems(response.data));
        // setcartdata(response.data)
        setCartStaus("succeeded");
      }
      // Reload cart data after updating quantity in the database
    } catch (error) {
      // setloading("failed");
      setCartStaus("failed");
      console.error("Error updating quantity in database:", error);
    }
  };

  const handleAccessoriesIncrease = (productId, accessoryId, quantity) => {
    let Quant = quantity + 1;
    updateAccessoryQuantity(productId, accessoryId, Quant);
  };
  const handleAccessoriesDecrease = (productId, accessoryId, quantity) => {
    let Quant = quantity - 1;
    if (Quant > 1) {
      updateAccessoryQuantity(productId, accessoryId, Quant);
    }
  };

  return (
    <main className="px-[67px]">
      <section
        className="main-cart flex sm:flex-row flex-col justify-between gap-10 sm:items-start items-center min-h-screen relative top-32 pb-20"
        aria-label="Cart and order summary"
        data-component="cart-section"
      >
        <section
          className="flex-1"
          aria-label="Bag items"
          data-component="cart-items"
        >
          <h1 className="text-xl font-semibold mb-6">Bag</h1>
          {cartdata && cartdata?.items?.length > 0 ? (
            <>
              {cartdata.items.map((item) => (
                <div
                  key={item.productId._id}
                  data-component="cart-item"
                  aria-label={`Cart item: ${
                    item.productId?.productTitle || ""
                  }`}
                >
                  <CartProduct
                    cartItem={item}
                    handleItemDelete={handleItemDelete}
                    handleItemIncr={handleItemIncr}
                    handleItemDecr={handleItemDecr}
                    handleServiceIncrease={handleServiceIncrease}
                    handleServiceDecrease={handleServiceDecrease}
                    handleAccessoriesIncrease={handleAccessoriesIncrease}
                    handleAccessoriesDecrease={handleAccessoriesDecrease}
                  />
                </div>
              ))}
            </>
          ) : (
            <Emptycart />
          )}
        </section>

        {cartdata && cartdata?.items?.length > 0 && (
          <section
            className="right-cart flex flex-col sm:w-1/3 w-[90vw] p-4"
            aria-label="Order summary"
            data-component="order-summary"
          >
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="subtotal flex justify-between items-center mb-3 opacity-70">
              <div className="text-base">Product price</div>
              <div className="text-base font-bold flex">
                <Image
                  src="/icons/indianrupeesicon.svg"
                  width={20}
                  height={20}
                  alt="rupees"
                  loading="lazy"
                />
                {totalPrice}
              </div>
            </div>
            <div className="subtotal flex justify-between items-center mb-3 opacity-70">
              <div className="text-base">Services price</div>
              <div className="text-base font-bold flex">
                <Image
                  src="/icons/indianrupeesicon.svg"
                  width={20}
                  height={20}
                  alt="rupees"
                  loading="lazy"
                />
                {totalServicesPrice}
              </div>
            </div>
            <div className="subtotal flex justify-between items-center mb-3 opacity-70">
              <div className="text-base">Accessories price</div>
              <div className="text-base font-bold flex">
                <Image
                  src="/icons/indianrupeesicon.svg"
                  width={20}
                  height={20}
                  alt="rupees"
                  loading="lazy"
                />
                {totalAccessoryPrice}
              </div>
            </div>
            {userId && (
              <>
                <div className="flex items-center justify-between ">
                  <span className="text-black">External offer </span>
                  <div className="text-black font-[700]">
                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        <span>&minus;</span>
                        <Image
                          loading="lazy"
                          src="/icons/indianrupeesicon.svg"
                          width={18}
                          height={18}
                          alt="rupees"
                          className="mr-1"
                        />
                      </div>
                      {otherApplicableExternalOffers
                        ? otherApplicableExternalOffers?.discountedAmount +
                          bankDiscountedAmount
                        : bankDiscountedAmount}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#767677] pb-3">
                  {selectedBank.length > 0 ||
                  otherApplicableExternalOffers?.discountedAmount > 0 ? (
                    <ul>
                      {appliedExternalOffers.map((offer, ind) => (
                        <li key={offer + ind}>{offer}</li>
                      ))}
                    </ul>
                  ) : (
                    <>No offers applied</>
                  )}
                </p>
              </>
            )}
            <div className="deliveryCharges flex justify-between items-center mb-4 opacity-70">
              <div className="text-base">Delivery Charges</div>
              <div className="text-base font-bold flex">
                <span>-</span>
              </div>
            </div>
            <hr className="my-4 border-black border-[1px]" />
            <div className="total flex justify-between items-center mb-6">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-3xl font-semibold flex">
                <Image
                  src="/icons/indianrupeesicon.svg"
                  width={25}
                  height={25}
                  alt="rupees"
                  loading="lazy"
                />
                {otherApplicableExternalOffers
                  ? SumtotalPrice -
                    bankDiscountedAmount -
                    otherApplicableExternalOffers.discountedAmount
                  : SumtotalPrice - bankDiscountedAmount}
              </div>
            </div>
            <div className="text-sm mb-4">Quantity: {quantities}</div>
            {!userId && (
              <Link
                href={{ pathname: "/checkout", query: { search: "cart" } }}
                className="memberCheckout my-4 flex items-center justify-center"
              >
                <button className="bg-black text-white w-full sm:w-[40vw] sm:h-14 h-9 rounded-full hover:bg-gray-900 transition duration-300">
                  Guest Checkout
                </button>
              </Link>
            )}
            <Link
              href={{ pathname: "/checkout", query: { search: "cart" } }}
              className="memberCheckout my-4 flex items-center justify-center"
            >
              <button className="bg-black text-white w-full sm:w-[40vw] sm:h-14 h-9 rounded-full hover:bg-gray-900 transition duration-300">
                Member Checkout
              </button>
            </Link>
          </section>
        )}
      </section>

      <section
        className="middle-cart"
        aria-label="Recently selected items"
        data-component="recently-selected"
      >
        {selectedItems &&
          Object.values(selectedItems).map((item) => (
            <div key={item.id} className="cartitem flex mb-6 border-b pb-4">
              <div className="img w-48 h-48 mr-8">
                <img
                  src={item?.image}
                  className="w-full h-full object-cover rounded-md"
                  alt={item?.title}
                />
              </div>
              <div className="cartContent flex flex-col justify-between">
                <div className="mainright">
                  <div className="leftContent flex flex-col">
                    <h2 className="sm:text-xl text-lg sm:font-semibold font-medium mb-2">
                      {item?.title}
                    </h2>
                    <h3 className="text-gray-600">{item?.category}</h3>
                  </div>
                  <div className="flex rightContent sm:text-xl text-lg sm:font-semibold font-medium">
                    <Image
                      src="/icons/indianrupeesicon.svg"
                      width={20}
                      height={15}
                      alt="rupees"
                      loading="lazy"
                    />
                    {item?.price}
                  </div>
                  <div className="icons flex items-center space-x-2 mt-4 justify-around">
                    <img
                      src="/icons/delete icon.svg"
                      alt="delete"
                      className="w-6 h-6 hover:text-slate-500 cursor-pointer"
                    />
                    <img
                      src="/icons/info.svg"
                      alt="info"
                      className="text-red-700 hover:text-red-500 cursor-pointer w-6 h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
};

export default AddCart;
