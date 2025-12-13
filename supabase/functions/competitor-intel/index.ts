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
    const { analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Running competitor analysis: ${analysisType}`);

    const systemPrompt = `You are an AI market analyst specializing in the dating events industry in Oklahoma City.
    
    Analyze the competitive landscape and provide insights on:
    1. Market trends for singles events
    2. Competitor strategies and weaknesses
    3. Pricing optimization recommendations
    4. Event timing and venue selection
    5. Unique differentiators to leverage
    
    Base your analysis on the OKC metro area with competitors like:
    - Pre-Dating OKC (speed dating focus)
    - Eventbrite Singles Events (variety)
    - Meetup Singles Groups (casual/free)
    - Local bar/restaurant singles nights
    
    Provide actionable, data-driven recommendations.`;

    const userPrompt = analysisType === 'weekly' 
      ? 'Generate a weekly competitive intelligence report for Social Singles OKC. Include market trends, competitor activity, and strategic recommendations.'
      : 'Analyze the current competitive landscape and identify opportunities for growth in the OKC singles events market.';

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    console.log("Analysis complete");

    return new Response(JSON.stringify({ 
      analysis,
      timestamp: new Date().toISOString(),
      type: analysisType 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Competitor intel error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
