/**
 * Tax calculation utilities for order/checkout processing.
 * Supports inclusive and exclusive tax, multiple tax rates,
 * and item-level tax calculation.
 */

/**
 * Calculate tax amount on a given base price.
 *
 * @param {number} amount - Base amount (before tax if exclusive, total if inclusive)
 * @param {number} taxRate - Tax rate as a percentage (e.g. 18 for 18%)
 * @param {'exclusive'|'inclusive'} [type='exclusive'] - Whether tax is added on top or included
 * @returns {{ taxAmount: number, total: number, net: number }}
 */
const calculateTax = (amount, taxRate = 0, type = 'exclusive') => {
  if (!taxRate || taxRate <= 0) {
    return { taxAmount: 0, total: amount, net: amount };
  }

  const rate = taxRate / 100;

  if (type === 'inclusive') {
    // Tax is already included in the amount
    const taxAmount = roundTo2(amount - amount / (1 + rate));
    const net = roundTo2(amount - taxAmount);
    return { taxAmount, total: roundTo2(amount), net };
  }

  // Exclusive: tax is added on top
  const taxAmount = roundTo2(amount * rate);
  const total = roundTo2(amount + taxAmount);
  return { taxAmount, total, net: roundTo2(amount) };
};

/**
 * Calculate tax for a cart / list of items.
 *
 * @param {Array<{ price: number, quantity: number, taxRate?: number }>} items
 * @param {number} [defaultTaxRate=0] - Fallback rate if item has no taxRate
 * @param {'exclusive'|'inclusive'} [type='exclusive']
 * @returns {{
 *   subtotal: number,
 *   totalTax: number,
 *   total: number,
 *   items: Array<{ subtotal: number, taxAmount: number, total: number }>
 * }}
 */
const calculateCartTax = (items = [], defaultTaxRate = 0, type = 'exclusive') => {
  let subtotal = 0;
  let totalTax = 0;

  const processedItems = items.map((item) => {
    const lineTotal = roundTo2((item.price || 0) * (item.quantity || 1));
    const rate = item.taxRate !== undefined ? item.taxRate : defaultTaxRate;
    const { taxAmount, total, net } = calculateTax(lineTotal, rate, type);

    subtotal += net;
    totalTax += taxAmount;

    return {
      ...item,
      subtotal: net,
      taxAmount,
      total,
    };
  });

  return {
    subtotal: roundTo2(subtotal),
    totalTax: roundTo2(totalTax),
    total: roundTo2(subtotal + totalTax),
    items: processedItems,
  };
};

/**
 * Apply a discount to an amount, then calculate tax on the result.
 *
 * @param {number} amount - Original amount
 * @param {number} discountAmount - Flat discount in currency units
 * @param {number} taxRate - Tax rate percentage
 * @param {'exclusive'|'inclusive'} [type='exclusive']
 * @returns {{ discountedAmount: number, taxAmount: number, total: number }}
 */
const calculateTaxAfterDiscount = (amount, discountAmount = 0, taxRate = 0, type = 'exclusive') => {
  const discountedAmount = roundTo2(Math.max(0, amount - discountAmount));
  const { taxAmount, total } = calculateTax(discountedAmount, taxRate, type);
  return { discountedAmount, taxAmount, total };
};

/**
 * Break down a GST-inclusive price into CGST + SGST components (India).
 *
 * @param {number} amount - GST-inclusive amount
 * @param {number} gstRate - Total GST rate (e.g. 18 for 18%)
 * @returns {{ net: number, cgst: number, sgst: number, igst: number, total: number }}
 */
const calculateGST = (amount, gstRate = 18) => {
  const { net, taxAmount } = calculateTax(amount, gstRate, 'inclusive');
  const half = roundTo2(taxAmount / 2);
  return {
    net,
    cgst: half,
    sgst: roundTo2(taxAmount - half), // handles odd penny
    igst: 0, // set to taxAmount for interstate
    total: roundTo2(amount),
  };
};

/**
 * Round a number to 2 decimal places.
 * @param {number} num
 * @returns {number}
 */
const roundTo2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

module.exports = {
  calculateTax,
  calculateCartTax,
  calculateTaxAfterDiscount,
  calculateGST,
  roundTo2,
};