import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export const runtime = "nodejs";

async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const data = await pdf(buffer);
    return data.text;
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const country = formData.get("country");
    const role = formData.get("role");
    const experience = formData.get("experience");
    const jobDescription = formData.get("jobDescription") || "Not provided";
    const resumeFile = formData.get("resume") as File | null;

    let resumeText = "Not provided";

    if (resumeFile) {
      resumeText = await extractText(resumeFile);
    }

    const systemPrompt = `
You are a professional job market advisor focused on GCC countries (UAE, Saudi Arabia, Qatar).

You provide calm, honest, non-promotional guidance.
You do NOT give guarantees, predictions, legal advice, visa advice, or salary estimates.

You must return STRICT VALID JSON ONLY.
No markdown. No commentary outside JSON.
`;

    const userPrompt = `
User Profile:
- Country: ${country}
- Role: ${role}
- Experience: ${experience}

Resume:
${resumeText}

Job Description:
${jobDescription}

Return JSON in this exact structure:

{
  "readinessScore": number,
  "readinessSummary": string,
  "platforms": [
    {
      "name": string,
      "reason": string,
      "type": string
    }
  ],
  "strengths": string[],
  "gaps": string[],
  "nextSteps": string[],
  "disclaimer": string
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const json = JSON.parse(completion.choices[0].message.content!);

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze profile" },
      { status: 500 }
    );
  }
}
