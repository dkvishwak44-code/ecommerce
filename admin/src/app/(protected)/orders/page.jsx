"use client";
import OrderContainer from '@/components/orders/container/order-container'
import React from 'react'
import withPermission from '@/components/rbac/withPermission';

const Orders = () => {
  return (
    <div className='mt-0'>
      <OrderContainer/>
    </div>
  )
}

export default withPermission(Orders, { anyOf: ['order.view_own', 'order.view_all'] });
