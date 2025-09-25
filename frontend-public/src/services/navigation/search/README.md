# Search Navigation for FilterSearch Component

This module provides navigation functionality that's compatible with the chained combobox logic in the `FilterSearch` component.

## URL Pattern

The navigation follows this URL pattern:
```
${BASE_URL}/{Department}/{placeUUID}/{personUUID}
```

Where:
- `Department` corresponds to `selectedOrg` (organization type)
- `placeUUID` corresponds to `selectedAgency` (agency/place)
- `personUUID` corresponds to `selectedYear` (year/person data)

## Usage

### Basic Usage with Hook

```tsx
import { useSearchNavigation, type FilterSearchState } from './searchNavigationClaude';

function MyComponent() {
    const navigate = useSearchNavigation();
    const [selectedOrg, setSelectedOrg] = useState("");
    const [selectedAgency, setSelectedAgency] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const handleSubmit = () => {
        const state: FilterSearchState = {
            selectedOrg,
            selectedAgency,
            selectedYear
        };
        
        navigate(state);
    };
}
```

### Navigation Options

```tsx
// Navigate in current tab (default)
navigate(state);

// Navigate in new tab
navigate(state, { openInNewTab: true });

// Replace current page instead of pushing to history
navigate(state, { replace: true });

// Use custom base URL
navigate(state, { baseUrl: 'https://custom-domain.com' });
```

### Utility Functions

#### Check if Navigation is Possible
```tsx
import { canNavigate } from './searchNavigationClaude';

const state = { selectedOrg: "ministry" };
if (canNavigate(state)) {
    // Can navigate - at least one selection is made
}
```

#### Get Navigation Information
```tsx
import { getNavigationInfo } from './searchNavigationClaude';

const navInfo = getNavigationInfo(state);
console.log(navInfo);
// {
//   level: 1,
//   description: "Organization selected - can navigate to department",
//   canNavigate: true,
//   path: "/ministry"
// }
```

#### Build Path/URL Manually
```tsx
import { buildNavigationPath, buildNavigationUrl } from './searchNavigationClaude';

const path = buildNavigationPath(state);        // "/ministry/agency-1"
const fullUrl = buildNavigationUrl(state);      // "https://domain.com/ministry/agency-1"
```

## Navigation Levels

The navigation function handles different levels of selection:

1. **Level 0**: No selection - navigates to root "/"
2. **Level 1**: Organization only - navigates to "/{org}"
3. **Level 2**: Organization + Agency - navigates to "/{org}/{agency}"
4. **Level 3**: All selections - navigates to "/{org}/{agency}/{year}"

## Integration with FilterSearch

The navigation function is designed to work seamlessly with the existing `FilterSearch` component:

1. **State Mapping**:
   - `selectedOrg` → Department segment
   - `selectedAgency` → Place UUID segment  
   - `selectedYear` → Person UUID segment

2. **Chained Logic**: The function respects the chained nature of the comboboxes - you can navigate with partial selections.

3. **URL Encoding**: All segments are properly URL-encoded to handle special characters.

## Example Integration

See `example-integration.tsx` for a complete example of how to integrate the navigation function with a FilterSearch-like component.

## TypeScript Types

```tsx
interface FilterSearchState {
    selectedOrg?: string;      // Department/Organization type
    selectedAgency?: string;   // Place UUID (Agency)
    selectedYear?: string;     // Person UUID (Year/Person data)
}

interface NavigationOptions {
    replace?: boolean;         // Use router.replace instead of push
    openInNewTab?: boolean;   // Open in new tab instead of current window
    baseUrl?: string;         // Override base URL
}
```

## Error Handling

- Empty or whitespace-only values are filtered out
- If no valid selections are made, navigates to root "/"
- URL segments are properly encoded to handle special characters
- Graceful fallback if base URL is not available
