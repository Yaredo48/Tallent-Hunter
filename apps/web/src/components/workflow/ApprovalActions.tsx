'use client';

import { useState } from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalActionsProps {
    workflowId: string;
}

export function ApprovalActions({ workflowId }: ApprovalActionsProps) {
    const [comment, setComment] = useState('');
    const { approveStep, rejectStep, requestChanges } = useWorkflow();

    const handleAction = async (actionFn: any, title: string) => {
        if (!comment && title !== 'Approve') {
            toast.error("Comment required", {
                description: "Please provide a reason for this action.",
            });
            return;
        }

        try {
            await actionFn.mutateAsync({ workflowId, comment });
            toast.success(`${title} successful`, {
                description: `The job description has been ${title.toLowerCase()}d.`,
            });
            setComment('');
        } catch (error) {
            toast.error('Error', {
                description: 'Failed to perform action. Please try again.',
            });
        }
    };

    const isPending = approveStep.isPending || rejectStep.isPending || requestChanges.isPending;

    return (
        <div className="space-y-4 bg-primary/5 p-4 rounded-lg border border-primary/10">
            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Approval Decision
                </label>
                <Textarea
                    placeholder="Add a comment or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-white"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => handleAction(approveStep, 'Approve')}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    disabled={isPending}
                >
                    {approveStep.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Approve
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleAction(requestChanges, 'Request Changes')}
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 flex-1 hover:text-orange-800"
                    disabled={isPending}
                >
                    {requestChanges.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                    Request Changes
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => handleAction(rejectStep, 'Reject')}
                    className="flex-1"
                    disabled={isPending}
                >
                    {rejectStep.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Reject
                </Button>
            </div>
        </div>
    );
}

import { MessageSquare } from 'lucide-react';
