"use client";

import { useState } from 'react';
import * as z from 'zod';
import { useProjects } from '@/hooks/useProjects';
import { Payment } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { PaymentForm } from './PaymentForm';
import { toast } from 'sonner';

interface PaymentDialogProps {
  projectId: string;
  payment?: Payment; // If provided, we're in "edit" mode
  children: React.ReactNode; // The trigger button
}

type PaymentFormValues = z.infer<typeof z.object({
    type: z.enum(['income', 'expense']),
    name: z.string().min(1, 'Name is required.'),
    amount: z.number().positive(),
    date: z.date(),
    status: z.enum(['Pending', 'Completed']),
    method: z.string().min(1, 'Payment method is required.'),
    description: z.string().optional(),
})>;

export function PaymentDialog({ projectId, payment, children }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPaymentToProject, updatePaymentInProject } = useProjects();

  const handleSubmit = (values: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      const paymentData = {
        ...values,
        date: values.date.toISOString(), // Convert date to string for storage
      };

      if (payment) {
        // Edit mode
        updatePaymentInProject(projectId, { ...payment, ...paymentData });
        toast.success('Payment updated successfully!');
      } else {
        // Create mode
        addPaymentToProject(projectId, paymentData);
        toast.success('Payment added successfully!');
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(payment ? 'Failed to update payment.' : 'Failed to add payment.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{payment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
          <DialogDescription>
            {payment ? 'Update the details of your payment.' : 'Record a new payment for this project.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <PaymentForm payment={payment} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
