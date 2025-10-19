'use client';

// ** import components
import { DataTable } from '@/components/data-table/data-table';
import { ToolbarOptions } from './components/toolbar-options';

// ** import utils
import { getColumns } from './components/columns';
import { useExportConfig } from './utils/config';
import { useAllOrderData } from './utils/data-fetching';

// ** import apis
import { fetchOrdersByIds } from '@/api/orders/fetch-orders-by-ids';

// ** import types
import { OrderListItem, OrderListItemDisplay, OrderListItemExportable, OrderListItemBase } from '@/types/orders';



// Wrapper function to handle the DataTable's numeric ID expectation
const getOrdersByIds = async (ids: string[] | number[]): Promise<OrderListItemDisplay[]> => {
  console.log('  First ids', ids);
  // Convert all IDs to strings since ProductTableItem uses string IDs
  const stringIds = ids.map(id => String(id));
  const orders = await fetchOrdersByIds(stringIds);
  // Transform the data to match OrderListItemDisplay
  return orders.map(order => ({
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
  }));
};

const AllOrdersDataTable = () => {
  return (
    <DataTable<OrderListItemDisplay, unknown>
      getColumns={getColumns}
      fetchDataFn={useAllOrderData}
      fetchByIdsFn={getOrdersByIds}
      exportConfig={useExportConfig()}
      idField="orderId"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedProducts={selectedRows.map((row) => ({
            id: row.orderId,
            name: row.retailerName,
          }))}
          allSelectedPatientIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}

        />
      )}
      config={{
        enableRowSelection: true,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: 'all-orders',
        defaultSortBy: 'orderDate',
        defaultSortOrder: 'desc',
      }}
    />
  );
};

export default AllOrdersDataTable;
