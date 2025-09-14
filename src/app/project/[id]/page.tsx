"use client";

import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { EditProjectDialog } from '@/components/EditProjectDialog';
import { PaymentDialog } from '@/components/PaymentDialog';
import { Pencil } from 'lucide-react';

function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProjectById, isLoading, deleteProject } = useProjects();
  const id = typeof params.id === 'string' ? params.id : '';
  const project = getProjectById(id);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Project not found.</p>
        <Link href="/"><Button variant="link">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const totalIncome = project.payments
    .filter(p => p.type === 'income' && p.status === 'Completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalExpenses = project.payments
    .filter(p => p.type === 'expense' && p.status === 'Completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const progress = project.totalAmount ? (totalIncome / project.totalAmount) * 100 : 0;

  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete this project and all its payments? This action cannot be undone.')) {
      deleteProject(project.id);
      router.push('/');
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{project.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
            <EditProjectDialog project={project} />
            <PaymentDialog projectId={project.id}>
                <Button>Add Payment</Button>
            </PaymentDialog>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card><CardHeader><CardTitle>Total Income</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Net Profit</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${netProfit.toFixed(2)}</p></CardContent></Card>
      </div>

      {project.totalAmount && (
          <Card className="mb-6">
              <CardHeader><CardTitle>Project Goal Progress</CardTitle></CardHeader>
              <CardContent>
                  <div className="flex justify-between text-sm mb-1"><span>Collected</span><span>${totalIncome.toFixed(2)} / ${project.totalAmount.toFixed(2)}</span></div>
                  <Progress value={progress} />
              </CardContent>
          </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent>
          {project.payments.length === 0 ? (
            <p className="text-muted-foreground">No payments recorded for this project yet.</p>
          ) : (
            <ul className="space-y-3">
              {project.payments.map(p => (
                <li key={p.id} className="flex justify-between items-center p-3 rounded-md border">
                  <div className="flex-1">
                    <p className={`font-semibold ${p.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{p.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString()} - {p.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-mono">${p.amount.toFixed(2)}</p>
                    <PaymentDialog projectId={project.id} payment={p}>
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    </PaymentDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 border-t pt-6">
          <Button variant="destructive" onClick={handleDelete}>Delete Project</Button>
      </div>
    </div>
  );
}

export default function Home() {
    return (
        <AuthGuard>
            <ProjectDetailPage />
        </AuthGuard>
    )
}
