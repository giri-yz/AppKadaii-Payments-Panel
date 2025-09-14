"use client";

import { useState } from 'react';
import * as z from 'zod';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProjectForm } from './ProjectForm';
import { toast } from 'sonner';

interface EditProjectDialogProps {
  project: Project;
}

type ProjectFormValues = z.infer<typeof z.object({
    name: z.string().min(1, 'Project name is required.'),
    description: z.string().optional(),
    totalAmount: z.number().positive().optional(),
}),>;


export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProject } = useProjects();

  const handleSubmit = (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      updateProject({
        ...project,
        name: values.name,
        description: values.description || '',
        totalAmount: values.totalAmount,
      });
      toast.success('Project updated successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update project.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ProjectForm project={project} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
