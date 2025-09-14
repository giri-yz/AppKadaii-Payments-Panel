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
  password: z.string().min(1, 'Password is required.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isPasswordSet, isLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  useEffect(() => {
    if (!isLoading) {
      if(isAuthenticated) {
        router.push('/');
      } else if (!isPasswordSet) {
        router.push('/setup');
      }
    }
  }, [isAuthenticated, isPasswordSet, isLoading, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await login(values.password);
    if (success) {
      toast.success('Login successful!');
      router.push('/');
    } else {
      toast.error('Incorrect password. Please try again.');
      form.reset();
    }
  };

  if (isLoading || isAuthenticated || !isPasswordSet) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Enter your password to unlock your data.</CardDescription>
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Unlock</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
