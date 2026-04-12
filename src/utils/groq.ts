import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Adjust the import path as needed

type GeneratePostParams = {
  topic: string;
  length: string;
  language: string;
  tone: string;
  experience: string;
  designation?: string;
  influencer?: string;
  what_to_include?: string
};

// Keep this function for reference or if you need to use it elsewhere
export const generateGroqPrompt = ({
  topic,
  length,
  language,
  tone,
  experience,
  influencer = "NA",
  designation,
  what_to_include = "Anything"
}: GeneratePostParams) => {
  return `Generate a LinkedIn post for a person using the following details and include ${what_to_include}. 
  Do not include any preamble or title. 
  Output only the post content with relevant hashtags at the end.

1) Topic = ${topic}
2) Length = ${length} (If long, include insights or story. If short, keep it concise and impactful.)
3) Language = ${language} (If Hinglish, use a mix of Hindi and English.)
4) Tone = ${tone}
5) Experience Level = ${experience}
6) Influencer = ${influencer} (If not NA, match tone and style like ${influencer} from LinkedIn.)
7) Tweek the post for a user who is designated at ${designation} but do not use his designation name on the post.


Rules:
- Use English script for both English and Hinglish.
- Please Don't Use these common starting lines like - ( "as a seasoned" )
- If influencer is NA, you can freely choose tone/style.
- if what_to_include is "Anything", you can generate anything on topic - ${topic}
- End with relevant and trending hashtags.
- No preamble, no closing remarks — just the post.
use only anyone of the hook from below json

[
  {
    "hook_name": "Risky Move",
    "hook_prompt": "Write a LinkedIn post starting with a bold, risky decision or action (e.g., quitting a job, changing strategy, trying something unconventional). Build curiosity in the first 2 lines, then explain what happened, key lessons learned, and end with a strong takeaway. Keep it engaging and conversational."
  },
  {
    "hook_name": "Unpopular Opinion",
    "hook_prompt": "Write a LinkedIn post starting with an unpopular or controversial opinion related to the topic. The first line should challenge common beliefs. Then justify the opinion with logical arguments, examples, or experiences, and end by inviting discussion."
  },
  {
    "hook_name": "Failure Story",
    "hook_prompt": "Write a LinkedIn post that begins with a personal failure or mistake. Hook the reader emotionally in the first 2 lines, then describe what went wrong, what you learned, and how it helped you improve. Keep it authentic and relatable."
  },
  {
    "hook_name": "Value List",
    "hook_prompt": "Write a LinkedIn post that starts with a high-value promise (e.g., '5 tips', '7 tricks', '3 mistakes'). Deliver actionable insights in a clear list format. Keep each point concise and practical, and end with a summary or call to action."
  },
  {
    "hook_name": "Pattern Interrupt",
    "hook_prompt": "Write a LinkedIn post starting with a surprising or counterintuitive statement that interrupts common thinking (e.g., 'Stop doing this', 'Don’t learn this skill'). Then explain the reasoning, provide insights, and guide the reader toward a better approach."
  },
  {
    "hook_name": "Transformation Story",
    "hook_prompt": "Write a LinkedIn post showing a clear before-and-after transformation. Start with where you began, highlight struggles or challenges, then explain what changed and how you achieved the result. End with motivation or advice for others."
  },
  {
    "hook_name": "Behind the Scenes",
    "hook_prompt": "Write a LinkedIn post that reveals something people usually don’t see about a process, job, or industry. Start with curiosity-driven lines, then explain the reality, insights, or hidden challenges, and end with a meaningful takeaway."
  },
  {
    "hook_name": "Warning / Mistakes",
    "hook_prompt": "Write a LinkedIn post that warns readers about common mistakes. Start with a strong cautionary statement, then list key mistakes and explain why they matter. End with practical advice on how to avoid them."
  },
  {
    "hook_name": "Results / Case Study",
    "hook_prompt": "Write a LinkedIn post highlighting a specific result or achievement using numbers or measurable outcomes. Start with the result, then explain what was done to achieve it, key strategies, and lessons others can apply."
  },
  {
    "hook_name": "Storytelling",
    "hook_prompt": "Write a LinkedIn post that starts with a compelling short story or moment. Use a narrative style to draw readers in, then connect the story to a professional lesson or insight. Keep it engaging and easy to read."
  },
  {
    "hook_name": "Question Hook",
    "hook_prompt": "Write a LinkedIn post starting with a thought-provoking question that your target audience relates to. Then explore the topic with insights, examples, or opinions, and encourage readers to engage in the comments."
  },
  {
    "hook_name": "Contrarian Insight",
    "hook_prompt": "Write a LinkedIn post that challenges a widely accepted practice in the industry. Start with a bold statement, explain why it's flawed, and suggest a better alternative with clear reasoning."
  }
]
`;
};

export const generatePost = async (
  params: GeneratePostParams
): Promise<{ content: string; hashtags: string }> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-post', {
      body: params
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    return {
      content: data.content,
      hashtags: data.hashtags
    };
  } catch (error) {
    console.error("Error generating post:", error);

    toast({
      title: "Generation Failed",
      description: "Failed to generate post. Using demo content instead.",
      variant: "destructive"
    });

    return mockGeneratePost(params);
  }
};

const mockGeneratePost = (params: GeneratePostParams): { content: string; hashtags: string } => {
  const mockPosts = {
    leadership: {
      content: "Today marks an important milestone in my leadership journey. I've learned that true leadership isn't about having all the answers, but about asking the right questions and empowering your team to find solutions together.",
      hashtags: "#Leadership #PersonalGrowth #TeamEmpowerment"
    },
    "career growth": {
      content: "Just completed a certification that I've been working toward for months! The late nights and weekend studies were challenging, but the skills I've gained are already opening new doors. Never stop investing in yourself!",
      hashtags: "#CareerGrowth #ContinuousLearning #Certification"
    },
    "remote work": {
      content: "After 6 months of full-time remote work, I've discovered that creating boundaries is essential. My top 3 practices: 1) Dedicated workspace, 2) Regular breaks to move, and 3) A clear shutdown ritual at day's end. What are your remote work success strategies?",
      hashtags: "#RemoteWork #WorkFromHome #Productivity"
    }
  };

  const lowerTopic = params.topic.toLowerCase();

  let post;
  if (mockPosts[lowerTopic as keyof typeof mockPosts]) {
    post = mockPosts[lowerTopic as keyof typeof mockPosts];
  } else {
    post = {
      content: `Here's my thoughts on ${params.topic}: As professionals in this field, we must continually adapt and grow. I've found that maintaining curiosity and embracing challenges leads to the most significant breakthroughs. What strategies have you found effective?`,
      hashtags: `#${params.topic.replace(/\s+/g, '')} #ProfessionalGrowth #Insights`
    };
  }

  return {
    content: post.content,
    hashtags: post.hashtags
  };
};
