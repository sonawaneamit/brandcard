"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download, Sparkles, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

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

interface PublicTemplateFormProps {
  templateId: string;
}

export default function PublicTemplateForm({ templateId }: PublicTemplateFormProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock template data - in real app this would fetch from API
    const mockTemplate: Template = {
      id: templateId,
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
  }, [templateId]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(imgUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `brandcard-${template?.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Button variant="outline" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{template.name}</h1>
            <p className="text-slate-600">Create your custom image in seconds</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Image</CardTitle>
                <CardDescription>
                  Fill in the details below to generate your image
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
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="flex-1"
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
                    title="AI-powered content generation"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
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
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={handleCopyLink}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
  );
}
