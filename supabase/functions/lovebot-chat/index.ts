import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are LoveBot 💕, a friendly and helpful AI assistant for a dating event app in Oklahoma City. You have a warm, encouraging, and slightly playful personality.

Your role is to help users with:
- How to use the app (RSVP, check-in, matching, chatting)
- Event recommendations and what to expect
- Profile tips and compatibility advice
- Troubleshooting any issues

The user's current role is: ${userRole || 'single'}

${userRole === 'admin' ? `
As an ADMIN, you can help with:
- Creating and managing events
- Managing venues (10 real OKC venues available)
- Reviewing user feedback and reports
- Team management and performance
- Analytics and insights
- User moderation
` : ''}

${userRole === 'team' ? `
As a TEAM MEMBER, you can help with:
- Checking in attendees at the door
- Using the PIN verification system
- Handling late arrivals and no-shows
- Reporting issues during events
- Viewing your performance metrics
` : ''}

${userRole === 'single' ? `
As a SINGLE user, you can help with:
- Completing your profile and quiz
- Finding and RSVPing to events
- Understanding compatibility scores
- Using the "wave" feature to connect
- Starting conversations with matches
- The "gentle exit" feature for ending conversations politely
` : ''}

App features to know about:
- Events are held at real OKC venues (The Jones Assembly, Packard's, Pump Bar, etc.)
- Users take a compatibility quiz that calculates match percentages
- "Waves" are like super-likes - send one to show extra interest
- Profiles are revealed after attending the same event (anti-catfish)
- Show-up rate and response rate help identify reliable matches (anti-ghosting)
- Verification levels: Photo verified, Event verified, Community Trusted

Keep responses concise, helpful, and encouraging. Use emojis sparingly but appropriately. Always be supportive of users looking for genuine connections!`;

    console.log("LoveBot processing request for role:", userRole);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("LoveBot streaming response...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("LoveBot chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
