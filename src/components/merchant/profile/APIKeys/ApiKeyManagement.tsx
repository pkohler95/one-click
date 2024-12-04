import React, { useEffect, useState } from 'react';

interface ApiKey {
  id: number;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

interface ApiKeyManagementProps {
  userId: string;
}

export default function ApiKeyManagement({ userId }: ApiKeyManagementProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    // Fetch all API keys for the user
    const fetchApiKeys = async () => {
      const response = await fetch(`/api/keys/fetch`, {
        method: 'GET',
        headers: {
          'user-id': userId,
        },
      });
      const data = await response.json();
      setApiKeys(data.apiKeys);
    };

    fetchApiKeys();
  }, [userId]);

  const revokeKey = async (apiKeyId: number) => {
    const response = await fetch(`/api/keys/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
      },
      body: JSON.stringify({ apiKeyId }),
    });

    if (response.ok) {
      // Update the UI after successful revocation
      setApiKeys(apiKeys.filter((key) => key.id !== apiKeyId));
    } else {
      console.error('Failed to revoke API key');
    }
  };

  return (
    <div className="container mx-auto  py-6">
      <h2 className="text-2xl font-bold mb-4">API Key Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                ID
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Expires At
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Status
              </th>
              <th className="px-4 py-2 text-center text-gray-600 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key, index) => (
              <tr
                key={key.id}
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } border-b`}
              >
                <td className="px-4 py-2 text-gray-800">{key.id}</td>
                <td className="px-4 py-2 text-gray-800">
                  {new Date(key.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {key.expiresAt
                    ? new Date(key.expiresAt).toLocaleString()
                    : 'No expiration'}
                </td>
                <td
                  className={`px-4 py-2 font-medium ${
                    key.isActive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {key.isActive ? 'Active' : 'Inactive'}
                </td>
                <td className="px-4 py-2 text-center">
                  {key.isActive && (
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
