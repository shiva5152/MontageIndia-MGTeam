"use client";
import React, { useState, useEffect, useRef } from "react";
import CartPopup from "../cart/cartPage";
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDropdown, IoMdArrowDropdown } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import instance from "@/utils/axios";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import Swal from "sweetalert2";
import { notifySuccess } from "@/utils/toast";
import { signOutUser } from "@/utils/loginOptions";
import { usePathname } from "next/navigation";

interface User {
  subscription: {
    status: string;
    credits?: number;
  };
  image: string;
  name: string;
  email: string;
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [isEditorChosePopupOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<boolean>(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname.includes("/search");

  // Replace this with your actual user state management
  const { user } = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.product.cart);

  const editorChoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 770);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorChoiceRef.current &&
        !editorChoiceRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isEditorChosePopupOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleMobileDropdown = () => setMobileDropdownOpen(!mobileDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // const response = await instance.get("/user/logout");
      await signOutUser();
      notifySuccess("Logout successfully");
      router.push("/auth/user/login");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  const handleUserIconClick = () => {
    if (isUserOpen) return;
    setIsUserOpen(!isUserOpen);
  };

  const handleProfileClick = () => {
    setIsUserOpen(false);
    router.push("/user-profile");
  };

  const NavItem: React.FC<NavItemProps> = ({ href, onClick, children }) => (
    <li
      className="text-gray-700 hover:text-black transition duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      <Link href={href}>{children}</Link>
    </li>
  );

  const DropdownItem: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
  }) => (
    <Link
      href={href}
      className="text-gray-600 hover:text-gray-800 block py-2 ps-4 pe-8 hover:bg-gray-100 transition duration-200"
    >
      {children}
    </Link>
  );

  const userPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target as Node)
      ) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-4 lg:px-16 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-32 h-8 cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

            {!isMobile && (
              <nav className="hidden md:block">
                <ul className="flex items-start space-x-4 cursor-pointer">
                  <NavItem href="/video">Video</NavItem>
                  <NavItem href="/image">Images</NavItem>
                  <NavItem href="/audio">Audio</NavItem>
                  <li className="relative group">
                    <button
                      disabled={isEditorChosePopupOpen}
                      onClick={toggleDropdown}
                      className="flex items-center text-gray-700 hover:text-black"
                    >
                      Editor Choice
                      <IoIosArrowDropdown
                        className={`ml-1 transform ${
                          isEditorChosePopupOpen ? "rotate-180" : ""
                        } transition-transform duration-200`}
                      />
                    </button>
                    {isEditorChosePopupOpen && (
                      <div
                        ref={editorChoiceRef}
                        className="absolute  mt-2 w-fit bg-white border rounded shadow-xl z-50 flex flex-col items-center justify-start  top-full  "
                      >
                        <DropdownItem href="/video?category=editor choice&mediaType=video">
                          Video
                        </DropdownItem>
                        <DropdownItem href="/image?category=editor choice&mediaType=image">
                          Image
                        </DropdownItem>
                        <DropdownItem href="/audio?category=editor choice&mediaType=audio">
                          Audio
                        </DropdownItem>
                      </div>
                    )}
                  </li>
                  <NavItem href="/ondemand">On Demand</NavItem>
                </ul>
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user?.subscription.status === "active" && (
              <span className="text-gray-700">
                {user.subscription.credits || 0} Credits Available
              </span>
            )}
            <Link href={!!user ? "/user-profile/wishlist" : "/auth/user/login"}>
              <AiOutlineHeart className="text-gray-700 hover:text-webred cursor-pointer w-7 h-7 transition-transform duration-200 ease-in-out hover:scale-110" />
            </Link>

            <CartPopup />
            <div className="relative">
              {user ? (
                <button disabled={isUserOpen} onClick={handleUserIconClick}>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </button>
              ) : (
                <button disabled={isUserOpen} onClick={handleUserIconClick}>
                  <FaUserCircle className="w-10 h-10 rounded-full cursor-pointer" />
                </button>
              )}
              {isUserOpen && (
                <div
                  ref={userPopupRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl z-50"
                >
                  {user ? (
                    <>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <BiLogOutCircle className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <FaUserCircle className="w-5 h-5 mr-3" />
                        User Profile
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => router.push("/auth/user/login")}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <BiLogInCircle className="w-5 h-5 mr-3" />
                      Log In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              {menuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem href="/video" onClick={() => setMenuOpen(false)}>
              Video
            </NavItem>
            <NavItem href="/image" onClick={() => setMenuOpen(false)}>
              Images
            </NavItem>
            <NavItem href="/audio" onClick={() => setMenuOpen(false)}>
              Audio
            </NavItem>
            <NavItem href="/ondemand" onClick={() => setMenuOpen(false)}>
              On Demand
            </NavItem>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <CartPopup />
            <div className="flex items-center px-5">
              {user ? (
                <img
                  src={user.image}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-700" />
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.name || "Guest"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.email || ""}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {user ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FaUserCircle className="w-5 h-5 mr-3" />
                    User Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <BiLogOutCircle className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/auth/user/login")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
