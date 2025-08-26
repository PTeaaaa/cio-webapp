"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import NavigationDebugger from "@/components/auth/NavigationDebugger";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function NavigationTestPage() {
    const { user } = useAuth();

    return (
        <div>
            <PageBreadcrumb pageTitle="Navigation Filter Test" />

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Role-Based Navigation Testing</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">How it works:</h3>
                        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                            <p><strong>Admin users:</strong> See all navigation items (no filtering)</p>
                            <p><strong>Place users:</strong> Only see items that match their assigned_place_id</p>
                            <p><strong>Other roles:</strong> Only see items without place restrictions (no assigned_place_id)</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Test Users:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <strong>Admin:</strong> admin / password123
                                <br />
                                <span className="text-gray-600">Should see all items</span>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                                <strong>Hospital A User:</strong> hospital_A_user / password456
                                <br />
                                <span className="text-gray-600">Should only see place-A items</span>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <strong>Clinic B User:</strong> clinic_B_user / password789
                                <br />
                                <span className="text-gray-600">Should only see place-B items</span>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded">
                                <strong>Guest:</strong> guest / guestpass
                                <br />
                                <span className="text-gray-600">Should only see items without place restrictions</span>
                            </div>
                        </div>
                    </div>

                    <NavigationDebugger />
                </div>
            </div>
        </div>
    );
}
