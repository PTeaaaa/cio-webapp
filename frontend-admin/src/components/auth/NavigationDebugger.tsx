"use client";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function NavigationDebugger() {
    const { user, filteredNavigation } = useAuth();

    if (!user) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">Navigation Debugger</h3>
                <p>No user logged in</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Navigation Debugger</h3>

            {/* User Info */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Current User:</h4>
                <div className="text-sm space-y-1">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Assigned Place ID:</strong> {user.assigned_place_id || "None"}</p>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Main Navigation Items ({filteredNavigation.navItems.length}):</h4>
                <ul className="text-sm space-y-1">
                    {filteredNavigation.navItems.map((item, index) => (
                        <li key={index} className="pl-2">
                            <strong>{item.name}</strong>
                            {item.path && <span className="text-gray-600"> - {item.path}</span>}
                            {item.assigned_place_id && (
                                <span className="text-blue-600"> (Place: {item.assigned_place_id})</span>
                            )}
                            {item.subItems && item.subItems.length > 0 && (
                                <ul className="pl-4 mt-1">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex} className="text-gray-700">
                                            {subItem.name} - {subItem.path}
                                            {subItem.assigned_place_id && (
                                                <span className="text-blue-600"> (Place: {subItem.assigned_place_id})</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Others Items */}
            <div>
                <h4 className="font-medium mb-2">Others Navigation Items ({filteredNavigation.othersItems.length}):</h4>
                <ul className="text-sm space-y-1">
                    {filteredNavigation.othersItems.map((item, index) => (
                        <li key={index} className="pl-2">
                            <strong>{item.name}</strong>
                            {item.path && <span className="text-gray-600"> - {item.path}</span>}
                            {item.subItems && item.subItems.length > 0 && (
                                <ul className="pl-4 mt-1">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex} className="text-gray-700">
                                            {subItem.name} - {subItem.path}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
