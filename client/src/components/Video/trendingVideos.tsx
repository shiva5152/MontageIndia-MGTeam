"use client";
import { TCustomerProduct } from "@/types/product";
import React, { useState } from "react";
import { BsCartCheckFill, BsCart2 } from "react-icons/bs";
import { GoVideo } from "react-icons/go";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { TfiDownload } from "react-icons/tfi";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  getVideo,
  addVideoToCart,
  addVideoToWishlist,
  removeVideoFromWishlist,
  removeVideoFromCart,
} from "@/app/redux/feature/product/video/api";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import { Spinner } from "@nextui-org/react";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { downloadProduct } from "@/app/redux/feature/product/api";

const Trending = ({ data }: { data: TCustomerProduct }) => {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    await downloadProduct(dispatch, data.publicKey, data.title);
    setLoading(false);
  };
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.play();
    }
  };
  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
    }
  };
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleeWishlist = () => {
    if (data.isWhitelisted) {
      removeVideoFromWishlist(dispatch, data._id);
    } else {
      addVideoToWishlist(dispatch, data._id, data.variants[0]._id);
    }
  };

  const handleCart = () => {
    if (data.isInCart) {
      removeVideoFromCart(dispatch, data._id);
    } else {
      addVideoToCart(dispatch, data._id, data.variants[0]._id);
    }
  };

  return (
    <div
      className="relative rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/video/${data?.uuid}`)}

    >
      <div className="aspect-w-1 aspect-h-1"
      >
        <video loop muted className="w-full h-64 object-cover">
          <source
            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${data.thumbnailKey}`}
          />
        </video> 
      </div>
      <div className="absolute  justify-center  top-1 left-1 gap-1 flex flex-row text-white m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300">
        <span className=" pt-1 "><img src="/asset/video.svg"  alt="Hd "/></span> 
      <span className=" pt-[2px]">|</span>
      <span className="px-1 items-center text-start flex ">{capitalizeFirstLetter(data.title)}</span>
      </div>
      <div className="absolute bottom-1 right-9 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300">
        <div
          onClick={handleeWishlist}
          title={data.isWhitelisted ? "Remove from Saved" : "Save Image"}
          className="text-white bg-black bg-opacity-35 px-2 py-1 rounded-full flex gap-1 items-center"
        >
          {data.isWhitelisted ? (
            <IoMdHeart className="h-6 w-5 text-red-500" />
          ) : (
            <FaRegHeart  className="h-6 w-5" />
          )}
          {/* <p className="text-sm"> {data.isWhitelisted ? "" : ""} </p> */}
        </div>
      </div>
      <div
        onClick={handleDownload}
        className="absolute bottom-1 right-0 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="text-white bg-red-500 p-2 flex items-center gap-1 rounded-full">
          {!loading ? (
            <>
              <TfiDownload className="font-semibold" />
            </>
          ) : (
            <Spinner label="" color="current" />
          )}
        </div>
      </div>
      <div className="absolute bottom-1 right-20 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!data.isPurchased ? (
          <div
            title={data.isInCart ? "Remove from cart" : "Add to cart"}
            className={` p-2 ${
              data.isInCart ? "bg-red-500 text-white" : "bg-white text-black"
            } rounded-full`}
            onClick={handleCart}
          >
            {data.isInCart ? <BsCartCheckFill /> : <BsCart2 />}
          </div>
        ) : (
          <div
            title={"Purchased Product"}
            className={` p-2 bg-red-500 text-white rounded-full`}
          >
            <BiSolidPurchaseTagAlt />
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
