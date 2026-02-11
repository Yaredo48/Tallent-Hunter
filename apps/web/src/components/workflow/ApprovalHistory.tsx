'use client';

import { ApprovalWorkflow, useWorkflow } from '@/hooks/use-workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, MessageSquare, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface ApprovalHistoryProps {
    workflow: ApprovalWorkflow;
}

export function ApprovalHistory({ workflow }: ApprovalHistoryProps) {
    const allActions = workflow.steps.flatMap(step =>
        step.actions.map(action => ({
            ...action,
            stepOrder: step.order,
            approverName: `${step.approver.firstName} ${step.approver.lastName}`
        }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'REJECTED': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'PENDING': return <Clock className="h-5 w-5 text-orange-500" />;
            default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'APPROVE': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
            case 'REJECT': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
            case 'REQUEST_CHANGES': return <Badge className="bg-orange-100 text-orange-800">Changes Requested</Badge>;
            default: return <Badge variant="secondary">Comment</Badge>;
        }
    };

    return (
        <Card className="shadow-none border-gray-100">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Approval Workflow
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Workflow Summary Grid */}
                <div className="flex flex-wrap gap-4 mb-4">
                    {workflow.steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center p-3 rounded-lg border text-center min-w-[120px] ${step.order === workflow.currentStepOrder && workflow.status === 'IN_PROGRESS'
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                    : 'border-gray-100 bg-gray-50'
                                }`}
                        >
                            <div className="mb-2">{getStatusIcon(step.status)}</div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Step {step.order}</span>
                            <span className="text-sm font-medium truncate w-full">{step.approver.firstName}</span>
                        </div>
                    ))}
                </div>

                <div className="relative space-y-6">
                    <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-gray-100" />

                    {allActions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
                            <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No activity yet. Workflow is {workflow.status.toLowerCase()}.</p>
                        </div>
                    ) : (
                        allActions.map((action) => (
                            <div key={action.id} className="relative flex items-start gap-4">
                                <div className={`mt-1 h-10 w-10 min-w-[40px] rounded-full flex items-center justify-center z-10 ${action.action === 'APPROVE' ? 'bg-green-100' :
                                        action.action === 'REJECT' ? 'bg-red-100' : 'bg-orange-100'
                                    }`}>
                                    <User className={`h-5 w-5 ${action.action === 'APPROVE' ? 'text-green-600' :
                                            action.action === 'REJECT' ? 'text-red-600' : 'text-orange-600'
                                        }`} />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            {action.approverName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(action.createdAt), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getActionBadge(action.action)}
                                        <span className="text-xs text-gray-400">Step {action.stepOrder}</span>
                                    </div>
                                    {action.comment && (
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 text-sm italic text-gray-600">
                                            "{action.comment}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
