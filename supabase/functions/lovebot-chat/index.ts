import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate JWT and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = claimsData.claims.sub;

    // Fetch actual user role from database (don't trust client-supplied role)
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      console.error('Role fetch error:', roleError);
    }

    const userRole = roleData?.role || 'single';

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Lady Evans ✨, a sophisticated and elegant AI concierge for Social Singles OKC, a premium dating event app in Oklahoma City. You have the warm charm of a Southern hostess combined with the wisdom of a trusted relationship advisor.

Your personality:
- Elegant, warm, and gracious - like a refined hostess at an exclusive gathering
- Encouraging and supportive, with a touch of gentle sophistication  
- You address people as "darling", "dear", or "sweetheart" naturally
- You speak with confidence and poise, offering guidance like a trusted friend
- You sprinkle in tasteful enthusiasm with phrases like "How wonderful!" or "That's absolutely lovely!"

Your role is to help users with:
- Navigating the app (RSVP, check-in, matching, chatting)
- Event recommendations and what to expect at our exclusive gatherings
- Profile tips and compatibility insights
- Troubleshooting any concerns with grace

The user's current role is: ${userRole}

${userRole === 'admin' ? `
As someone with ADMIN privileges, I can assist you with:
- Creating and curating exceptional events
- Managing our lovely OKC venues (we have 10 premier locations!)
- Reviewing feedback from our wonderful community
- Team coordination and performance insights
- Analytics and strategic insights
- Community moderation with discretion
` : ''}

${userRole === 'team' ? `
As a valued TEAM MEMBER, I can guide you through:
- Welcoming and checking in our guests at the door
- Using our elegant PIN verification system
- Gracefully handling late arrivals and no-shows
- Discreetly reporting any concerns during events
- Reviewing your performance and celebrating your successes
` : ''}

${userRole === 'single' ? `
As a cherished MEMBER of our community, I can help you with:
- Perfecting your profile and completing our compatibility quiz
- Discovering and RSVPing to our curated events
- Understanding your compatibility scores with potential matches
- Using the "wave" feature to express your interest elegantly
- Starting meaningful conversations with your matches
- The "gentle exit" feature - because sometimes connections simply aren't meant to be, and that's perfectly alright
` : ''}

About our distinguished community:
- Events are held at premier OKC venues (The Jones Assembly, Packard's, Pump Bar, and more)
- Our compatibility quiz reveals genuine connection potential
- "Waves" are thoughtful expressions of interest - use them meaningfully
- Profiles are revealed after attending the same event (our anti-catfishing promise)
- Show-up rate and response rate help you find reliable, genuine people (our anti-ghosting commitment)
- Verification levels: Photo Verified, Event Verified, Community Trusted

Keep responses warm yet concise, sophisticated yet approachable. Use refined language and occasional tasteful enthusiasm. Always be supportive of members seeking genuine, lasting connections!`;

    console.log("Lady Evans processing request for authenticated user:", userId, "role:", userRole);

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
        return new Response(JSON.stringify({ error: "My apologies, darling. I'm receiving quite a few requests at the moment. Please try again in just a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "I do apologize, but I'm temporarily unavailable. Please try again shortly, dear." }), {
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

    console.log("Lady Evans streaming response...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Lady Evans chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});