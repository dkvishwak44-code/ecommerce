import Cart from "./cart.model.js";

const cartPopulate = {
  path:   "items.product",
  select: "name slug sku price salePrice stock thumbnail images status isPublished variants storeId",
};

export const findByCustomer = (customerId) => {
  return Cart.findOne({ customer: customerId }).populate(cartPopulate);
};

export const findOrCreateByCustomer = async (customerId) => {
  let cart = await Cart.findOne({ customer: customerId });

  if (!cart) {
    cart = await Cart.create({ customer: customerId });
  }

  return cart.populate(cartPopulate);
};

export const save = (cart) => cart.save();

export const deleteByCustomer = (customerId) => {
  return Cart.findOneAndDelete({ customer: customerId });
};
