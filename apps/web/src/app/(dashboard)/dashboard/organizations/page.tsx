'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useOrganization, useDepartments, useCreateDepartment, useDeleteDepartment, useUpdateOrganization } from '@/hooks/use-organizations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '@/components/ui/file-uploader';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function OrganizationsPage() {
    const { user } = useAuthStore();
    const orgId = user?.organizationId || '';
    const { data: organization, isLoading: orgLoading } = useOrganization(orgId);
    const { data: departments, isLoading: deptsLoading } = useDepartments(orgId);
    const createDepartment = useCreateDepartment(orgId);
    const deleteDepartment = useDeleteDepartment();
    const updateOrg = useUpdateOrganization();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState<string>('');

    const handleCreateDepartment = async () => {
        if (!newDeptName.trim()) return;

        await createDepartment.mutateAsync({
            name: newDeptName,
            parentId: selectedParentId || undefined,
        });

        setNewDeptName('');
        setSelectedParentId('');
        setIsCreateOpen(false);
    };

    const handleDeleteDepartment = async (id: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            await deleteDepartment.mutateAsync(id);
        }
    };

    if (orgLoading || deptsLoading) {
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
                        {organization?.name || 'Organization'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your organization structure and departments
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Department</DialogTitle>
                            <DialogDescription>
                                Add a new department to your organization structure
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Engineering, Marketing"
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent">Parent Department (Optional)</Label>
                                <select
                                    id="parent"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                                    value={selectedParentId}
                                    onChange={(e) => setSelectedParentId(e.target.value)}
                                >
                                    <option value="">None (Top Level)</option>
                                    {departments?.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateDepartment} disabled={createDepartment.isPending}>
                                {createDepartment.isPending ? 'Creating...' : 'Create Department'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Organization Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Organization Details</CardTitle>
                        <CardDescription>Your organization information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {organization?.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {organization?.slug}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Departments</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {departments?.length || 0}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization ID</dt>
                                <dd className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                    {organization?.id}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Upload your organization logo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {organization?.logoUrl && (
                            <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <img
                                    src={`${API_URL}${organization.logoUrl}`}
                                    alt="Organization Logo"
                                    className="h-20 w-auto object-contain"
                                />
                            </div>
                        )}
                        <FileUploader
                            onUploadSuccess={(url) => updateOrg.mutate({ id: orgId, data: { logoUrl: url } })}
                            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                            label={organization?.logoUrl ? "Change Logo" : "Upload Logo"}
                            className="bg-transparent"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Departments List */}
            <Card>
                <CardHeader>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>
                        {departments?.length || 0} department{departments?.length !== 1 ? 's' : ''} in your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {departments && departments.length > 0 ? (
                        <div className="space-y-3">
                            {departments.map((dept: any) => (
                                <div
                                    key={dept.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {dept.name}
                                            </h3>
                                            {dept.parent && (
                                                <Badge variant="outline" className="text-xs">
                                                    Child of: {dept.parent.name}
                                                </Badge>
                                            )}
                                            {!dept.parent && (
                                                <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                    Top Level
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {dept._count?.users || 0} members
                                            </span>
                                            {dept.children && dept.children.length > 0 && (
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {dept.children.length} sub-departments
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {user?.role === 'ORG_ADMIN' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => handleDeleteDepartment(dept.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No departments yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Get started by creating your first department
                            </p>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                Create Department
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
