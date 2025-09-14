"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";


function SettingsPage() {
  const router = useRouter();
  const { clearAllData } = useProjects();
  const { logout } = useAuth();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete ALL data? This action is irreversible and will remove all projects and payments.")) {
      try {
        clearAllData();
        logout(); // Log out to clear the session key
        toast.success("All application data has been cleared.");
        router.push('/setup'); // Redirect to the setup page to start over
      } catch (error) {
        toast.error("Failed to clear data.");
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Link href="/"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>

        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                    Manage your application data here. Be careful, these actions are destructive.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold mb-2">Clear All Application Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    This will permanently delete all your projects and payments from this device.
                    You will be logged out and will need to create a new password.
                </p>
                <Button variant="destructive" onClick={handleClearData}>
                    Clear All Data
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default function Home() {
    return (
        <AuthGuard>
            <SettingsPage />
        </AuthGuard>
    )
}
