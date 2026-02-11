'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Here's an overview of your Talent Architecture Engine workspace
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Job Descriptions</CardDescription>
                        <CardTitle className="text-4xl">24</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pending Approvals</CardDescription>
                        <CardTitle className="text-4xl">8</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-orange-600 dark:text-orange-400">Requires your attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Departments</CardDescription>
                        <CardTitle className="text-4xl">12</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Across 3 divisions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>AI Generated</CardDescription>
                        <CardTitle className="text-4xl">18</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-purple-600 dark:text-purple-400">75% automation rate</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest job description updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: 'Senior Software Engineer', status: 'Approved', time: '2 hours ago' },
                                { title: 'Product Manager', status: 'In Review', time: '5 hours ago' },
                                { title: 'UX Designer', status: 'Draft', time: '1 day ago' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <p className="text-sm font-medium">Create JD</p>
                            </button>
                            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <p className="text-sm font-medium">AI Generate</p>
                            </button>
                            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="text-sm font-medium">Add Department</p>
                            </button>
                            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p className="text-sm font-medium">View Analytics</p>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
