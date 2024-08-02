import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiDownload } from "react-icons/hi";

type Image = {
  image: string;
};

const ImageGallery = (data: Image) => {
  function truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  const text = "Pink macro image of a ranunculus flower";
  const truncatedText = truncateText(text, 6);

  return (
    <div className="relative rounded-md overflow-hidden group cursor-pointer">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={data.image}
          alt={`Image `}
          className="w-full h-72 object-cover"
        />
      </div>
      <div className="absolute top-0 left-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white  px-2 py-2 rounded">{truncatedText}</p>
      </div>
      <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center">
          <IoMdHeartEmpty className="h-5 w-5" />
          <p className="text-sm">Save</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white bg-black bg-opacity-50  px-2 py-2 flex items-center gap-1 rounded-3xl">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="4" width="16" height="3" fill="#fff" />
            <rect x="4" y="8" width="16" height="3" fill="#fff" />
            <rect x="4" y="12" width="16" height="8" fill="#fff" />
          </svg>
          <p className="text-small">Similar</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white bg-red-500  p-2 rounded-full ">
          <HiDownload className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
