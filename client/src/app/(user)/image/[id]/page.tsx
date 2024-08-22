"use client";
import {
  addProductToCart,
  addProductToWishlist,
  clearSingleProductData,
  getSingleProduct,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/api";
import {} from "@/app/redux/feature/product/image/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCart2, BsCartCheckFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";

type ImageData = {
  title: string;
  imageUrl: string;
  author: string;
  authorUrl: string;
  downloadUrl: string;
};

const ImgageData: ImageData[] = [
  {
    title: "India Gate",
    imageUrl:
      "https://www.holidify.com/images/cmsuploads/compressed/5621259188_e74d63cb05_b_20180302140149.jpg", // Replace with actual image path
    author: "Oakland Images",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://media.istockphoto.com/id/515584593/photo/india-gate-in-new-dehli-at-dusk.jpg?s=612x612&w=0&k=20&c=btkX6MPrxi3WMVH2QkFyahBI9NDhTjNocn3XAK-KzSU=", // Replace with actual image path
    author: "Net Vector",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://media.istockphoto.com/photos/delhi-india-gate-illuminated-night-scene-picture-id475026038?k=6&m=475026038&s=612x612&w=0&h=gBaohKfHeYzCTU71l2OEsEmKM0wDCP9HSv0ZPP4HMPg=", // Replace with actual image path
    author: "Oakland Images",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://th.bing.com/th/id/OIP.K9vgcBWz8oyYeJC6FTgFRQHaE7?w=800&h=533&rs=1&pid=ImgDetMain", // Replace with actual image path
    author: "Net Vector",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://media.istockphoto.com/photos/india-gate-new-delhi-picture-id474330438?k=6&m=474330438&s=612x612&w=0&h=NCeRfk1RP58lqteIGUNIBAGG814mwAnC-zVlQiY3LIo=", // Replace with actual image path
    author: "Oakland Images",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://th.bing.com/th/id/OIP.Uciv4ZVzWmF81MVXBPQYaQHaE8?w=768&h=513&rs=1&pid=ImgDetMain", // Replace with actual image path
    author: "Net Vector",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://th.bing.com/th/id/OIP.j8gAZYUNYP9VZBUtITnCOgHaF7?w=600&h=480&rs=1&pid=ImgDetMain", // Replace with actual image path
    author: "Oakland Images",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "India Gate",
    imageUrl:
      "https://www.holidify.com/images/cmsuploads/compressed/5621259188_e74d63cb05_b_20180302140149.jpg", // Replace with actual image path
    author: "Net Vector",
    authorUrl: "#",
    downloadUrl: "#",
  },
];

const Home = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  console.log(selectedVariantId, "selectedVariantId");
  const params = useParams();
  const id = params.id as string | undefined;

  useEffect(() => {
    if (id) getSingleProduct(dispatch, id);
    return () => {
      clearSingleProductData(dispatch);
    };
  }, [id]);

  const dispatch = useAppDispatch();
  const {
    singleProduct: product,
    loading,
    cart,
  } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  const handleeWishlist = () => {
    if (!product || loading) return;

    if (product.isWhitelisted) {
      removeProductFromWishlist(dispatch, product._id);
    } else {
      addProductToWishlist(
        dispatch,
        product._id,
        selectedVariantId ? selectedVariantId : product.variants[0]._id
      );
    }
  };

  const handleCart = (variant: string) => {
    if (!product || loading) return;
    if (product.isInCart && isVariantInCart(variant)) {
      removeProductFromCart(dispatch, product._id);
    } else {
      addProductToCart(dispatch, product._id, variant);
    }
  };

  const isVariantInCart = (variantId: string) => {
    return cart.some((item) => item.variantId.includes(variantId));
  };

  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };

  return (
    <div className="main ">
      <div className="flex items-center gap-4 px-4 py-0.5 bg-white border border-gray-300 rounded-md w-[90%] m-auto mt-4">
        <button className="flex items-center gap-2 text-black hover:bg-gray-200 rounded-md">
          <img src="/asset/28-camera-1.svg" alt="" />
          <span>Photos</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <img src="/asset/Rectangle 15.png" alt="" />
        <input
          type="text"
          placeholder="Search for Photos"
          className="flex-grow  py-2 bg-gray-100 rounded-md "
        />
        <IoSearchOutline className="h-6 w-6 cursor-pointer text-gray-400" />
        <div className="lg:block md:block hidden">
        <button className="flex items-center gap-4 text-gray-500 hover:text-black  rounded-md">
          <img src="/asset/Rectangle 15.png" alt="" />
          <img src="/asset/Union.png" alt="" />
          <span>Search by image</span>
        </button>
        </div>
      </div>

      <div className=" m-auto mt-4 bg w-[90%] ">
        <div className="flex  m-auto lg:flex-row lg:justify-between sm:flex-col flex-col gap-1">
          <div className=" py-4">
            {product && (
              <div className="relative ">
                <div className="flex justify-between items-center">
                  <h1 className=" text-lg font-semibold">{product.title}</h1>
                  <div className="flex gap-2">
                    <button
                      onClick={handleeWishlist}
                      title={
                        product.isWhitelisted
                          ? "Remove from Saved"
                          : "Save Image"
                      }
                      className="flex gap-2 border py-1 items-center rounded bg-white px-3"
                    >
                      {product.isWhitelisted ? (
                        <IoMdHeart className="h-5 w-5 text-red-500" />
                      ) : (
                        <IoMdHeartEmpty className="h-5 w-5" />
                      )}
                      <span>{product.isWhitelisted ? "Saved" : "Save"}</span>
                    </button>

                    <button className="flex gap-2 border py-1 items-center rounded bg-white px-3">
                      <AiOutlineDownload />
                      <span>Try</span>
                    </button>
                  </div>
                </div>
                <img
                  src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
                  alt="Main Image"
                  className="lg:w-[56rem] md:w-[44rem] w-[27rem] h-[32rem] mt-2 rounded"
                />
                <div className="lg:w-[50rem] md:w-[35rem] w-[22rem] mt-2">
                  <h2 className="font-bold">Description</h2>
                  <p className="text-sm text-neutral-700">
                    Stock Photo ID: {product._id}
                  </p>
                  <p className="text-sm">{product.description}</p>
                </div>
              </div>
            )}
          </div>
          <div className="border  lg:w-[27rem] md:w-full w-[23rem] py-2 px-8 bg-white">
            {product && (
              <div>
                <h3 className="font-bold text-lg">Purchase a Licence</h3>
                <p className="text-sm mt-1 text-neutral-700">
                  All Royalty-Free licences include global use rights,
                  comprehensive protection, and simple pricing with volume
                  discounts available
                </p>
                {product.variants.map((license, index) => (
                  <div
                    key={index}
                    className="border p-4 mt-2 flex justify-between items-center hover:bg-[#F4F4F4] cursor-pointer"
                  >
                    <div>
                      <label
                        htmlFor={`license-${index}`}
                        className="block text-gray-600"
                      >
                        ${license.price}
                      </label>
                      <div>{license.size}</div>
                    </div>
                    <div className=" flex justify-between ">
                      {isVariantPurchased(license._id) ? (
                        <>
                          <div
                            title={"Purchased Product"}
                            className={` p-2 bg-red-500 text-white rounded-full`}
                          >
                            <BiSolidPurchaseTagAlt />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            title={
                              isVariantInCart(license._id)
                                ? "Remove from cart"
                                : "Add to cart"
                            }
                            className={` p-2 ${
                              isVariantInCart(license._id)
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
                            } rounded-full`}
                            onClick={() => handleCart(license._id)}
                          >
                            {product.isInCart ? (
                              <BsCartCheckFill />
                            ) : (
                              <BsCart2 />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  
                ))}
                <div className="flex justify-between mt-3">
                  {/* <div
                    title={
                      product.isInCart ? "Remove from cart" : "Add to cart"
                    }
                    className={` p-2 ${
                      product.isInCart
                        ? "bg-red-500 text-white"
                        : "bg-white text-black"
                    } rounded-full`}
                    onClick={handleCart}
                  >
                    {product.isInCart ? <BsCartCheckFill /> : <BsCart2 />}
                  </div> */}
                  {/* <div
                    onClick={handleeWishlist}
                    title={
                      product.isWhitelisted ? "Remove from Saved" : "Save Image"
                    }
                    className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center"
                  >
                    {product.isWhitelisted ? (
                      <IoMdHeart className="h-5 w-5 text-red-500" />
                    ) : (
                      <IoMdHeartEmpty className="h-5 w-5" />
                    )}
                    <p className="text-sm">
                      {" "}
                      {product.isWhitelisted ? "Saved" : "Save"}{" "}
                    </p>
                  </div> */}
                </div>
              </div>
            )}
            {/* pendeing */}
              
            <div className="py-6">
            {product && (
             <div className="bg-white p-4 border rounded-md w-full">
             <h2 className="text-lg font-semibold mb-4">Details</h2>
             <div className="space-y-2">
               <div className="flex lg:justify-start md:justify-between">
                 <span className="font-medium w-32">Title:</span>
                 <p className="text-blue-600 hover:underline">{product.title}</p>
               </div>
               <div className="flex  lg:justify-start md:justify-between">
                 <span className="font-medium w-32">Category:</span>
                 <p className="">{product.category}</p>
               </div>
               <div className="flex  lg:justify-start md:justify-between">
                 <span className="font-medium w-32">Upload date:</span>
                 <span>{new Date().toLocaleDateString()}</span>
               </div>
               <div className="flex  lg:justify-start md:justify-between">
                 <span className="font-medium w-32">Location:</span>
                 <span>India</span>
               </div>
               <div className="flex  lg:justify-start md:justify-between">
               <span className="font-medium w-32">Format: </span>
               <span className="text-sm text-neutral-600">6725 × 4286 px</span>
               </div>
             </div>
           </div>

            )}
            </div>
            
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="font-semibold text-lg">Similar Images</h1>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 mt-2">
          {ImgageData.map((data: any, index: number) => (
            <div key={index}>
              <div className="relative rounded-md overflow-hidden group cursor-pointer">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={data.imageUrl}
                    alt="Image"
                    className="w-full h-56 object-cover"
                  />
                </div>

                <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white px-2 py-2 rounded">
                   {data.title}
                  </p>
                </div>

                <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    title="Save Image"
                    className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-lg flex gap-1 items-center"
                  >
                    <CiHeart className="h-5 w-5" />
                    <p className="text-sm">Save</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white bg-black bg-opacity-50 px-2 py-2 flex items-center gap-1 rounded-lg">
                    <img src="/asset/Group 19.svg" alt="" />
                    <p className="text-small">Similar</p>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-2 bg-red-500 text-black rounded-full">
                    <FiDownload className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {product && (
          <div>
            <div className="mt-8">
              <h2 className="font-bold text-lg">Related keywords</h2>
              <div className="flex gap-3 mt-2">
                {product.tags.map((keyword, index) => (
                  <span key={index} className="">
                    <button className="border rounded-md py-1 px-4 flex gap-1 items-center">
                      <IoSearchOutline className="h-5 w-5" />
                      {keyword}
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 mb-3">
              <h1 className="font-semibold text-lg">Category</h1>
              <button className="border rounded-md py-1 px-4 mt-2">
                {product.category}
              </button>
              {/* <p>Upload date: {new Date().toLocaleDateString()}</p> */}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
