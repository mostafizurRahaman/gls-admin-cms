// ** import core packages
import { useMemo } from 'react';

// ** import types
import { OrderListItem, OrderListItemDisplay, OrderListItemExportable, OrderListItemBase } from '@/types/orders';
import { formatDateOnly, formatDateTime12Hr } from '@/lib/utils';
import { formatDate } from 'date-fns';

/**
 * Transform order data for export by flattening complex fields
 */
const transformOrderForExport = (order: OrderListItemDisplay): OrderListItemExportable => {
  // Handle both API structure (orderValue) and dummy data structure (value)
  const orderValue = order.orderValue || order.value || 0;

  // Extract product names and details
  let productDetails = 'N/A';
  if (order.products && Array.isArray(order.products) && order.products.length > 0) {
    // API structure with products array
    const productNames = order.products.map((product: any) => product.name).join(', ');
    const productCount = order.products.length;
    productDetails = productCount > 1 ? `${productNames} (+${productCount - 1} more)` : productNames;
  } else if (order.productDetails) {
    // Dummy data structure with productDetails string
    productDetails = order.productDetails;
  }

  // Format order value with proper currency formatting
  const formattedOrderValue = orderValue ? `₹${orderValue.toLocaleString()}` : 'N/A';

  // Format order date


  // Format quantity with unit - handle both 'Footwear' and 'footwear' cases
  const category = order.category?.toLowerCase();
  const unit = category === 'footwear' ? 'Pairs' : 'Pieces';
  const formattedQuantity = order.quantity ? `${order.quantity} (${unit})` : 'N/A';

  return {
    orderId: order.orderId || 'N/A',
    orderNumber: order.orderNumber || order.orderId || 'N/A', // Fallback to orderId if orderNumber not available
    manufacturerName: order.manufacturerName || 'N/A',
    manufacturerOrganization: order.manufacturerOrganization || 'N/A',
    retailerName: order.retailerName || 'N/A',
    retailerEmail: order.retailerEmail || 'N/A',
    category: order.category || 'N/A',
    orderValue: orderValue,
    orderDate: formatDateOnly(order.orderDate, 'UTC'),
    quantity: order.quantity || 0,
    paymentStatus: order.paymentStatus || 'N/A',
    orderStatus: order.orderStatus || 'N/A',
    region: order.region || 'N/A',
  };
};

/**
 * Default export configuration for the orders data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      orderId: 'Order ID',
      orderNumber: 'Order Number',
      manufacturerName: 'Manufacturer',
      retailerName: 'Retailer',
      productDetails: 'Product Details',
      category: 'Category',
      orderValue: 'Order Value',
      orderDate: 'Order Date',
      quantity: 'Quantity',
      paymentStatus: 'Payment Status',
      orderStatus: 'Order Status',
      region: 'Region',
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 15 }, // Order ID
      { wch: 15 }, // Order Number
      { wch: 25 }, // Manufacturer
      { wch: 25 }, // Retailer
      { wch: 40 }, // Product Details
      { wch: 15 }, // Category
      { wch: 18 }, // Order Value
      { wch: 15 }, // Order Date
      { wch: 20 }, // Quantity
      { wch: 18 }, // Payment Status
      { wch: 18 }, // Order Status
      { wch: 15 }, // Region
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      'orderId',
      'orderNumber',
      'manufacturerName',
      'retailerName',
      'productDetails',
      'category',
      'orderValue',
      'orderDate',
      'quantity',
      'paymentStatus',
      'orderStatus',
      'region',
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: 'orders',
    transformFunction: transformOrderForExport
  };
}
