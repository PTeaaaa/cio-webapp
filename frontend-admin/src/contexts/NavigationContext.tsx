// Create a NEW file at `src/context/NavigationContext.tsx`

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSidebarItems } from "@/services/sidebars/sidebarAPI";
import jsonNavItems from "@/items/sidebarjson/jsonNavItems.json";

interface NavItem {
    icon?: string;
    name: string;
    path?: string;
    subItems?: SubItem[];
    assigned_place_id?: string | null;
    new?: boolean;
    pro?: boolean;
    role?: string[]; // Add role property
}

export interface SubItem {
    name: string;
    path: string;
    assigned_place_id?: string | null;
    new?: boolean;
    pro?: boolean;
    role?: string[]; // Add role property for sub items too
}

interface FilteredNavigation {
    navItems: NavItem[];
}

interface NavigationContextType {
    filteredNavigation: FilteredNavigation;
    isLoading: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within a NavigationProvider");
    }
    return context;
};

// Helper function to check if user has required role
const hasRequiredRole = (userRole: string | undefined, requiredRoles?: string[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
        return true; // No role restriction
    }
    if (!userRole) {
        return false; // User has no role but item requires role
    }
    return requiredRoles.includes(userRole);
};

// Helper function to filter navigation items based on user role
const filterNavigationByRole = (navItems: NavItem[], userRole: string | undefined): NavItem[] => {
    return navItems
        .filter(item => hasRequiredRole(userRole, item.role))
        .map(item => ({
            ...item,
            subItems: item.subItems?.filter(subItem => hasRequiredRole(userRole, subItem.role))
        }));
};

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading: authLoading, isLoggingOut } = useAuth();
    const [filteredNavigation, setFilteredNavigation] = useState<FilteredNavigation>({
        navItems: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetSidebarItems = async () => {
            console.log('NavigationContext: Starting fetchAndSetSidebarItems', { user, authLoading, isLoggingOut });
            
            // Don't fetch during logout process
            if (isLoggingOut) {
                console.log('NavigationContext: Logout in progress, skipping navigation fetch');
                setIsLoading(false);
                return;
            }
            
            // Wait for auth to finish loading
            if (authLoading) {
                console.log('NavigationContext: Auth still loading, waiting...');
                setIsLoading(true);
                return;
            }
            
            // Get user role (assuming it's in user object, adjust based on your user structure)
            const userRole = user?.role || undefined;
            console.log('NavigationContext: User role:', userRole);
            
            // Only run if the user is authenticated (user exists)
            if (!user) {
                console.log('NavigationContext: No user found, setting basic navigation');
                // Set basic navigation items for non-authenticated users (filter out role-restricted items)
                const basicNavItems: NavItem[] = [...jsonNavItems.navItems as NavItem[]];
                const filteredBasicItems = filterNavigationByRole(basicNavItems, undefined);
                
                // Remove the places item if user is not authenticated
                const placeIndex = filteredBasicItems.findIndex(item => item.icon === "MapPinHouse");
                if (placeIndex !== -1) {
                    filteredBasicItems.splice(placeIndex, 1);
                }
                
                setFilteredNavigation({ navItems: filteredBasicItems });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            
            try {
                console.log('NavigationContext: Fetching sidebar items...');
                
                // Add a small delay to ensure token refresh has completed if needed
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const dynamicPlaces = await getSidebarItems();
                console.log('NavigationContext: Received sidebar items:', dynamicPlaces);

                const yourPlacesNavItem: NavItem = {
                    icon: "MapPinHouse",
                    name: "สถานที่ของคุณ",
                    subItems: dynamicPlaces.map(place => ({
                        name: place.name,
                        path: `/listpeople/${place.id}`,
                    })),
                };

                const navItemsCopy: NavItem[] = [...jsonNavItems.navItems as NavItem[]];
                console.log('NavigationContext: Initial nav items from JSON:', navItemsCopy);
                
                const placeIndex = navItemsCopy.findIndex(item => item.icon === "MapPinHouse");

                if (placeIndex !== -1) {
                    if (dynamicPlaces.length > 0) {
                        navItemsCopy[placeIndex] = yourPlacesNavItem;
                    } else {
                        navItemsCopy.splice(placeIndex, 1);
                    }
                }

                // Apply role-based filtering
                const roleFilteredItems = filterNavigationByRole(navItemsCopy, userRole);
                console.log('NavigationContext: Role-filtered navigation items:', roleFilteredItems);
                
                setFilteredNavigation({
                    navItems: roleFilteredItems,
                });
            } catch (error) {
                console.error('NavigationContext: Error fetching sidebar items:', error);
                
                // Fallback to just the JSON navigation items if API fails
                const navItemsCopy: NavItem[] = [...jsonNavItems.navItems as NavItem[]];
                const placeIndex = navItemsCopy.findIndex(item => item.icon === "MapPinHouse");
                
                // Remove the places item if API failed
                if (placeIndex !== -1) {
                    navItemsCopy.splice(placeIndex, 1);
                }
                
                // Apply role-based filtering even for fallback
                const roleFilteredItems = filterNavigationByRole(navItemsCopy, userRole);
                
                setFilteredNavigation({
                    navItems: roleFilteredItems,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetSidebarItems();
    }, [user, authLoading, isLoggingOut]);

    return (
        <NavigationContext.Provider value={{ filteredNavigation, isLoading }}>
            {children}
        </NavigationContext.Provider>
    );
};