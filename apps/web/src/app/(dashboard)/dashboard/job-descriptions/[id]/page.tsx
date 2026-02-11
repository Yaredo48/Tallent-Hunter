'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { useWorkflow } from '@/hooks/use-workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateJobDescription, useSimilarJobDescriptions, useCandidateRecommendations } from '@/hooks/use-job-descriptions';
import { useTemplates } from '@/hooks/use-templates';
import { PresenceList } from '@/components/workflow/PresenceList';
import {
    Loader2,
    ArrowLeft,
    History,
    FileText,
    CheckCircle2,
    Edit2,
    Save,
    X,
    Globe,
    ExternalLink,
    BookOpen,
    Users,
    Zap
} from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { ApprovalHistory } from '@/components/workflow/ApprovalHistory';
import { ApprovalActions } from '@/components/workflow/ApprovalActions';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/workflow/RichTextEditor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function JobDescriptionDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const { getWorkflow, createWorkflow } = useWorkflow(id as string);
    const updateJD = useUpdateJobDescription();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [editedTitle, setEditedTitle] = useState('');

    const { data: jd, isLoading: jdLoading } = useQuery({
        queryKey: ['job-description', id],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/job-descriptions/${id}`, {
                withCredentials: true,
            });
            return data;
        },
        enabled: !!id,
    });

    const { data: workflow, isLoading: wfLoading } = getWorkflow;

    const handleStartWorkflow = async () => {
        // In a real app, you'd have an approver selection UI
        try {
            await createWorkflow.mutateAsync({
                jobDescriptionId: id as string,
                approverIds: [user?.id || ''], // Self-approval or admin approval for demo
            });
            toast.success("Workflow Started", {
                description: "The job description has been submitted for approval.",
            });
        } catch (error) {
            toast.error("Error", {
                description: "Failed to start workflow.",
            });
        }
    };

    const handlePublish = async () => {
        try {
            await axios.post(`${API_URL}/job-descriptions/${id}/publish`, {}, { withCredentials: true });
            toast.success("Published", {
                description: "The job description is now public.",
            });
            // Refresh path or just refetch
            router.refresh();
        } catch (error) {
            toast.error("Error", {
                description: "Failed to publish.",
            });
        }
    };

    const handleEdit = () => {
        setEditedContent(jd?.content || '');
        setEditedTitle(jd?.title || '');
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateJD.mutateAsync({
                id: id as string,
                data: {
                    content: editedContent,
                    title: editedTitle
                }
            });
            toast.success("Saved", {
                description: "Job description updated successfully.",
            });
            setIsEditing(false);
        } catch (error) {
            toast.error("Error", {
                description: "Failed to save changes.",
            });
        }
    };

    const { createTemplate } = useTemplates();
    const handleSaveAsTemplate = async () => {
        try {
            await createTemplate.mutateAsync({
                name: `${jd.title} (From JD)`,
                content: jd.content,
            });
        } catch (error) {
            // Error managed by hook
        }
    };

    if (jdLoading || wfLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!jd) return <div>Job Description not found.</div>;

    const isCurrentApprover = workflow?.status === 'IN_PROGRESS' &&
        workflow.steps.find(s => s.order === workflow.currentStepOrder)?.approverId === user?.id;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-3xl font-bold bg-transparent border-b border-primary focus:outline-none w-full"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold">{jd.title}</h1>
                        )}
                        <PresenceList roomId={id as string} />
                    </div>
                    <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{jd.department?.name}</Badge>
                        <Badge className={jd.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {jd.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSaveAsTemplate} disabled={createTemplate.isPending}>
                        {createTemplate.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                        Save as Template
                    </Button>
                    {jd.status === 'DRAFT' && !isEditing && (
                        <Button variant="outline" onClick={handleEdit}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {isEditing && (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updateJD.isPending}>
                                {updateJD.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </Button>
                        </>
                    )}
                    {jd.status === 'APPROVED' && (
                        <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
                            <Globe className="h-4 w-4 mr-2" />
                            Publish
                        </Button>
                    )}
                    {jd.status === 'PUBLISHED' && (
                        <Button variant="outline" onClick={() => window.open(`/jobs/${id}`, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public Page
                        </Button>
                    )}
                    {jd.status === 'DRAFT' && !workflow && !isEditing && (
                        <Button onClick={handleStartWorkflow} disabled={createWorkflow.isPending}>
                            {createWorkflow.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Submit for Approval
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="insights" className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-purple-500" />
                                AI Insights
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Content
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <RichTextEditor
                                            content={editedContent}
                                            onChange={setEditedContent}
                                            jobTitle={editedTitle}
                                        />
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            {typeof jd.content === 'string' ? (
                                                <div dangerouslySetInnerHTML={{ __html: jd.content }} />
                                            ) : (
                                                <pre className="whitespace-pre-wrap">{JSON.stringify(jd.content, null, 2)}</pre>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="insights" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-md flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            Similar Job Descriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <SimilarJDsList jdId={id as string} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-md flex items-center gap-2">
                                            <Users className="h-4 w-4 text-green-500" />
                                            Top Recommended Candidates
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CandidateRecommendations jdId={id as string} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    {isCurrentApprover && (
                        <ApprovalActions workflowId={workflow.id} />
                    )}

                    {workflow && (
                        <ApprovalHistory workflow={workflow} />
                    )}

                    {!workflow && jd.status === 'DRAFT' && (
                        <Card className="bg-blue-50 border-blue-100">
                            <CardContent className="pt-6">
                                <p className="text-sm text-blue-700">
                                    <strong>Ready to progress?</strong> Submit this job description for approval to notify the stakeholders.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function SimilarJDsList({ jdId }: { jdId: string }) {
    const { data: similar, isLoading } = useSimilarJobDescriptions(jdId);

    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />;
    if (!similar || similar.length === 0) return <p className="text-xs text-muted-foreground text-center">No similar job descriptions found.</p>;

    return (
        <div className="space-y-3">
            {similar.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">{s.title}</p>
                        <Badge variant="secondary" className="text-[10px] py-0">{s.status}</Badge>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-blue-600">{(s.similarity * 100).toFixed(0)}%</span>
                        <p className="text-[10px] text-muted-foreground italic">Match</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CandidateRecommendations({ jdId }: { jdId: string }) {
    const { data: recs, isLoading } = useCandidateRecommendations(jdId);

    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />;
    if (!recs || recs.length === 0) return <p className="text-xs text-muted-foreground text-center">No candidate recommendations found yet.</p>;

    return (
        <div className="space-y-3">
            {recs.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">{r.firstName} {r.lastName}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{r.email}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-green-600">{(r.semantic_score * 100).toFixed(0)}%</span>
                        <p className="text-[10px] text-muted-foreground italic">Semantic Fit</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
