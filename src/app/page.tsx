"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, FolderKanban, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


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
    <AnimatedWrapper>
        <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Projects Dashboard</h1>
                <p className="text-muted-foreground mt-1">An overview of your ongoing projects.</p>
            </div>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="text-center py-20 px-6 border-2 border-dashed rounded-lg">
                    <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first project.</p>
                    <Button onClick={openAddProjectDialog} className="mt-6">
                        Create Project
                    </Button>
                </div>
            </motion.div>
        ) : (
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            {projects.map(project => {
                const totalIncome = project.payments
                .filter(p => p.type === 'income' && p.status === 'Completed')
                .reduce((acc, p) => acc + p.amount, 0);

                const progress = project.totalAmount ? (totalIncome / project.totalAmount) * 100 : 0;

                return (
                    <motion.div key={project.id} variants={itemVariants}>
                        <Card className="flex flex-col h-full bg-gradient-to-br from-card to-secondary/30 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>{project.name}</CardTitle>
                                    <span className="p-2 rounded-lg bg-secondary">
                                        <FolderKanban className="h-5 w-5 text-primary" />
                                    </span>
                                </div>
                                <CardDescription className="truncate h-5">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                {project.totalAmount && (
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                                    <span>Progress</span>
                                    <span>${totalIncome.toFixed(2)} / ${project.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <Progress value={progress} />
                                </div>
                                )}
                                <div className="text-sm text-muted-foreground mt-4">
                                {project.payments.length} payments recorded
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/project/${project.id}`} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </motion.div>
                );
            })}
            </motion.div>
        )}
        </div>
    </AnimatedWrapper>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
