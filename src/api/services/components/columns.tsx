'use client';

// ** import core packages
import React, { useState } from 'react';

// ** import third party
import { ColumnDef } from '@tanstack/react-table';
import { Image } from 'lucide-react';
import { toast } from 'sonner';

// ** import shared components
import { CategoryBadge } from '@/components/shared/badges/category-badge';
import { OrderStatusBadge, OrderStatusBadgeProps } from '@/components/shared/badges/order-status-badge';
import { PaymentStatusBadge } from '@/components/shared/badges/payment-status-badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import ProductViewDialog from '@/components/shared/dialogs/product-details-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// ** import components
import { ActionCell } from './row-action';

// ** import utils
import { formatDateOnly } from '@/lib/utils';

// ** import types
import { OrderListItem, OrderListItemDisplay, OrderListItemBase } from '@/types/orders';
import { Typography } from '@/components/typography';
import { ProductData } from '@/components/shared/dialogs/product-details-dialog/product-details';

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  onSuccess?: () => void
): ColumnDef<OrderListItemDisplay>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<OrderListItemDisplay>[] = [
    {
      accessorKey: 'orderId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order ID" />
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue('orderId')}</div>
      ),
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Number" />
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue('orderNumber')}</div>
      ),
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: 'manufacturerName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Manufacturer" />
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue('manufacturerName')}</div>
      ),
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: 'retailerName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Retailer" />
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.getValue('retailerName')}</div>
      ),
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: 'products',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => {
        const products = row.original?.products
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-primary/10 aspect-square size-9">
              <Image className="size-4 text-primary" />
            </div>
            <div className="truncate text-left">
              <div className="flex items-center gap-1">
                <Typography variant="Medium_H6" className="">
                  {products?.[0]?.name || "N/A"}
                </Typography>

                {products?.length > 1 && (
                  <Typography variant="Bold_H7" className="text-primary">
                    +{products.length - 1} More
                  </Typography>
                )}
              </div>

            </div>
          </div>
        )
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as 'Footwear' | 'Apparels';
        return (
          <div className="flex justify-center">
            <CategoryBadge status={category} />
          </div>
        );
      },
      size: 100,
      enableSorting: false,
    },
    {
      accessorKey: 'orderValue',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order value (₹)" />
      ),
      cell: ({ row }) => {
        // Handle both 'value' and 'orderValue' field names
        const value = row.getValue('orderValue') as number;
        // Safe number formatting with validation
        if (value === null || value === undefined || isNaN(value)) {
          return (
            <div className="text-muted-foreground">
              -
            </div>
          );
        }

        return (
          <div className="text-primary font-medium">
            {value.toLocaleString()}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Date" />
      ),
      cell: ({ row }) => {
        const orderDate = row.getValue('orderDate') as string;

        // Safe date formatting with validation
        const formatSafeDate = (dateStr: string): string => {
          if (!dateStr || dateStr === '-' || dateStr.trim() === '') {
            return '-';
          }

          try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) {
              return '-';
            }
            return formatDateOnly(dateStr, 'UTC');
          } catch (error) {
            console.warn('Invalid date format:', dateStr);
            return '-';
          }
        };

        return (
          <div className="truncate text-left">{formatSafeDate(orderDate)}</div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => {
        const quantity = row.getValue('quantity') as number;
        const category = row.getValue('category') as string;

        // Safe quantity handling with validation
        if (quantity === null || quantity === undefined || isNaN(quantity)) {
          return (
            <div className="text-center text-muted-foreground">
              -
            </div>
          );
        }

        const unit = category === 'Footwear' ? 'Pairs' : 'Pieces';
        return (
          <div className="text-center text-primary font-medium">
            {quantity} ({unit})
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'paymentStatus',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Payment Status"
          className="text-center justify-center"
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as 'Paid' | 'Pending';
        return <PaymentStatusBadge status={status} />;
      },
      size: 180,
    },
    {
      id: 'info',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Info"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        const products: ProductData[] = row.original.products?.map((product) => {
          return {
            name: product?.name || 'N/A',
            category: row.original.category,

            color: product?.variant || 'N/A',
            image: product?.image || '',
            orderId: row.original.orderId,
            retailerName: row.original.retailerName,
            orderDate: row.original.orderDate,
            moq: product?.moq?.toString() || '0',
            sizeSet: product?.lotSize?.toString() || 'N/A',
            quantity: product?.quantity?.toString() || '0',
            totalValue: product?.totalAmount?.toString() || '0'
          }
        }) || []

        console.log(products)

        return (
          <React.Fragment>
            <div className="flex justify-center">
              <Button onClick={() => setOpen(true)}>View</Button>
            </div>
            <ProductViewDialog
              open={open}
              onOpenChange={setOpen}
              products={products}
              orderId={row.original.orderId}
              onSuccess={onSuccess}
            />
          </React.Fragment>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'orderStatus',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Order Status"
          className="text-center justify-center"
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue('orderStatus') as 'New Order' | 'Confirmed' | 'Rejected' | 'In Progress' | 'Pending'
        return <OrderStatusBadge status={status} />;
      },
      size: 180,
    },
    {
      id: 'action',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => {
        const id = row.getValue('orderId') as string;
        return <ActionCell initialStatus={row?.original?.orderStatus} id={id} onSuccess={onSuccess} />;
      },
      size: 200,
    },
  ];

  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="truncate pl-2">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
