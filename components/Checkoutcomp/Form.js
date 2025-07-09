"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, selectFormData } from "../Features/Slices/formSlice";
import ProfileContent from "../Cards/ProfileContent";
import Link from "next/link";
import Calender from "../Calenders/Calender";
import { selecteddbItems } from "../Features/Slices/cartSlice";
export default function Form() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const formData = useSelector(selectFormData);
  const dbItemset = useSelector(selecteddbItems);
  // console.log(dbItemset);
  // console.log(dbItemset);
  const deviceId = dbItemset.owner;
  const cartId = dbItemset._id;
  // something error in cartId

  const [form, setForm] = React.useState({
    first: "",
    last: "",
    add1: "",
    add2: "",
    add3: "",
    postal: "",
    local: "",
    state: "",
    country: "",
    email: "",
    number: "",
    pan: "",
    datetime: "",
  });
  // console.log(form);
  // function handlefunc(event) {
  //   setForm((prev) => {
  //     return {
  //       ...prev,
  //       [event.target.name]: event.target.value,
  //     };
  //   });
  // }

  // function handleData(event) {
  //   event.preventDefault();
  //   console.log(form);
  //   // updateFormData(form);
  //   router.push("/shipping");
  // }

  // function handlefunc(event) {
  //   // const { name, value } = event.target;
  //   setForm({ ...form, [event.target.name]: event.target.value });
  // }

  // Validation state for postal code and mobile number
  const [postalValidation, setPostalValidation] = React.useState("");
  const [numberValidation, setNumberValidation] = React.useState("");

  function handlefunc(event) {
    const { name, value } = event.target;

    if (name === "postal") {
      // Validate postal code
      const postalCode = parseInt(value, 10);

      if (isNaN(postalCode) || postalCode < 100000 || postalCode > 999999) {
        setPostalValidation("invalid");
      } else {
        setPostalValidation("valid");
      }
    } else if (name === "number") {
      // Validate mobile number
      const mobileNumber = parseInt(value, 10);

      if (isNaN(mobileNumber) || mobileNumber.toString().length !== 10) {
        setNumberValidation("invalid");
      } else {
        setNumberValidation("valid");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleData(event) {
    event.preventDefault();

    // Check validation before submitting the form
    if (postalValidation !== "valid" || numberValidation !== "valid") {
      return;
    }

    dispatch(updateFormData(form));
    // console.log(form);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ form, deviceId, cartId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log("Dataaaa", data);

        // if the API response is 200
        router.push(`/shipping`);
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      // Handle fetch or JSON parsing errors
      console.error("Error:", error);
    }
  }

  const incompleteForm =
    !form.first ||
    !form.last ||
    !form.add1 ||
    !form.postal ||
    !form.local ||
    !form.state ||
    !form.country ||
    !form.number;
  const buttonClass = incompleteForm
    ? "bg-gray-300 text-white"
    : "bg-black text-white";

  const searchParams = useSearchParams();
  // console.log(searchParams.get("search")); // Logs "search"
  const properties = searchParams.get("search");

  return (
    <>
      <form onSubmit={handleData} className="w-1/2">
        <h3 className="mt-12">Enter your name and address:</h3>
        <div className="mb-4">
          <label htmlFor="first" className="form-label relative"></label>
          <br />
          <input
            type="text"
            onChange={handlefunc}
            name="first"
            id="first"
            placeholder="first name"
            value={form.first}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md" //for controlled components
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last" className="form-label relative"></label>
          <br />
          <input
            type="text"
            onChange={handlefunc}
            name="last"
            placeholder="Last Name"
            value={form.last}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="add1" className="form-label relative"></label>
          <br />
          <input
            type="text"
            onChange={handlefunc}
            name="add1"
            placeholder="Address Line 1"
            value={form.add1}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md"
          />

          <h6 className="text-xs text-blue-600 ">
            We do not ship to P.O. boxes
          </h6>
        </div>
        <div className="mb-4">
          <label htmlFor="add2" className="form-label relative"></label>
          <br />
          <input
            type="text"
            onChange={handlefunc}
            name="add2"
            placeholder="Address Line 2"
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md"
            value={form.add2}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="add3" className="form-label relative"></label>
          <br />
          <input
            type="text"
            onChange={handlefunc}
            name="add3"
            placeholder="Address Line 3"
            value={form.add3}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md"
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div>
            <label htmlFor="postal" className="form-label relative"></label>
            <br />
            <input
              type="number"
              placeholder="Postal Code"
              pattern="[0-9]*"
              onChange={handlefunc}
              name="postal"
              max={999999}
              min={100000}
              value={form.postal}
              className={`px-5 form-input border border-gray-600 h-10 w-[37vw] rounded-md
              ${
                postalValidation === "invalid"
                  ? "border-red-500"
                  : postalValidation === "valid"
                  ? "border-green-500"
                  : "border-gray-600"
              }
              `}
            />
          </div>
          <div className="relative">
            <label htmlFor="local" className="form-label relative"></label>
            <br />
            <input
              type="text"
              placeholder="Locality"
              onChange={handlefunc}
              name="local"
              value={form.local}
              className="px-5 form-input border border-gray-600 h-10 w-[37vw] rounded-md"
            />
          </div>
        </div>
        <div className="mb-4 flex space-x-4">
          <div>
            <label htmlFor="local" className="form-label relative"></label>
            <br />
            <input
              type="text"
              onChange={handlefunc}
              placeholder="State/Territory"
              name="state"
              value={form.state}
              className="px-5 form-input border border-gray-600 h-10 w-[37vw] rounded-md"
            />
          </div>
          <div className="relative">
            <label htmlFor="country" className="form-label relative"></label>
            <br />
            <input
              type="text"
              onChange={handlefunc}
              placeholder="Country"
              name="country"
              value={form.country}
              className="px-5 form-input border border-gray-600 h-10 w-[37vw] rounded-md relative"
            />
          </div>
        </div>
        <br />
        <div className="mb-4">
          <h3>What's your contact information?</h3>
          <label htmlFor="email" className="form-label relative"></label>
          <br />
          <input
            type="email"
            placeholder="Email"
            onChange={handlefunc}
            name="email"
            value={form.email}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md "
          />

          <h6 className="text-xs w-[70vw]">
            A confirmation mail will be sent after checkout.
          </h6>
        </div>
        <div className="mb-4">
          <label htmlFor="number" className="form-label relative"></label>
          <br />
          <input
            type="number"
            pattern="[0-9]*"
            onChange={handlefunc}
            name="number"
            placeholder="Mobile Number"
            value={form.number}
            className={`px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md
            ${
              numberValidation === "invalid"
                ? "border-red-500"
                : numberValidation === "valid"
                ? "border-green-500"
                : "border-gray-600"
            }
            `}
          />

          <h6 className="text-xs w-[70vw]">
            A carrier might contact you to confirm delivery.
          </h6>
        </div>
        <div className="mb-4">
          <h3>What's your PAN?</h3>
          <label htmlFor="pan" className="form-label relative"></label>
          <br />
          <input
            type="text"
            placeholder="PAN"
            onChange={handlefunc}
            name="pan"
            value={form.pan}
            className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md"
          />

          <h6 className="text-xs w-[70vw]">
            Enter your PAN to enable payment with UPI,Net Banking or local card
            methods.
          </h6>
        </div>
        <br />
        <p className="my-4 text-xl">
          Please select you purchase mode here(select only one)
        </p>
        {properties === "freesample" || properties === "freedesign" ? (
          <div className="flex flex-row gap-5">
            <div
              onClick={() => setSelected("virtual")}
              className={`w-[250px] h-[250px] bg-gray-400 rounded-md text-center flex flex-col justify-around ${
                selected === "virtual"
                  ? " outline outline-offset-4 outline-black"
                  : ""
              }`}
            >
              <p className="text-2xl text-gray-500 font-semibold">
                Virtual Receive
              </p>
              <p>
                This service is <span className=" text-blue-500">free</span>
              </p>
              <p>
                You will receive mail to join in google meet and see the product
              </p>
            </div>
            <div
              onClick={() => setSelected("homedelivery")}
              className={`w-[250px] h-[250px] bg-gray-400 rounded-md text-center flex flex-col justify-around ${
                selected === "homedelivery"
                  ? "outline outline-offset-4 outline-black"
                  : ""
              }`}
            >
              <p className="text-2xl text-gray-500 font-semibold">
                Home Delivery
              </p>
              <p>Free upto 5km from our shop center</p>
              <p>You have to pay minimum ₹300 Rupees </p>
              <p></p>
            </div>
          </div>
        ) : null}

        {(properties === "sample" ||
          properties === "freesample" ||
          properties === "freedesign") && (
          <div className="my-4">
            <h1 className="text-xl mb-8">Schedule your order here</h1>
            {/* <label htmlFor="datetime" className="form-label relative"></label>
            <br />
            <input
              type="datetime-local"
              placeholder="datetime"
              onChange={handlefunc}
              name="datetime"
              value={form.datetime}
              required
              className="px-5 form-input border border-gray-600 h-10 sm:w-96 w-[70vw] rounded-md "
            /> */}
            <Calender />
          </div>
        )}

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={form.value}
            name="isForm"
            onChange={handlefunc}
            required
            className="mr-2"
          />
          <span>
            <h6 className="text-xs w-[70vw]">
              I have read and consent to eShopWorld processing my info in
              accordance with the &nbsp;
              <Link
                href="/customerservice/privacypolicy"
                className="text-blue-500"
              >
                Privacy Statement
              </Link>{" "}
              and &nbsp;
              <Link
                href="/customerservice/returnpolicy"
                className="text-blue-500"
              >
                Cookie Policy
              </Link>
              . "eShopWorld is a trusted Nike partner".
            </h6>
          </span>
        </div>
        <br />

        {/* <Link
          href={{
            pathname: "/shipping",
          }}
        > */}
          <button
            disabled={incompleteForm}
            className={`mt-4 bg-black text-white py-2 px-4 rounded-full sm:w-96 w-[70vw] ${buttonClass} `}
          >
            Continue
          </button>
        {/* </Link> */}
      </form>
      <br />
      <br />
      <hr className="w-1/2" />
    </>
  );
}
