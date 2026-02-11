'use client';

import { useWorkflow, ApprovalWorkflow } from '@/hooks/use-workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function ApprovalsPage() {
    const { getPendingApprovals } = useWorkflow();
    const { user } = useAuthStore();

    const { data: pendingApprovals, isLoading } = getPendingApprovals;

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
                <p className="text-muted-foreground">
                    Manage your pending approval requests.
                </p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">
                        Pending ({pendingApprovals?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4 pt-4">
                    {!pendingApprovals || pendingApprovals.length === 0 ? (
                        <Card>
                            <CardContent className="flex h-[200px] flex-col items-center justify-center space-y-2">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                                <p className="text-lg font-medium">All caught up!</p>
                                <p className="text-sm text-muted-foreground text-center max-w-sm">
                                    You have no pending job descriptions waiting for your approval.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingApprovals.map((workflow) => (
                                <Card key={workflow.id} className="overflow-hidden border-l-4 border-l-orange-500">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2">
                                                {workflow.jobDescription.department.name}
                                            </Badge>
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                                Pending Your Action
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-1">
                                            {workflow.jobDescription.title}
                                        </CardTitle>
                                        <CardDescription>
                                            Requested by {workflow.jobDescription.creator.firstName} {workflow.jobDescription.creator.lastName}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-2 h-4 w-4" />
                                            Step {workflow.currentStepOrder} of {workflow.steps.length}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button className="flex-1" asChild>
                                                <Link href={`/dashboard/job-descriptions/${workflow.jobDescriptionId}`}>
                                                    Review <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                    <Card>
                        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
                            <Clock className="h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">Approval history coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
