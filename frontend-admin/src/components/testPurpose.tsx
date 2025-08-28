// You can create this as a new file, e.g., `src/components/dev/TestFetchButton.tsx`

"use client";

import { getSidebarItems } from "@/services/sidebars/sidebarAPI"; // Adjust the import path if needed

const TestFetchButton = () => {
  const handleTestFetch = async () => {
    console.log("--- [TEST] Starting manual fetch test ---");
    try {
      const items = await getSidebarItems();

      if (items && items.length > 0) {
        console.log("[TEST] Fetch successful! Received items:", items);
      } else {
        console.log("[TEST] Fetch call was made, but no items were returned. This could be due to permissions or an empty list.");
      }
    } catch (error: any) {
      console.error("[TEST] Manual fetch test failed with an error:", error.message);
    }
    console.log("--- [TEST] Manual fetch test finished ---");
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px dashed #ff0000', 
      margin: '20px', 
      backgroundColor: '#fff0f0' 
    }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Development Test Control</h2>
      <p>Use this button to test the silent access token refresh.</p>
      <ol style={{ listStyle: 'decimal', marginLeft: '20px', marginBlock: '10px' }}>
        <li>Set `JWT_EXPIRES_IN` to `"15s"` in the backend `.env` file and restart the server.</li>
        <li>Log in to the application.</li>
        <li>Wait for 20 seconds.</li>
        <li>Click the button below and observe the browser console.</li>
      </ol>
      <button
        onClick={handleTestFetch}
        style={{
          marginTop: '10px',
          padding: '10px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Fetch with Expired Access Token
      </button>
    </div>
  );
};

export default TestFetchButton;
