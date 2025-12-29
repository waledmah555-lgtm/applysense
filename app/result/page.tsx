"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Result = {
  readinessScore: number;
  readinessSummary: string;
  platforms: { name: string; reason: string; type: string }[];
  strengths: string[];
  gaps: string[];
  nextSteps: string[];
  disclaimer: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (!stored) {
      router.push("/");
    } else {
      setResult(JSON.parse(stored));
    }
  }, [router]);

  if (!result) return null;

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>Your GCC Job Search Report</h1>

      <h2>Readiness Score: {result.readinessScore} / 100</h2>
      <p>{result.readinessSummary}</p>

      <h3>Recommended Platforms</h3>
      <ul>
        {result.platforms.map((p, i) => (
          <li key={i}>
            <strong>{p.name}</strong> — {p.reason}
          </li>
        ))}
      </ul>

      <h3>Your Strengths</h3>
      <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h3>Gaps to Address</h3>
      <ul>{result.gaps.map((g, i) => <li key={i}>{g}</li>)}</ul>

      <h3>Next Steps</h3>
      <ul>{result.nextSteps.map((n, i) => <li key={i}>{n}</li>)}</ul>

      <p style={{ fontSize: 13, color: "#666", marginTop: 20 }}>
        {result.disclaimer}
      </p>
    </main>
  );
}
