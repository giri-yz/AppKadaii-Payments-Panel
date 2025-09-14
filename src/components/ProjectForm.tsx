"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Project } from "@/lib/types";

// Use a transform to handle number conversion and validation robustly.
const formSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  description: z.string().optional(),
  totalAmount: z.string()
    .optional()
    .refine((val) => val === "" || val === undefined || !isNaN(Number(val)), {
      message: "Must be a valid number.",
    })
    .transform((val) => {
        if (val === "" || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || val > 0, {
        message: "Must be a positive number."
    })
});

// Infer type from schema
type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  isSubmitting,
}: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      // The form now deals with a string representation for totalAmount
      totalAmount: project?.totalAmount?.toString() ?? "",
    },
  });

  const handleSubmit: SubmitHandler<ProjectFormValues> = (values) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <Input
                  placeholder="A short description of the project"
                  {...field}
                />
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
                <Input
                  type="text" // Use text to avoid browser number input quirks
                  inputMode="decimal" // Hint for mobile keyboards
                  placeholder="e.g., 5000"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : project
            ? "Save Changes"
            : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}
