// Create a NEW file at `src/context/NavigationContext.tsx`

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSidebarItems } from "@/services/sidebar/sidebarAPI";
import jsonNavItems from "@/items/sidebarjson/jsonNavItems.json";

interface NavItem {
    icon?: string;
    name: string;
    path?: string;
    subItems?: SubItem[];
    assigned_place_id?: string | null;
    new?: boolean;
    pro?: boolean;
}

export interface SubItem {
    name: string;
    path: string;
    assigned_place_id?: string | null;
    new?: boolean;
    pro?: boolean;
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

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [filteredNavigation, setFilteredNavigation] = useState<FilteredNavigation>({
        navItems: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetSidebarItems = async () => {
            console.log('NavigationContext: Starting fetchAndSetSidebarItems', { user, authLoading });
            
            // Wait for auth to finish loading
            if (authLoading) {
                console.log('NavigationContext: Auth still loading, waiting...');
                return;
            }
            
            // Only run if the user is authenticated (user exists)
            if (!user) {
                console.log('NavigationContext: No user found, setting basic navigation');
                // Set basic navigation items for non-authenticated users
                const basicNavItems: NavItem[] = [...jsonNavItems.navItems as NavItem[]];
                const placeIndex = basicNavItems.findIndex(item => item.icon === "MapPinHouse");
                
                // Remove the places item if user is not authenticated
                if (placeIndex !== -1) {
                    basicNavItems.splice(placeIndex, 1);
                }
                
                setFilteredNavigation({ navItems: basicNavItems });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            
            try {
                console.log('NavigationContext: Fetching sidebar items...');
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

                console.log('NavigationContext: Final navigation items:', navItemsCopy);
                
                // Here you would call your original filtering logic if needed for roles
                // For now, we'll just set the combined list.
                setFilteredNavigation({
                    navItems: navItemsCopy,
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
                
                setFilteredNavigation({
                    navItems: navItemsCopy,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetSidebarItems();
    }, [user, authLoading]);

    return (
        <NavigationContext.Provider value={{ filteredNavigation, isLoading }}>
            {children}
        </NavigationContext.Provider>
    );
};