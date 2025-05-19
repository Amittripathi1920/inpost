// Color options for dashboard theme
export const COLOR_OPTIONS = [
  { name: "Default", color: "#8884d8" },
  { name: "Red", color: "#ef4444" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Orange", color: "#f97316" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#eab308" },
  { name: "Violet", color: "#8b5cf6" },
];

// Convert RGB to HSL for color manipulation
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return [h, s * 100, l * 100];
}

// Extract hashtags from post content
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches : [];
}

// Get word count from text
export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Export posts to CSV
export function exportPostsToCsv(posts: any[]): void {
  if (!posts || posts.length === 0) return;
  
  // Define CSV headers
  const headers = [
    'Date',
    'Topic',
    'Tone',
    'Language',
    'Length',
    'Content'
  ];
  
  // Format post data for CSV
  const csvData = posts.map(post => [
    new Date(post.created_at).toLocaleDateString(),
    post.topic?.topic_name || 'Unknown',
    post.tone?.tone_name || 'Unknown',
    post.language?.language_name || 'Unknown',
    post.length?.length_type || 'Unknown',
    `"${post.generated_post?.replace(/"/g, '""') || ''}"`
  ]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `linkedin_posts_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}