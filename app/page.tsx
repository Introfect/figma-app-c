"use client";
import { useState, FormEvent } from "react";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const captureScreenshot = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setScreenshotUrl("");

    try {
      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to capture screenshot");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setScreenshotUrl(imageUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Website Screenshot Tool</title>
        <meta name="description" content="Capture screenshots of websites" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Website Screenshot Tool</h1>

        <form onSubmit={captureScreenshot} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-grow p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Capturing..." : "Capture Screenshot"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            Error: {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center p-8">
            <p className="mb-2">Capturing screenshot...</p>
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {screenshotUrl && (
          <div className="border border-gray-200 rounded p-4">
            <h2 className="text-xl font-bold mb-2">Screenshot Result:</h2>
            <div className="border border-gray-300">
              <img
                src={screenshotUrl}
                alt="Website screenshot"
                className="w-full h-auto"
              />
            </div>
            <div className="mt-4">
              <a
                href={screenshotUrl}
                download="screenshot.jpg"
                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 inline-block"
              >
                Download Screenshot
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
