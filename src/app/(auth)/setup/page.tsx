"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useEffect } from 'react';

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path to show the error
});

export default function SetupPage() {
  const router = useRouter();
  const { setupPassword, isPasswordSet, isLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!isLoading && isPasswordSet) {
      router.push('/');
    }
  }, [isPasswordSet, isLoading, router]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await setupPassword(values.password);
      toast.success('Password created successfully! Welcome.');
      router.push('/');
    } catch (error) {
      toast.error('Failed to set up password.');
      console.error(error);
    }
  };

  if (isLoading || isPasswordSet) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome to AppKadaii</CardTitle>
        <CardDescription>Create a password to secure your local data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter a strong password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
