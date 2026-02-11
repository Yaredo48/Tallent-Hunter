'use client';

import { useState } from 'react';
import { useTemplates } from '@/hooks/use-templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, FileText, Trash2, Edit, Search, BookOpen, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function TemplatesPage() {
    const { getTemplates, createTemplate, deleteTemplate } = useTemplates();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });

    if (getTemplates.isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const templates = getTemplates.data || [];
    const filteredTemplates = templates.filter((t: any) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTemplate.mutateAsync({
            name: newTemplate.name,
            content: { html: newTemplate.content },
        });
        setIsModalOpen(false);
        setNewTemplate({ name: '', content: '' });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Library & Templates
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Standardize your job descriptions with reusable templates.
                    </p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                            <Plus className="mr-2 h-4 w-4" /> Create New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Create JD Template</DialogTitle>
                            <DialogDescription>
                                Define a structure that can be reused across your organization.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name</Label>
                                <Input
                                    id="name"
                                    required
                                    placeholder="e.g., Senior Engineering Role"
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Default Content (Structure)</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter the template structure here..."
                                    value={newTemplate.content}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={createTemplate.isPending}>
                                    {createTemplate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Template"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 max-w-md py-6 rounded-xl border-slate-200 dark:border-slate-800"
                />
            </div>

            {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-xl font-semibold">No templates found</h3>
                    <p className="text-muted-foreground">Get started by creating your first standardized template.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template: any) => (
                        <Card key={template.id} className="group overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none">
                                        Library
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <CardTitle className="text-xl font-bold line-clamp-1">{template.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" /> Updated {new Date(template.updatedAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
                                    {typeof template.content === 'object' ? (template.content.html || JSON.stringify(template.content)) : template.content}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2 border-t border-slate-50 dark:border-slate-900 pt-4">
                                <Button variant="ghost" size="sm" className="rounded-xl flex-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl flex-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                    onClick={() => deleteTemplate.mutate(template.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
