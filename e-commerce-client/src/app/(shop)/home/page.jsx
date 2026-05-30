import CategorySection from "@/components/home/category-section";
import FeaturesSection from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";
import ProductSection from "@/components/home/product-section";
import React from "react";

const Home = () => {
  return (
    <>
      <HeroSection />

      <CategorySection />

      <ProductSection />

      <FeaturesSection />
    </>
  );
};

export default Home;
