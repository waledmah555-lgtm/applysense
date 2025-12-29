"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    localStorage.setItem("analysisResult", JSON.stringify(data));

    router.push("/result");
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 20 }}>
      <h1>ApplySense</h1>
      <p>Your GCC Job Search Companion</p>

      <form onSubmit={handleSubmit}>
        <label>Target Country</label>
        <select name="country">
          <option>UAE</option>
          <option>Saudi Arabia</option>
          <option>Qatar</option>
        </select>

        <label>Job Role</label>
        <input name="role" required />

        <label>Experience</label>
        <input name="experience" required />

        <label>Resume (PDF or DOCX, optional)</label>
        <input name="resume" type="file" accept=".pdf,.docx" />

        <label>Job Description (optional)</label>
        <textarea name="jobDescription" />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Check My Readiness"}
        </button>
      </form>
    </main>
  );
}
