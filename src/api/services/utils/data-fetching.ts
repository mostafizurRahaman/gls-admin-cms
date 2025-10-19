// ** import core packages
import { useQuery, keepPreviousData } from '@tanstack/react-query';

// ** import utils
import { preprocessSearch } from '@/components/data-table/utils';

// ** import apis
import { getOrders } from '@/api/orders';


// ** import types
import { OrderListItem, OrderListItemDisplay, OrderListItemBase } from '@/types/orders';

/**
 * Maps frontend column sort keys to backend API sort parameters
 */
const mapSortKeyToBackend = (frontendSortKey: string): 'order_date' | 'order_value' | 'order_status' | 'payment_status' | 'quantity' => {
  const mapping: Record<string, 'order_date' | 'order_value' | 'order_status' | 'payment_status' | 'quantity'> = {
    'orderDate': 'order_date',
    'orderValue': 'order_value',
    'order_status': 'order_status',
    'payment_status': 'payment_status',
    'quantity': 'quantity',
  };

  return mapping[frontendSortKey] || 'order_date';
};

/**
 * Transform OrderListItem to OrderListItemDisplay for DataTable compatibility
 */
function transformOrderListItem(order: OrderListItem): OrderListItemDisplay {
  return {
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    manufacturerName: order.manufacturerName,
    manufacturerOrganization: order.manufacturerOrganization,
    retailerName: order.retailerName,
    retailerEmail: order.retailerEmail,
    products: order.products,
    category: order.category,
    orderValue: order.orderValue,
    orderDate: order.orderDate,
    quantity: order.quantity,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    region: order.region,
  };
}

/**
 * Hook to fetch orders with the current filters and pagination
 */
export function useAllOrderData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      'new-orders',
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],

    queryFn: async () => {
      const response = await getOrders({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: mapSortKeyToBackend(sortBy || 'order_date'),
        sort_order: sortOrder as 'asc' | 'desc',
        order_status: "pending",
        payment_status: 'all',
        category: 'all',
      });

      // Transform the data to match OrderListItemExportable
      return {
        ...response,
        data: response.data.map(transformOrderListItem)
      };
    },

    placeholderData: keepPreviousData, // Keep previous data when fetching new data. If skeleton animation is needed when fetching data, comment this out.
  });
}

// Add a property to the function so we can use it with the DataTable component
useAllOrderData.isQueryHook = true;
