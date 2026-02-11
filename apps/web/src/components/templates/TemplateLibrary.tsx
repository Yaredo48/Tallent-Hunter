'use client';

import { useTemplates } from '@/hooks/use-templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface TemplateLibraryProps {
    onSelect: (template: any) => void;
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
    const { getTemplates } = useTemplates();
    const [search, setSearch] = useState('');

    if (getTemplates.isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    const templates = getTemplates.data || [];
    const filtered = templates.filter((t: any) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search library..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No templates found.
                    </div>
                ) : (
                    filtered.map((template: any) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:border-blue-500 transition-colors group"
                            onClick={() => onSelect(template)}
                        >
                            <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-sm font-bold group-hover:text-blue-600">{template.name}</CardTitle>
                                    <CardDescription className="text-xs">Standardized Structure</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">Select</Button>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
