"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DownloadContent() {
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (recordId && !downloading) {
      setDownloading(true);
      window.location.href = `/api/pdf/${recordId}`;
    }
  }, [recordId, downloading]);

  if (!recordId) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-neutral-900">Download</h1>
        <p className="text-sm text-neutral-600">
          No record ID specified. Please access this page from your assessment
          review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-neutral-900">
        Assessment Download
      </h1>
      <p className="text-sm text-neutral-600">
        Your assessment PDF is being prepared for download.
      </p>
      <p className="text-xs text-neutral-400">Record ID: {recordId}</p>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-neutral-500">Loading...</div>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}
