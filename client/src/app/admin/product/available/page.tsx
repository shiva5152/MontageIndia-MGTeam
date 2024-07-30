"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import instance from "@/utils/axios";
import { Spinner } from "@nextui-org/react";
import Multiselect from 'multiselect-react-dropdown';
import {categoriesOptions, mediaTypesOptions} from "../../../../utils/tempData";


// Define the interfaces for the product and variant types
interface Variant
{
  label: string;
  price: number;
  key: string;
}

interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  publicKey: string;
  category: string;
  thumbnailKey: string;
  id: string;
}

const availableProductsPage: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [SearchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);


  const onSelectCategory = (selectedList: string[]) => {
    setSelectedCategories(selectedList);
  };

  const onRemoveCategory = (selectedList: string[]) => {
    setSelectedCategories(selectedList);
  };

  const onSelectMediaType = (selectedList: string[]) => {
    setSelectedMediaTypes(selectedList);
  };

  const onRemoveMediaType = (selectedList: string[]) => {
    setSelectedMediaTypes(selectedList);
  };

  const showAllProducts = async () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedMediaTypes([]);
    fetchProduct();
  }
  // fetch data from Server
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/product`, {
        params: {productsPerPage, page: currentPage, status: 'available', category: selectedCategories, mediaType: selectedMediaTypes, searchTerm: SearchTerm },
        withCredentials: true,
      } );
      console.log(response.data)
      setProductData(response.data.products);
      setTotalPages(response.data.numOfPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [currentPage, productsPerPage] );
  
  // Handler to change page
  const handlePageChange = ( page: number ) =>
  {
    setCurrentPage( page );
  };

  // display words function
  function truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  // Get products for the current page
  const currentProducts = productData;

  return (
    <div className="container p-4  ">

      <div className="flex justify-between items-center my-6">
       <input
          type="text"

          placeholder="Search products"
          value={SearchTerm}
          onChange={( e ) => setSearchTerm( e.target.value )}
          className="border rounded px-4 py-2 w-full max-w-sm"
        />
        <h1 className="bg-webgreen text-white px-4 py-2 rounded ml-2">
          Available Product
        </h1>
      </div>
      <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
        <div className="flex justify-start items-center flex-wrap gap-4">
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="category"
            style={{
              chips: {
                background: '#BEF264'
              },
              searchBox: {
                background: 'white',
                border: '1px solid #e5e7eb',
              },
            }}
            options={categoriesOptions.map((option) => ({ name: option }))} 
            selectedValues={selectedCategories.map((category) => ({ name: category }))}
            onSelect={(selectedList) => onSelectCategory(selectedList.map((item:any) => item.name))} 
            onRemove={(selectedList) => onRemoveCategory(selectedList.map((item:any) => item.name))} 
            showCheckbox
            displayValue="name" 
          />
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="media type"
            options={mediaTypesOptions.map((option) => ({ name: option }))} 
            selectedValues={selectedMediaTypes.map((type) => ({ name: type }))}
            onSelect={(selectedList) => onSelectMediaType(selectedList.map((item:any) => item.name))} 
            onRemove={(selectedList) => onRemoveMediaType(selectedList.map((item:any) => item.name))} 
            showCheckbox
            displayValue="name" 
            style={{
              chips: {
                background: '#BEF264'
              },
              searchBox: {
                background: 'white',
                border: '1px solid #e5e7eb',
              }
            }}
          />
          <button className="bg-webgreen text-white px-4 py-2 rounded" onClick={fetchProduct}>
            Search
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={showAllProducts}>
            Show All
          </button>
        </div>
       <div>
          <select className="border rounded px-4 py-2" value={productsPerPage} onChange={(e) => setProductsPerPage(parseInt(e.target.value))}>
            <option value="6" >6 Data per page</option>
            <option value="12">12 Data per page</option>
            <option value="24">24 Data per page</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                <input type="checkbox" />
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Product
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Media Type
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                category
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Description
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <Spinner label="Loading..." color="success" />
                </td>
              </tr>
            ) : (
              currentProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input type="checkbox" />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        { prod.mediaType === "image" && (
                          <img
                            className="w-10 h-10 rounded object-cover"
                            src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }`}
                        alt={ prod.title }
                          />
                        )}
                        { prod.mediaType === "audio" && (
                          <audio className="w-40 h-20" controls>
                            <source
                              src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }`}
                            type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) }
                        { prod.mediaType === "video" && (
                          <video width="100" height="100" controls>
                            <source
                              src={` https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }`}
                            type="video/mp4"
                            />
                            Your browser does not support the video element.  
                          </video>
                        ) }
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          { prod.title }
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-50 bg-green-200 rounded-full"
                      ></span>
                      <span className="relative">{prod.mediaType}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {prod.category}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 ">
                      {truncateText(prod.description, 3)}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Link
                        href={`productEdit/${prod._id}`}
                        className="bg-slate-200 px-6 py-0.5 flex items-center rounded-lg"
                      >
                        Details
                      </Link>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex  items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Pre
        </button>
        <div className="flex">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1
                  ? "bg-webgreen text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default availableProductsPage;