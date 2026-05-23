"use client";
import ProductsContainer from '@/components/products/container/product-container'
import React from 'react'
import withPermission from '@/components/rbac/withPermission';

const products = () => {
  return (
    <ProductsContainer/>
  )
}

export default withPermission(products, { permission: 'product.view' });
