export async function smartFill(
  templateFields: Array<{ key: string; maxLen?: number }>, 
  prompt: string
) {
  const schema = { headline: "", subhead: "", cta: "" };
  
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${process.env.LLM_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Return only JSON with keys headline, subhead, cta. Respect max lengths if given: headline <= 48, subhead <= 80, cta <= 18. Keep promotional, clear, brand neutral." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });
    
    const data = await resp.json();
    const out = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return { ...schema, ...out };
  } catch (error) {
    console.error("Smart fill error:", error);
    return schema;
  }
}
