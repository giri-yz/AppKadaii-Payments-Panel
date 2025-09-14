"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

function DashboardPage() {
  const { projects, isLoading } = useProjects();
  const router = useRouter();

  const openAddProjectDialog = () => {
    router.push('/project/new');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading projects...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects Dashboard</h1>
        <div className="flex gap-2">
            <Button onClick={openAddProjectDialog}>Add New Project</Button>
            <Link href="/settings">
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">You don't have any projects yet.</p>
          <Button onClick={openAddProjectDialog} className="mt-4">Create Your First Project</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => {
            const totalIncome = project.payments
              .filter(p => p.type === 'income' && p.status === 'Completed')
              .reduce((acc, p) => acc + p.amount, 0);

            const progress = project.totalAmount ? (totalIncome / project.totalAmount) * 100 : 0;

            return (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Card className="hover:border-primary cursor-pointer transition-all">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="truncate h-5">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.totalAmount && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{totalIncome.toFixed(2)} / {project.totalAmount.toFixed(2)}</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground mt-4">
                      {project.payments.length} payments recorded
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
