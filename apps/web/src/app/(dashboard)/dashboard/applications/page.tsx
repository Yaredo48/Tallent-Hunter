'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useApplications } from '@/hooks/use-applications';
import { useJobDescriptions } from '@/hooks/use-job-descriptions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Loader2,
    MoreHorizontal,
    Mail,
    Phone,
    ExternalLink,
    Search,
    Filter,
    UserCheck,
    Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUS_COLORS: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    SCREENING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    INTERVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    OFFERED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    HIRED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ApplicationsPage() {
    const { getApplications, updateStatus, screenApplication } = useApplications();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    if (getApplications.isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const applications = getApplications.data || [];

    const filteredApplications = applications.filter((app: any) => {
        const matchesSearch =
            app.candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobDescription.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground"> Manage candidates and track their progress through the hiring funnel.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                        Total: {applications.length}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search candidates or jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFERED">Offered</option>
                        <option value="HIRED">Hired</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Job Description</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead>AI Match</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((app: any) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {app.candidate.firstName} {app.candidate.lastName}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {app.candidate.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{app.jobDescription.title}</span>
                                                <span className="text-xs text-muted-foreground">{app.jobDescription.department?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {app.matchScore !== null ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge className={cn(
                                                                "cursor-help border-none",
                                                                app.matchScore >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                                    app.matchScore >= 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            )}>
                                                                <Sparkles className="h-3 w-3 mr-1" />
                                                                {app.matchScore}%
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-[250px] p-3 text-xs leading-relaxed">
                                                            <p className="font-bold mb-1 italic text-blue-500">AI Analysis:</p>
                                                            {app.matchAnalysis}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Not screened</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${STATUS_COLORS[app.status]} border-none`}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[200px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => screenApplication.mutate(app.id)}
                                                        disabled={screenApplication.isPending && screenApplication.variables === app.id}
                                                    >
                                                        {screenApplication.isPending && screenApplication.variables === app.id ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                                        )}
                                                        Screen with AI
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {Object.keys(STATUS_COLORS).map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => updateStatus.mutate({ id: app.id, status })}
                                                            className="flex justify-between items-center"
                                                        >
                                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                                            {app.status === status && <UserCheck className="h-3 w-3 text-green-500" />}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => window.open(app.candidate.resumeUrl, '_blank')}>
                                                        <ExternalLink className="mr-2 h-4 w-4" /> View Resume
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
