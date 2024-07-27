"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { product } from "../../../../db";

export interface Variant {
  label: string;
  price: number;
  key: string;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
}

const ProductDetail: React.FC = () => {
  const params = useParams();
  const [productDetail, setProductDetail] = useState<Product | null>(null);

  const id = params.id as string | undefined;
  

  useEffect(() => {
    if (id) {
      const foundProduct = product.find((prod: any) => prod.id === id);
      setProductDetail(foundProduct );
    }
  }, [id]);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center">Edit Product</h1>
      <div className="mt-2 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={productDetail.title}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={productDetail.description}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                rows={5}
                readOnly
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                Media
              </label>
              <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                <img
                  className="w-full h-64 object-cover"
                  src={productDetail.thumbnailKey}
                  alt={productDetail.title}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Pricing
              </label>
              <input
                type="number"
                value={productDetail.variants[0]?.price}
                className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                id="variation"
                type="checkbox"
                className="mr-2"
                checked={productDetail.variants.length > 1}
                readOnly
              />
              <label className="block text-gray-700 text-sm" htmlFor="variation">
                This product is variable, has different colors, size, etc.
              </label>
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Product Status
              </label>
              <select
                id="status"
                value={productDetail.status}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                
              >
                <option>{productDetail.status}</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="collections">
                Collections
              </label>
              <input
                id="collections"
                type="text"
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Search for collections"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="flex flex-wrap">
                {productDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
                Weight
              </label>
              <input
                id="weight"
                type="number"
                value={0}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 bg-gray-50">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
            Add
          </button>
          <button className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
