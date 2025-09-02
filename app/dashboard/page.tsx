import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Share2, Download } from "lucide-react";

export default function DashboardPage() {
  // Mock data - in real app this would come from Supabase
  const templates = [
    {
      id: "1",
      name: "Social Media Post",
      width: 1080,
      height: 1080,
      isPublic: true,
      renders: 42,
    },
    {
      id: "2", 
      name: "Blog Header",
      width: 1200,
      height: 630,
      isPublic: false,
      renders: 18,
    },
    {
      id: "3",
      name: "Instagram Story",
      width: 1080,
      height: 1920,
      isPublic: true,
      renders: 67,
    },
  ];

  const recentRenders = [
    {
      id: "1",
      templateName: "Social Media Post",
      url: "/api/placeholder/400/400",
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      templateName: "Blog Header", 
      url: "/api/placeholder/400/200",
      createdAt: "1 day ago",
    },
  ];

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
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Button asChild>
              <Link href="/templates/new">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your templates and view recent renders.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Renders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.reduce((sum, t) => sum + t.renders, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Public Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter(t => t.isPublic).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Templates</h2>
              <Button asChild>
                <Link href="/templates/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>
                          {template.width} × {template.height}px
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {template.isPublic && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {template.renders} renders
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/templates/${template.id}`}>
                            Edit
                          </Link>
                        </Button>
                        {template.isPublic && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/t/${template.id}`}>
                              <Share2 className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Renders Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Renders</h2>
            <div className="space-y-4">
              {recentRenders.map((render) => (
                <Card key={render.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-slate-400 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{render.templateName}</h3>
                        <p className="text-sm text-slate-600">{render.createdAt}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
