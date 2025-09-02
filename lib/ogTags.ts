export async function fetchOG(url: string) {
  try {
    const res = await fetch(url, { 
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    const html = await res.text();
    
    const get = (name: string) => {
      const rx = new RegExp(
        `<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 
        "i"
      );
      return rx.exec(html)?.[1] || "";
    };
    
    return {
      title: get("og:title") || /<title>(.*?)<\/title>/i.exec(html)?.[1] || "",
      description: get("og:description") || "",
      image: get("og:image") || "",
      url
    };
  } catch (error) {
    console.error("Failed to fetch OG tags:", error);
    return {
      title: "",
      description: "",
      image: "",
      url
    };
  }
}
