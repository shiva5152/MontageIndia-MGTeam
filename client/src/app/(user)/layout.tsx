import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../globals.css";
const inter = Inter( {subsets: ["latin"]} );
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ReduxProvider} from "@/app/redux/provider";
import Script from "next/script";
import Sidebar from "@/components/navbar/Navbar";
import InitialLoad from "@/components/provider/InitialLoad";
import TopBanner from "@/components/navbar/TopBanner";
import {ChatProvider} from "@/app/(user)/Provider/chatProvider";

// import { Navbar } from "@nextui-org/react";

export const metadata: Metadata = {
  title: "Montage India",
  description: "Generated by create next app",
};

export default function RootLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body className={inter.className + " overflow-x-hidden"}>
        <ToastContainer />
        <ReduxProvider>
          <InitialLoad>
            <TopBanner />
            <Sidebar />
            <ChatProvider>
              {children}
            </ChatProvider>

          </InitialLoad>
        </ReduxProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />


      </body>
    </html>
  );
}
