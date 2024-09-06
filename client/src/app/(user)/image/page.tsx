"use client";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/Home/homeImage";
import { Product } from "@/types/order";
import instance from "@/utils/axios";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { getImage } from "@/app/redux/feature/product/image/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setImagePage } from "@/app/redux/feature/product/slice";
import { IoSearchOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";

const Page = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = searchParams.get("searchTerm") || "";
  const categoryParam = category ? ["editor choice"] : "";

  const [loading, setloading] = useState(false);
  const {
    imageData: product,
    imagePage,
    totalImageData,
    totalImageNumOfPage,
  } = useAppSelector((state) => state.product);

  const handlePageChange = (page: number) => {
    // console.log(page);
    dispatch(setImagePage(page));
  };
  const handleNextPage = () => {
    handlePageChange(imagePage === totalImageNumOfPage ? 1 : imagePage + 1);
  };
  const handlePrevPage = () => {
    handlePageChange(imagePage === 1 ? totalImageNumOfPage : imagePage - 1);
  };

  const { user } = useAppSelector((state) => state.user);

  const fetchData = async (page: number) => {
    setloading(true);
    const response = await getImage(dispatch, !!user, {
      page: imagePage,
      productsPerPage: 10,
      mediaType: ["image"],
      searchTerm,
      category: categoryParam,
    });
    setloading(false);
  };

  useEffect(() => {
    fetchData(imagePage);
    return () => {
      clearKeywords(dispatch);
    };
  }, [imagePage, searchParams]);

  return (
    <>
      <Searchbar />

      <div className="main items-center">
        {/* Trending Videos */}
        <div className="bg-[#eeeeee]">
          <div className="py-10 lg:mx-4 xl:mx-24 md:mx-4 mx-4">
            <h1 className="text-2xl font-bold  text-start">
              Today's Trending Images
            </h1>
            <h4 className="text-lg text-neutral-700">
              {totalImageData} Product stock Photos and High-res Pictures
            </h4>
            <div className="mx-auto mt-4">
              {loading ? (
                <div className="justify-center text-center m-auto">
                  <Spinner label="Loading..." color="danger" />
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 mt-2 relative">
                  {product.length > 0 ? (
                    product.map((data) => (
                      <ImageGallery key={data._id} data={data} />
                    ))
                  ) : (
                    <p>No Images found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalImageNumOfPage > 1 && (
          <div className="flex justify-center items-center gap-4 my-4">
            <Button
              size="sm"
              type="button"
              disabled={currentPage === 1}
              variant="flat"
              className={`${
                currentPage === 1
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-webred"
              } bg-webred text-white rounded-full font-bold`}
              onPress={handlePrevPage}
            >
              Prev
            </Button>
            <Pagination
              color="success"
              classNames={{
                item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
                cursor:
                  "bg-webred hover:bg-red text-white rounded-full font-bold",
              }}
              total={totalImageNumOfPage}
              page={imagePage}
              onChange={handlePageChange}
              initialPage={1}
            />

            <Button
              type="button"
              size="sm"
              disabled={currentPage === totalPages}
              variant="flat"
              className={`${
                currentPage === totalPages
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-webred"
              } bg-webred text-white rounded-full font-bold`}
              onPress={handleNextPage}
            >
              Next
            </Button>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Page;
