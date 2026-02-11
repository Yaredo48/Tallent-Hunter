'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useJobDescriptions, useGenerateJobDescription, useDeleteJobDescription } from '@/hooks/use-job-descriptions';
import { useDepartments } from '@/hooks/use-organizations';
import { useTemplates } from '@/hooks/use-templates';
import { TemplateLibrary } from '@/components/templates/TemplateLibrary';
import { BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    IN_REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    PUBLISHED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    ARCHIVED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function JobDescriptionsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const orgId = user?.organizationId || '';

    const { data: jobDescriptions, isLoading } = useJobDescriptions(orgId);
    const { data: departments } = useDepartments(orgId);
    const generateJD = useGenerateJobDescription();
    const deleteJD = useDeleteJobDescription();

    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedDeptId, setSelectedDeptId] = useState('');

    const handleGenerateJD = async () => {
        if (!title.trim() || !selectedDeptId) return;

        await generateJD.mutateAsync({
            title,
            departmentId: selectedDeptId,
            organizationId: orgId,
        });

        setTitle('');
        setSelectedDeptId('');
        setIsGenerateOpen(false);
    };

    const handleDeleteJD = async (id: string) => {
        if (confirm('Are you sure you want to delete this job description?')) {
            await deleteJD.mutateAsync(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Job Descriptions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage and generate job descriptions with AI
                    </p>
                </div>

                <div className="flex gap-3">
                    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Use Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Select a Template</DialogTitle>
                                <DialogDescription>
                                    Choose a standardized template to start your job description.
                                </DialogDescription>
                            </DialogHeader>
                            <TemplateLibrary onSelect={(template) => {
                                setTitle(template.name);
                                // In a real app, we'd pre-fill the content area too
                                setIsGenerateOpen(false);
                            }} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Generate with AI
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Job Description</DialogTitle>
                                <DialogDescription>
                                    Use AI to automatically generate a job description
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Senior Software Engineer"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <select
                                        id="department"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                        value={selectedDeptId}
                                        onChange={(e) => setSelectedDeptId(e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        {departments?.map((dept: any) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        💡 AI will generate a comprehensive job description based on the title and department context.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleGenerateJD} disabled={generateJD.isPending || !title || !selectedDeptId} className="bg-blue-600 hover:bg-blue-700">
                                    {generateJD.isPending ? 'Generating...' : 'Generate'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', count: jobDescriptions?.length || 0, color: 'blue' },
                    { label: 'Draft', count: jobDescriptions?.filter((jd: any) => jd.status === 'DRAFT').length || 0, color: 'gray' },
                    { label: 'In Review', count: jobDescriptions?.filter((jd: any) => jd.status === 'IN_REVIEW').length || 0, color: 'yellow' },
                    { label: 'Published', count: jobDescriptions?.filter((jd: any) => jd.status === 'PUBLISHED').length || 0, color: 'green' },
                ].map((stat, idx) => (
                    <Card key={idx}>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">{stat.label}</CardDescription>
                            <CardTitle className="text-3xl">{stat.count}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Job Descriptions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Job Descriptions</CardTitle>
                    <CardDescription>
                        {jobDescriptions?.length || 0} job description{jobDescriptions?.length !== 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {jobDescriptions && jobDescriptions.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Creator</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobDescriptions.map((jd: any) => (
                                        <TableRow key={jd.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <TableCell className="font-medium">{jd.title}</TableCell>
                                            <TableCell>{jd.department?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[jd.status] || statusColors.DRAFT}>
                                                    {jd.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                {jd.creator?.firstName} {jd.creator?.lastName}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(jd.updatedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/dashboard/job-descriptions/${jd.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                    {user?.role === 'ORG_ADMIN' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteJD(jd.id);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No job descriptions yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Get started by generating your first AI-powered job description
                            </p>
                            <Button onClick={() => setIsGenerateOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Generate with AI
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
