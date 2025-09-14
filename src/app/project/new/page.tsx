"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { ProjectForm } from '@/components/ProjectForm';
import { useProjects } from '@/hooks/useProjects';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
  totalAmount: z.coerce.number().positive('Must be a positive number').optional(),
});


function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      addProject({
        name: values.name,
        description: values.description || '',
        totalAmount: values.totalAmount,
      });
      toast.success('Project created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create project.');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
    return (
        <AuthGuard>
            <NewProjectPage />
        </AuthGuard>
    )
}
