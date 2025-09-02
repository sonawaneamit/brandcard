// Seed script for demo templates
// This would typically run against Supabase in a real app

export const DEMO_TEMPLATES = [
  {
    id: "1",
    name: "Social Media Post",
    width: 1080,
    height: 1080,
    fields: [
      { key: "headline", label: "Headline", type: "text", maxLen: 48, align: "center" },
      { key: "subhead", label: "Subhead", type: "text", maxLen: 80, align: "center" },
      { key: "cta", label: "Call to Action", type: "text", maxLen: 18, align: "center" },
      { key: "photo", label: "Product Photo", type: "image" }
    ],
    default_values: {
      headline: "Your Amazing Product",
      subhead: "The perfect solution for all your needs",
      cta: "Shop Now",
      photo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
    },
    is_public_form: true
  },
  {
    id: "2",
    name: "Blog Header",
    width: 1200,
    height: 630,
    fields: [
      { key: "title", label: "Blog Title", type: "text", maxLen: 60, align: "center" },
      { key: "subtitle", label: "Subtitle", type: "text", maxLen: 100, align: "center" },
      { key: "author", label: "Author", type: "text", maxLen: 30, align: "left" },
      { key: "background", label: "Background Image", type: "image" }
    ],
    default_values: {
      title: "How to Build Amazing Products",
      subtitle: "A comprehensive guide to product development",
      author: "John Doe",
      background: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop"
    },
    is_public_form: false
  },
  {
    id: "3",
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    fields: [
      { key: "headline", label: "Main Message", type: "text", maxLen: 40, align: "center" },
      { key: "subhead", label: "Supporting Text", type: "text", maxLen: 60, align: "center" },
      { key: "cta", label: "Action Button", type: "text", maxLen: 15, align: "center" },
      { key: "background", label: "Background", type: "image" }
    ],
    default_values: {
      headline: "New Product Launch",
      subhead: "Get ready for something amazing",
      cta: "Learn More",
      background: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&h=1920&fit=crop"
    },
    is_public_form: true
  },
  {
    id: "4",
    name: "LinkedIn Post",
    width: 1200,
    height: 1200,
    fields: [
      { key: "title", label: "Post Title", type: "text", maxLen: 50, align: "center" },
      { key: "description", label: "Description", type: "text", maxLen: 120, align: "center" },
      { key: "company", label: "Company", type: "text", maxLen: 25, align: "left" },
      { key: "logo", label: "Company Logo", type: "image" }
    ],
    default_values: {
      title: "We're Hiring!",
      description: "Join our amazing team and help us build the future",
      company: "TechCorp Inc.",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop"
    },
    is_public_form: false
  },
  {
    id: "5",
    name: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    fields: [
      { key: "title", label: "Video Title", type: "text", maxLen: 45, align: "center" },
      { key: "subtitle", label: "Subtitle", type: "text", maxLen: 30, align: "center" },
      { key: "background", label: "Background Image", type: "image" }
    ],
    default_values: {
      title: "How to Build a Startup",
      subtitle: "Step by Step Guide",
      background: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1280&h=720&fit=crop"
    },
    is_public_form: true
  }
];

export const DEMO_BRAND_KITS = [
  {
    id: "1",
    name: "Default Brand Kit",
    primary_color: "#111111",
    secondary_color: "#ffffff",
    font_primary_url: null,
    font_secondary_url: null,
    logo_url: null
  },
  {
    id: "2",
    name: "TechCorp Brand Kit",
    primary_color: "#2563eb",
    secondary_color: "#f8fafc",
    font_primary_url: null,
    font_secondary_url: null,
    logo_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop"
  }
];

// This would be used to seed the database
export async function seedDatabase() {
  console.log("Seeding database with demo templates...");
  
  // In a real app, this would:
  // 1. Connect to Supabase
  // 2. Insert brand kits
  // 3. Insert templates
  // 4. Set up storage buckets
  
  console.log("Demo templates:", DEMO_TEMPLATES.length);
  console.log("Demo brand kits:", DEMO_BRAND_KITS.length);
  console.log("Seeding complete!");
}
