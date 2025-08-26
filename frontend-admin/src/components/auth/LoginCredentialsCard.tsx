import React from "react";

export default function LoginCredentialsCard() {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
        Demo Login Credentials
      </h3>
      <div className="space-y-2 text-xs text-blue-700 dark:text-blue-400">
        <div>
          <strong>Admin:</strong> admin / password123
        </div>
        <div>
          <strong>Hospital User:</strong> hospital_A_user / password456
        </div>
        <div>
          <strong>Clinic User:</strong> clinic_B_user / password789
        </div>
        <div>
          <strong>Guest:</strong> guest / guestpass
        </div>
      </div>
    </div>
  );
}
