// components/layout/Footer.jsx

import Link from "next/link";

import { MapPin, Phone, Mail } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t bg-background dark:border-gray-800 dark:bg-black">
      {/* TOP */}
      <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* BRAND */}
        <div className="lg:col-span-2">
          <Link href="/" className="text-3xl font-bold text-blue-500">
            Shop
            <span className="text-primary">Sphere</span>
          </Link>

          <p className="mt-5 max-w-md text-gray-600 dark:text-gray-400">
            Discover premium fashion, electronics, accessories and modern
            lifestyle products with fast delivery and secure payment.
          </p>

          {/* SOCIAL */}
          <div className="mt-6 flex items-center gap-3">
            {[FaFacebook, FaInstagram, FaXTwitter, FaYoutube].map(
              (Icon, index) => (
                <Link
                  key={index}
                  href="/"
                  className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-black
                  hover:text-white
                  hover:shadow-lg
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-300
                  dark:hover:bg-white
                  dark:hover:text-black
                "
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ),
            )}
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">Shop</h3>

          <div className="flex flex-col gap-3">
            {[
              "Men Fashion",
              "Women Fashion",
              "Accessories",
              "Electronics",
              "New Arrivals",
            ].map((item) => (
              <Link
                key={item}
                href="/"
                className="
                  text-gray-600
                  transition
                  hover:text-black
                  dark:text-gray-400
                  dark:hover:text-white
                "
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="mb-5 text-lg font-semibold ">Company</h3>

          <div className="flex flex-col gap-3">
            {["About Us", "Contact", "Careers", "Blogs", "Support"].map(
              (item) => (
                <Link
                  key={item}
                  href="/"
                  className="
                  text-gray-600
                  transition
                  hover:text-black
                  dark:text-gray-400
                  dark:hover:text-white
                "
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-5 text-lg font-semibold ">Contact</h3>

          <div className="space-y-5 text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0" />

              <p>New Delhi, India</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0" />

              <p>+91 9876543210</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0" />

              <p>support@shopsphere.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="border-y border-gray-200 ">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-8 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold">Subscribe Newsletter</h3>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Get latest updates and offers
            </p>
          </div>

          <form className="flex w-full max-w-xl items-center overflow-hidden rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <input
              type="email"
              placeholder="Enter your email"
              className="
                h-14
                flex-1
                bg-transparent
                px-5
                text-black
                outline-none
                placeholder:text-gray-400
                dark:text-white
              "
            />

            <button
              className="
                h-14
                bg-black
                px-8
                text-white
                transition
                hover:opacity-90
                dark:bg-white
                dark:text-black
              "
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 md:flex-row">
        <p>© 2026 ShopSphere. All rights reserved.</p>

        <div className="flex items-center gap-5">
          {["Privacy Policy", "Terms & Conditions", "Refund Policy"].map(
            (item) => (
              <Link
                key={item}
                href="/"
                className="
                transition
                hover:text-black
                dark:hover:text-white
              "
              >
                {item}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
