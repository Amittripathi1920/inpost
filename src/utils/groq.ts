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

1. Topic = ${topic}


2. Length = ${length} (If long, include insights or story. If short, keep it concise and impactful.)


3. Language = ${language} (If Hinglish, use a mix of Hindi and English.)


4. Tone = ${tone}


5. Experience Level = ${experience}


6. Influencer = ${influencer} (If not NA, match tone and style like ${influencer} from LinkedIn.)


7. Tweek the post for a user who is designated at ${designation} but do not use his designation name on the post.



Rules:

Use English script for both English and Hinglish.

Please Don't Use these common starting lines like - ( "as a seasoned" )

If influencer is NA, you can freely choose tone/style.

if what_to_include is "Anything", you can generate anything on topic - ${topic}

End with relevant and trending hashtags.

No preamble, no closing remarks — just the post.`;
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
content: Here's my thoughts on ${params.topic}: As professionals in this field, we must continually adapt and grow. I\'ve found that maintaining curiosity and embracing challenges leads to the most significant breakthroughs. What strategies have you found effective?,
hashtags: #${params.topic.replace(/\s+/g, '')} #ProfessionalGrowth #Insights
};
}

return {
content: post.content,
hashtags: post.hashtags
};
};
