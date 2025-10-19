'use client';

// ** import core packages
import { useState } from 'react';

// ** import shared components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ** import sub pages/sections
import ConfirmOrderDialog from './actions/confirm-order-dialog';
import RejectionDialog from '@/components/shared/dialogs/rejection-dialog';

// ** import api
import { confirmOrder } from '@/api/orders/confirm-order';
import { rejectOrder } from '@/api/orders/reject-order';

// ** import utils
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Define type for attendance status
export type AttendanceStatus = 'Confirm' | 'Reject';

export interface ActionCellProps {
  initialStatus: string;
  id: string;
  onSuccess?: () => void;
}

// Define status color mapping
const getTextColor = (status: AttendanceStatus): string => {
  switch (status) {
    case 'Confirm':
      return 'text-status-success';
    case 'Reject':
      return 'text-status-rejected ';

    default:
      return 'text-foreground';
  }
};

export const ActionCell: React.FC<ActionCellProps> = ({
  initialStatus,
  id,
  onSuccess,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>(initialStatus as AttendanceStatus);
  const [pendingStatus, setPendingStatus] = useState<AttendanceStatus | null>(
    null
  );

  const queryClient = useQueryClient();

  const handleStatusChange = (status: AttendanceStatus) => {
    if (status === 'Reject') {
      // Show rejection dialog for Reject status
      setShowRejectionDialog(true);
    } else {
      // Show regular status change dialog for other statuses
      setPendingStatus(status);
      setShowDialog(true);
    }
  };

  const handleConfirmChange = async () => {
    try {
      setIsLoading(true);
      if (pendingStatus) {
        const response = await confirmOrder(id);

        if (response.success) {
          toast.success(response.message);
          setSelectedStatus(pendingStatus);
          setPendingStatus(null);

          // Call success callback to refresh data
          if (response?.success) {
            console.log('invalidating new-orders, in-progress');
            // Invalidate new-orders queries
            queryClient.invalidateQueries({ queryKey: ['new-orders'] });
            // Invalidate in-progress-orders queries  
            queryClient.invalidateQueries({ queryKey: ['in-progress-orders'] });
          }
        } else {
          toast.error(response.message || 'Failed to confirm order');
        }
      }
      setShowDialog(false);
    } catch (error) {
      console.error('Error confirming order status for ID:', id, error);
      toast.error('Failed to confirm order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelChange = () => {
    setPendingStatus(null);
    setShowDialog(false);
  };

  const handleRejectionSubmit = async (reason: string) => {
    try {
      setIsLoading(true);

      const response = await rejectOrder(id, reason);

      if (response.success) {
        toast.success(response.message);
        setSelectedStatus('Reject');

        // Call success callback to refresh data
        if (response?.success) {
          console.log('invalidating new-orders, in-progress');
          // Invalidate new-orders queries
          queryClient.invalidateQueries({ queryKey: ['new-orders'] });
          // Invalidate in-progress-orders queries  
          queryClient.invalidateQueries({ queryKey: ['in-progress-orders'] });
        }
      } else {
        toast.error(response.message || 'Failed to reject order');
      }

      // Close rejection dialog
      setShowRejectionDialog(false);
    } catch (error) {
      console.error('Error rejecting order for ID:', id, error);
      toast.error('Failed to reject order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Define the available status options
  const statusOptions: AttendanceStatus[] = initialStatus?.toLowerCase() === 'pending' ? ['Confirm', 'Reject'] : initialStatus === 'confirmed' ? ['Confirm'] : ['Reject'];

  return (
    <div>
      {/* Status Change Dialog */}
      <ConfirmOrderDialog
        open={showDialog}
        onOpenChange={handleCancelChange} // Use handleCancelChange for closing the dialog
        onDelete={handleConfirmChange} // Map onDelete to handleConfirmChange
        id={id}
        isLoading={isLoading}
      />

      {/* Rejection Dialog */}
      <RejectionDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
        onSubmit={handleRejectionSubmit}

        isLoading={isLoading}
      />

      {/* Status Selector */}
      <Select
        onValueChange={(value) => handleStatusChange(value as AttendanceStatus)}
        value={selectedStatus}
      >
        <SelectTrigger
          className={cn(
            getTextColor(selectedStatus),
            'w-full border-primary bg-transparent'
          )}
        >
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem
              key={status}
              value={status}
              className={getTextColor(status)}
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
