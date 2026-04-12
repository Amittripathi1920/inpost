import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

type GeneratePostParams = {
  topic: string;
  length: string;
  language: string;
  tone: string;
  experience: string;
  designation?: string;
  influencer?: string;
  hook?: string; // 🔥 NEW
  what_to_include?: string;
};


// 🔥 STEP 1: GENERATE HOOKS
export const generateHooks = async ({
  topic,
  hookType
}: {
  topic: string;
  hookType: string;
}): Promise<string[]> => {
  try {
    const prompt = `
Generate 3 high-performing LinkedIn hooks.

Topic: ${topic}
Hook Style: ${hookType}

Rules:
- Each hook max 12 words per line
- Create curiosity or tension
- Avoid generic phrases like "In today's world"
- Make it specific and engaging

Return only hooks as array.
`;

    const { data, error } = await supabase.functions.invoke("generate-post", {
      body: { prompt }
    });

    if (error) throw error;

    return data.hooks || [];
  } catch (error) {
    console.error(error);
    return [
      `I made a mistake while working on ${topic}…`,
      `Most people get ${topic} completely wrong.`,
      `This changed how I see ${topic} forever.`
    ];
  }
};


// 🔥 STEP 2–5: MAIN POST GENERATION (PIPELINE INSIDE PROMPT)
export const generatePost = async (
  params: GeneratePostParams
): Promise<{ content: string; hashtags: string }> => {
  try {
    const {
      topic,
      length,
      language,
      tone,
      experience,
      designation,
      influencer = "NA",
      hook,
      what_to_include = "Anything"
    } = params;

    const prompt = `
Write a highly engaging LinkedIn post.

STRUCTURE:
1. Start with this hook:
"${hook}"

2. Build context around the topic
3. Provide 3–5 insights or lessons
4. Add a relatable example or personal tone
5. End with a strong takeaway
6. Add a subtle call to action

DETAILS:
- Topic: ${topic}
- Length: ${length}
- Language: ${language}
- Tone: ${tone}
- Experience Level: ${experience}
- Designation Context: ${designation}

STRICT INSTRUCTIONS:
- MUST include this: ${what_to_include}
- Avoid generic phrases like "In today's fast-paced world"
- Avoid robotic tone
- Use short lines for readability
- Make it sound human, not AI
- Add personality and slight imperfection
- Do NOT mention designation explicitly

OUTPUT:
- Only post content
- Then hashtags at end
`;

    const { data, error } = await supabase.functions.invoke("generate-post", {
      body: { prompt }
    });

    if (error) throw error;

    return {
      content: data.content,
      hashtags: data.hashtags
    };

  } catch (error) {
    console.error("Error generating post:", error);

    toast({
      title: "Generation Failed",
      description: "Using fallback content",
      variant: "destructive"
    });

    return mockGeneratePost(params);
  }
};


// 🔥 FALLBACK (UNCHANGED BUT CLEANED)
const mockGeneratePost = (params: GeneratePostParams) => {
  return {
    content: `I tried something new with ${params.topic}… and it changed my perspective.

Most people overcomplicate things.

But sometimes, simplicity wins.

The real lesson?

Focus on what actually moves the needle.

What’s your take?`,
    hashtags: `#${params.topic.replace(/\s+/g, "")} #Growth #Learning`
  };
};
