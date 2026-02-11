'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Loader2, Briefcase, MapPin, Building2, Calendar, Share2, CheckCircle2, User, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/ui/file-uploader';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PublicJobView() {
    const params = useParams();
    const id = params.id as string;
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        resumeUrl: '',
    });

    const { data: jd, isLoading, error } = useQuery({
        queryKey: ['public-jd', id],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/job-descriptions/public/${id}`);
            return data;
        },
    });

    const applyMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            return axios.post(`${API_URL}/applications/apply`, {
                ...data,
                jobDescriptionId: id,
            });
        },
        onSuccess: () => {
            toast.success("Application Submitted!", {
                description: "We've received your application. Good luck!",
            });
            setIsApplyModalOpen(false);
            setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', resumeUrl: '' });
        },
        onError: (error: any) => {
            toast.error("Submission Failed", {
                description: error.response?.data?.message || "There was an error submitting your application.",
            });
        },
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        applyMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !jd) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Job Not Found</h1>
                <p className="text-muted-foreground">This job description may have been removed or is no longer public.</p>
                <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-3 py-1">
                                Active Opening
                            </Badge>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {jd.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                    {jd.organization?.name}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                    Remote / Global
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                    Full-time
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20">
                                        Apply Now
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Apply for {jd.title}</DialogTitle>
                                        <DialogDescription>
                                            Submit your details below to apply for this position.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleApply} className="space-y-6 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    required
                                                    placeholder="John"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    required
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 234 567 890"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="resume">Resume (PDF)</Label>
                                            <FileUploader
                                                onUploadSuccess={(url) => setFormData({ ...formData, resumeUrl: url })}
                                                accept={{ 'application/pdf': ['.pdf'] }}
                                                label="Click or drag to upload resume"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-bold rounded-xl" disabled={applyMutation.isPending}>
                                                {applyMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : "Submit Application"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="w-full py-6 rounded-xl">
                                <Share2 className="mr-2 h-4 w-4" /> Share Job
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-sm rounded-2xl">
                            <CardHeader>
                                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                    About the Role
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: jd.content.html || jd.content }} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Job Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-muted-foreground">Department</span>
                                    <span className="font-semibold">{jd.department?.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-muted-foreground">Experience</span>
                                    <span className="font-semibold">Mid-Senior</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Posted On</span>
                                    <span className="font-semibold">{new Date(jd.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-2xl p-6 text-white text-center space-y-4 shadow-xl shadow-blue-500/20">
                            <h3 className="font-bold text-xl">Ready to join us?</h3>
                            <p className="text-blue-100 text-sm">Help us build the next generation of talent architecture engine.</p>
                            <Button variant="secondary" className="w-full font-bold" onClick={() => setIsApplyModalOpen(true)}>
                                Submit Application
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 text-center text-slate-400 text-sm">
                Powered by <span className="font-bold text-slate-600 dark:text-slate-300">Antigravity Talent Hunter</span>
            </div>
        </div>
    );
}
