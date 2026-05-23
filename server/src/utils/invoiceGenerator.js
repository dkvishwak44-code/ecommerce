// const PDFDocument = require('pdfkit');
// const path = require('path');
// const fs = require('fs');
// const { formatDate } = require('./date');
// const { roundTo2 } = require('./calculateTax');
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { formatDate } from './date';
import { roundTo2 } from './calculateTax';
/**
 * Generate a PDF invoice and save it to disk (or return as a buffer).
 *
 * @param {object} invoiceData
 * @param {object}   invoiceData.order        - Order document
 * @param {object}   invoiceData.store        - Store document
 * @param {object}   invoiceData.customer     - Customer document
 * @param {string}  [invoiceData.outputPath]  - Full file path to save PDF; omit to get a Buffer
 * @returns {Promise<Buffer|string>} Buffer if no outputPath, or file path string
 */
const generateInvoicePdf = (invoiceData) => {
  return new Promise((resolve, reject) => {
    const { order, store, customer, outputPath } = invoiceData;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      if (outputPath) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, pdfBuffer);
        resolve(outputPath);
      } else {
        resolve(pdfBuffer);
      }
    });

    // ── Header ────────────────────────────────────────────────────────────────
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(store?.name || 'Store', 50, 50)
      .fontSize(9)
      .font('Helvetica')
      .text(store?.address || '', 50, 75)
      .text(store?.email || '', 50, 88)
      .text(store?.phone || '', 50, 101);

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#333333')
      .text('INVOICE', 400, 50, { align: 'right' })
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#555555')
      .text(`Invoice #: ${order.invoiceNumber || order._id}`, 400, 78, { align: 'right' })
      .text(`Date: ${formatDate(order.createdAt, 'date')}`, 400, 91, { align: 'right' })
      .text(`Status: ${order.status || 'Confirmed'}`, 400, 104, { align: 'right' });

    // ── Divider ───────────────────────────────────────────────────────────────
    doc.moveTo(50, 125).lineTo(545, 125).strokeColor('#DDDDDD').stroke();

    // ── Bill To ───────────────────────────────────────────────────────────────
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#333333')
      .text('Bill To:', 50, 140)
      .font('Helvetica')
      .fillColor('#555555')
      .text(`${customer?.name || ''}`, 50, 155)
      .text(customer?.email || '', 50, 168)
      .text(customer?.phone || '', 50, 181);

    const shippingAddr = order.shippingAddress;
    if (shippingAddr) {
      doc
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text('Ship To:', 300, 140)
        .font('Helvetica')
        .fillColor('#555555')
        .text(shippingAddr.fullName || '', 300, 155)
        .text(shippingAddr.addressLine1 || '', 300, 168)
        .text(
          [shippingAddr.city, shippingAddr.state, shippingAddr.postalCode]
            .filter(Boolean)
            .join(', '),
          300,
          181
        );
    }

    // ── Items Table Header ────────────────────────────────────────────────────
    const tableTop = 220;
    const COL = { item: 50, qty: 310, unitPrice: 370, tax: 440, amount: 490 };

    doc
      .rect(50, tableTop - 5, 495, 20)
      .fill('#F0F0F0')
      .fillColor('#333333')
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Item', COL.item, tableTop)
      .text('Qty', COL.qty, tableTop)
      .text('Unit Price', COL.unitPrice, tableTop)
      .text('Tax', COL.tax, tableTop)
      .text('Amount', COL.amount, tableTop, { align: 'right' });

    // ── Items Table Rows ──────────────────────────────────────────────────────
    let y = tableTop + 25;
    const items = order.items || [];

    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.rect(50, y - 3, 495, 18).fill('#FAFAFA');
      }

      const lineTotal = roundTo2((item.price || 0) * (item.quantity || 1));
      const taxLabel = item.taxRate ? `${item.taxRate}%` : '-';

      doc
        .fillColor('#444444')
        .font('Helvetica')
        .fontSize(9)
        .text(item.name || item.product?.name || 'Product', COL.item, y, { width: 250 })
        .text(String(item.quantity || 1), COL.qty, y)
        .text(`₹${(item.price || 0).toFixed(2)}`, COL.unitPrice, y)
        .text(taxLabel, COL.tax, y)
        .text(`₹${lineTotal.toFixed(2)}`, COL.amount, y, { align: 'right' });

      y += 20;
    });

    // ── Totals ────────────────────────────────────────────────────────────────
    doc.moveTo(50, y + 5).lineTo(545, y + 5).strokeColor('#DDDDDD').stroke();
    y += 15;

    const totalsX = 380;

    const addTotalRow = (label, value, bold = false) => {
      doc
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(9)
        .fillColor('#444444')
        .text(label, totalsX, y)
        .text(value, COL.amount, y, { align: 'right' });
      y += 16;
    };

    addTotalRow('Subtotal:', `₹${(order.subtotal || 0).toFixed(2)}`);
    if (order.discount > 0) addTotalRow('Discount:', `-₹${(order.discount || 0).toFixed(2)}`);
    if (order.tax > 0) addTotalRow('Tax:', `₹${(order.tax || 0).toFixed(2)}`);
    if (order.shippingCharge > 0) addTotalRow('Shipping:', `₹${(order.shippingCharge || 0).toFixed(2)}`);

    doc.moveTo(totalsX, y).lineTo(545, y).strokeColor('#AAAAAA').stroke();
    y += 8;
    addTotalRow('Total:', `₹${(order.total || 0).toFixed(2)}`, true);

    // ── Payment info ──────────────────────────────────────────────────────────
    if (order.paymentMethod) {
      y += 10;
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#888888')
        .text(`Payment Method: ${order.paymentMethod}`, 50, y);
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    doc
      .fontSize(8)
      .fillColor('#AAAAAA')
      .text('Thank you for your purchase!', 50, 760, { align: 'center', width: 495 });

    doc.end();
  });
};

/**
 * Build the invoice file path for a given order.
 *
 * @param {string|import('mongoose').Types.ObjectId} orderId
 * @returns {string}
 */
const getInvoicePath = (orderId) => {
  const dir = path.join(process.cwd(), 'src', 'public', 'files', 'invoices');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `invoice-${orderId}.pdf`);
};

export default {
  generateInvoicePdf,
  getInvoicePath,
};