import { NextResponse } from "next/server";

// These would normally be environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || "";

export async function POST(request: Request) {
  try {
    // Get the request type from the query params
    const { searchParams } = new URL(request.url);
    const requestType = searchParams.get("type") || "token";

    if (requestType === "token") {
      // Get a new access token using the refresh token
      if (
        !SPOTIFY_CLIENT_ID ||
        !SPOTIFY_CLIENT_SECRET ||
        !SPOTIFY_REFRESH_TOKEN
      ) {
        return NextResponse.json(
          { error: "Missing Spotify credentials" },
          { status: 500 }
        );
      }

      const basic = Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64");

      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: SPOTIFY_REFRESH_TOKEN,
          }).toString(),
        }
      );

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error("Spotify token request failed:", errorData);
        return NextResponse.json(
          { error: "Failed to get Spotify token" },
          { status: tokenResponse.status }
        );
      }

      const tokenData = await tokenResponse.json();
      return NextResponse.json(tokenData);
    }

    if (requestType === "api") {
      // Proxy a regular API request
      const endpoint = searchParams.get("endpoint");
      const accessToken = searchParams.get("token");

      if (!endpoint) {
        return NextResponse.json(
          { error: "Missing endpoint parameter" },
          { status: 400 }
        );
      }

      if (!accessToken) {
        return NextResponse.json(
          { error: "Missing access token" },
          { status: 400 }
        );
      }

      const apiResponse = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        // Forward the error response
        return NextResponse.json(data, { status: apiResponse.status });
      }

      return NextResponse.json(data);
    }

    if (requestType === "batch-playlists") {
      // Get multiple playlists at once with minimal data
      const playlistIds = searchParams.get("ids")?.split(",") || [];
      const accessToken = searchParams.get("token");

      if (playlistIds.length === 0) {
        return NextResponse.json(
          { error: "Missing playlist IDs" },
          { status: 400 }
        );
      }

      if (!accessToken) {
        return NextResponse.json(
          { error: "Missing access token" },
          { status: 400 }
        );
      }

      // Fetch all playlists in parallel
      try {
        const playlistPromises = playlistIds.map(async (id) => {
          // Request minimal fields only
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${id}?fields=id,name,images,external_urls,tracks.total`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            console.warn(`Failed to fetch playlist ${id}: ${response.status}`);
            return null;
          }

          return response.json();
        });

        // Wait for all requests to complete
        const results = await Promise.all(playlistPromises);
        const playlists = results.filter(Boolean); // Remove any failed requests

        return NextResponse.json({ playlists });
      } catch (error) {
        console.error("Error fetching batch playlists:", error);
        return NextResponse.json(
          { error: "Failed to fetch playlists" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in Spotify API route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // For GET requests, just redirect to POST handler
  return POST(request);
}
