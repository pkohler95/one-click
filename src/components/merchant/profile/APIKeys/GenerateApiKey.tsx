import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface GenerateApiKeyProps {
  userId: string;
}

export default function GenerateApiKey({ userId }: GenerateApiKeyProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateKey = async () => {
    const response = await fetch('/api/keys/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
      },
    });

    if (response.status === 401) {
      console.error('Unauthorized: Ensure userId is valid and provided.');
      return;
    }

    const data = await response.json();
    if (data.apiKey) {
      setApiKey(data.apiKey);
      setCopied(false); // Reset the copied state
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied status after 2 seconds
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateKey}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Generate API Key
      </button>
      {apiKey && (
        <div className="relative flex items-center gap-2 w-full">
          {/* API Key Display */}
          <p
            onClick={copyToClipboard}
            className="flex-1 font-mono bg-gray-100 p-2 rounded border border-gray-300 cursor-pointer select-all hover:bg-gray-200 transition duration-200 ease-in-out overflow-x-auto break-all max-w-full whitespace-pre-wrap"
          >
            {apiKey}
          </p>

          {/* Copy Icon */}
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Copy API Key"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
