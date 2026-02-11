'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';

interface FileUploaderProps {
    onUploadSuccess: (url: string) => void;
    maxSize?: number;
    accept?: Record<string, string[]>;
    label?: string;
    className?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function FileUploader({
    onUploadSuccess,
    maxSize = 10 * 1024 * 1024,
    accept = { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
    label = 'Upload resume (PDF) or logo (Image)',
    className,
}: FileUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUploading(true);
        setProgress(0);
        setSuccess(false);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const { data } = await axios.post(`${API_URL}/storage/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setProgress(percentCompleted);
                },
                withCredentials: true,
            });

            onUploadSuccess(data.url);
            setSuccess(true);
            toast.success('File uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload file');
            setFile(null);
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize,
        accept,
        multiple: false,
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setSuccess(false);
        setProgress(0);
    };

    return (
        <div className={cn('w-full', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center',
                    isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50',
                    success ? 'border-green-500 bg-green-50/10' : ''
                )}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-3">
                    {uploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                            <p className="text-sm font-medium text-slate-600">Uploading... {progress}%</p>
                            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : file ? (
                        <div className="flex items-center gap-3 w-full max-w-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in duration-200">
                            <div className={cn(
                                "p-2 rounded-lg",
                                success ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            )}>
                                {success ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={clearFile}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-200">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isDragActive ? 'Drop it here!' : label}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    PDF or Images up to 10MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
