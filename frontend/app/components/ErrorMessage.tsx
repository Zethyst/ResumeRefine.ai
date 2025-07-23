import { AlertCircle } from "lucide-react";
import React from "react";

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
