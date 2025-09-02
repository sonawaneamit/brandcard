"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Share2, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Template {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "image";
    maxLen?: number;
    required?: boolean;
    align?: "left" | "center" | "right";
  }>;
  default_values?: Record<string, string>;
}

export default function TemplateEditorPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock template data - in real app this would fetch from API
    const mockTemplate: Template = {
      id: params.id,
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
      }
    };
    
    setTemplate(mockTemplate);
    setValues(mockTemplate.default_values || {});
    setIsLoading(false);
  }, [params.id]);

  const handleGenerate = async () => {
    if (!template) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          fields: values
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      
      setImgUrl(data.url);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSmartFill = async () => {
    if (!template) return;
    
    const prompt = prompt("Enter a brief description of what you want to promote:");
    if (!prompt) return;
    
    try {
      const response = await fetch("/api/smartfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          prompt
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setValues(prev => ({ ...prev, ...data.fields }));
        toast.success("Content generated successfully!");
      } else {
        throw new Error(data.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Smart fill error:", error);
      toast.error("Failed to generate content. Please try again.");
    }
  };

  const handleSave = async () => {
    // In a real app, this would save the template changes
    toast.success("Template saved successfully!");
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/t/${template?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Template not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl">Brandcard</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/dashboard">Dashboard</a>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{template.name}</h1>
              <p className="text-slate-600">Template Editor</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Form
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Content</CardTitle>
                  <CardDescription>
                    Customize the text and images for your template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {field.maxLen && (
                          <span className="text-slate-500 ml-2">
                            ({values[field.key]?.length || 0}/{field.maxLen})
                          </span>
                        )}
                      </label>
                      {field.type === "text" ? (
                        <Textarea
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          value={values[field.key] || ""}
                          onChange={(e) => setValues(prev => ({ 
                            ...prev, 
                            [field.key]: e.target.value 
                          }))}
                          maxLength={field.maxLen}
                          className="min-h-[80px]"
                        />
                      ) : (
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={values[field.key] || ""}
                          onChange={(e) => setValues(prev => ({ 
                            ...prev, 
                            [field.key]: e.target.value 
                          }))}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Image"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSmartFill}
                      className="w-full"
                      title="AI-powered content generation"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Smart Fill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    {template.width} × {template.height}px
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {imgUrl ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Image
                          src={imgUrl}
                          alt="Generated image"
                          width={template.width}
                          height={template.height}
                          className="w-full h-auto rounded-lg border"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => window.open(imgUrl, '_blank')} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" onClick={() => navigator.clipboard.writeText(imgUrl)}>
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <div className="w-12 h-12 mx-auto mb-2 opacity-50 bg-slate-300 rounded"></div>
                        <p>Your image will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
