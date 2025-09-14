"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Project } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
  totalAmount: z.coerce.number().positive('Must be a positive number').optional(),
});

interface ProjectFormProps {
  project?: Project;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
}

export function ProjectForm({ project, onSubmit, isSubmitting }: ProjectFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      totalAmount: project?.totalAmount || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Website Redesign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A short description of the project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Project Amount (Goal)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (project ? 'Save Changes' : 'Create Project')}
        </Button>
      </form>
    </Form>
  );
}
