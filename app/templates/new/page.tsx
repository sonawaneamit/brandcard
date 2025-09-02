"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { TField } from "@/lib/validation";

export default function NewTemplatePage() {
  const [templateName, setTemplateName] = useState("");
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [fields, setFields] = useState<TField[]>([
    { key: "headline", label: "Headline", type: "text", maxLen: 48, align: "center" },
    { key: "subhead", label: "Subhead", type: "text", maxLen: 80, align: "center" },
    { key: "cta", label: "Call to Action", type: "text", maxLen: 18, align: "center" },
  ]);

  const addField = () => {
    const newField: TField = {
      key: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      maxLen: 50,
      align: "center"
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<TField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (fields.length === 0) {
      toast.error("Please add at least one field");
      return;
    }

    try {
      // In a real app, this would save to Supabase
      console.log("Saving template:", {
        name: templateName,
        width,
        height,
        fields
      });
      
      toast.success("Template saved successfully!");
      // Redirect to dashboard or template editor
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save template");
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Template</h1>
            <p className="text-slate-600">Design a custom template for your images</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Template Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
                <CardDescription>
                  Configure the basic properties of your template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name</label>
                  <Input
                    placeholder="e.g., Social Media Post"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width (px)</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value) || 1080)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (px)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 1080)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fields Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Template Fields</CardTitle>
                    <CardDescription>
                      Define the editable fields for your template
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={addField}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.key} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Field {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Label</label>
                          <Input
                            size="sm"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Key</label>
                          <Input
                            size="sm"
                            value={field.key}
                            onChange={(e) => updateField(index, { key: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Type</label>
                          <select
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as "text" | "image" })}
                          >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Max Length</label>
                          <Input
                            size="sm"
                            type="number"
                            value={field.maxLen || ""}
                            onChange={(e) => updateField(index, { maxLen: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
