"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SpotifyCallback() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  useEffect(() => {
    if (code) {
      console.log("Authorization code:", code);
    }
  }, [code]);

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Spotify Authentication</h1>

      {error ? (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          <p className="font-medium">Error: {error}</p>
          <p>Authentication failed. Please try again.</p>
        </div>
      ) : code ? (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
          <p className="font-medium">Success!</p>
          <p>Your authorization code has been received.</p>
          <div className="mt-4 p-3 bg-gray-100 rounded-md overflow-auto">
            <pre className="text-sm">{code}</pre>
          </div>
          <p className="mt-4">
            Use this code to get your refresh token. See instructions below.
          </p>
        </div>
      ) : (
        <div className="p-4 mb-4 text-gray-700 bg-gray-100 rounded-md">
          <p>Waiting for authorization code...</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Next Steps:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Use the authorization code above to request a refresh token.</li>
          <li>
            Run the following cURL command in your terminal (replace CLIENT_ID,
            CLIENT_SECRET, and the code):
            <div className="mt-2 p-3 bg-gray-100 rounded-md overflow-auto">
              <pre className="text-xs">
                {`curl -X POST "https://accounts.spotify.com/api/token" \\
    -H "Content-Type: application/x-www-form-urlencoded" \\
    -d "grant_type=authorization_code" \\
    -d "code=YOUR_AUTH_CODE" \\
    -d "redirect_uri=http://127.0.0.1:3000/callback" \\
    -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET"`}
              </pre>
            </div>
          </li>
          <li>
            From the response, copy the <code>refresh_token</code> value.
          </li>
          <li>
            Add it to your <code>.env.local</code> file along with your client
            ID and secret.
          </li>
        </ol>
      </div>
    </div>
  );
}
