import { RichSearchItem } from "./types";

export const googleSuggestions = [
  "how to bake a cake",
  "weather forecast",
  "translate english to spanish",
  "how to tie a tie",
  "restaurants near me",
  "python tutorials",
  "news today",
  "flight status",
  "currency converter",
  "calculator",
  "timer 10 minutes",
  "how to lose weight fast",
  "chicken recipes",
  "movies in theaters",
  "what time is it",
  "youtube to mp3 converter",
  "google maps",
  "amazon prime login",
  "netflix",
  "spotify",
  "weather",
  "fahrenheit to celsius",
  "unit converter",
  "BMI calculator",
  "world clock",
  "sunset today",
];

export async function fetchGoogleSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<string[]> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, 100 + Math.random() * 200),
  );
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return googleSuggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()),
  );
}

export const richSearchItems: RichSearchItem[] = [
  { id: "u1", name: "John Doe", subtitle: "Software Engineer at Google", type: "user" },
  { id: "u2", name: "Jane Smith", subtitle: "Product Designer at Meta", type: "user" },
  { id: "u3", name: "Bob Johnson", subtitle: "Data Scientist at Amazon", type: "user" },
  { id: "u4", name: "Alice Williams", subtitle: "Marketing Lead at Shopify", type: "user" },
  { id: "u5", name: "Charlie Brown", subtitle: "DevOps Engineer at Netflix", type: "user" },
  { id: "u6", name: "Diana Prince", subtitle: "UX Researcher at Figma", type: "user" },
  { id: "u7", name: "Evan Sparks", subtitle: "Frontend Developer at Vercel", type: "user" },
  { id: "p1", name: "Tech Today", subtitle: "Technology news and updates", type: "page" },
  { id: "p2", name: "Code Academy", subtitle: "Learn programming online", type: "page" },
  { id: "p3", name: "Design Masters", subtitle: "UI/UX design resources", type: "page" },
  { id: "p4", name: "Startup Daily", subtitle: "Entrepreneurship insights", type: "page" },
  { id: "g1", name: "React Developers", subtitle: "15k members", type: "group" },
  { id: "g2", name: "UX Designers", subtitle: "8k members", type: "group" },
  { id: "g3", name: "Python Enthusiasts", subtitle: "12k members", type: "group" },
  { id: "g4", name: "DevOps Community", subtitle: "6k members", type: "group" },
];

export async function fetchRichSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<RichSearchItem[]> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, 150 + Math.random() * 250),
  );
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return richSearchItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
}
