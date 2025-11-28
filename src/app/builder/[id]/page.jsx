"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Save,
  Download,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  Wand2,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Award,
  Zap,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleExport = async () => {
    if (!resume || params.id === "new") return;

    setExporting(true);
    try {
      const response = await fetch(`/api/export/${params.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting resume:', error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (params.id === "new") {
      // Create new resume
      const newResume = {
        _id: "new",
        title: "Untitled Resume",
        template: "modern",
        data: {
          personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            location: "",
          },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          certifications: [],
          projects: [],
        },
      };
      setResume(newResume);
      setLoading(false);
    } else {
      // Load existing resume
      fetchResume();
    }
  }, [params.id]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure certifications array exists for backward compatibility
        if (!data.data.certifications) {
          data.data.certifications = [];
        }
        setResume(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!resume) return;

    setSaving(true);
    try {
      const method = params.id === "new" ? "POST" : "PUT";
      const url =
        params.id === "new" ? "/api/resumes" : `/api/resumes/${params.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: resume.title,
          template: resume.template,
          data: resume.data,
        }),
      });

      if (response.ok) {
        const savedResume = await response.json();
        setResume(savedResume);
        if (params.id === "new") {
          router.push(`/builder/${savedResume._id}`);
        }
      }
    } catch (error) {
      console.error("Error saving resume:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateResumeData = (section, data) => {
    if (!resume) return;

    setResume({
      ...resume,
      data: {
        ...resume.data,
        [section]: data,
      },
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };

    updateResumeData("experience", [...resume.data.experience, newExperience]);
  };

  const removeExperience = (id) => {
    updateResumeData(
      "experience",
      resume.data.experience.filter((exp) => exp.id !== id)
    );
  };

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    };

    updateResumeData("certifications", [
      ...resume.data.certifications,
      newCertification,
    ]);
  };

  const removeCertification = (id) => {
    updateResumeData(
      "certifications",
      resume.data.certifications.filter((cert) => cert.id !== id)
    );
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: "",
      level: "beginner",
    };

    updateResumeData("skills", [...resume.data.skills, newSkill]);
  };

  const removeSkill = (id) => {
    updateResumeData(
      "skills",
      resume.data.skills.filter((skill) => skill.id !== id)
    );
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
      startDate: "",
      endDate: "",
    };

    updateResumeData("projects", [...resume.data.projects, newProject]);
  };

  const removeProject = (id) => {
    updateResumeData(
      "projects",
      resume.data.projects.filter((project) => project.id !== id)
    );
  };

  const generateSummary = async () => {
    if (!keywords.trim()) return;

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      });

      if (response.ok) {
        const data = await response.json();
        updateResumeData("summary", data.summary);
        setShowKeywordInput(false);
        setKeywords("");
      } else {
        console.error("Failed to generate summary");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Resume not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/30 sticky top-0 z-20 shadow-lg shadow-blue-500/5">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="flex flex-col">
                  <Input
                    value={resume.title}
                    onChange={(e) =>
                      setResume({ ...resume, title: e.target.value })
                    }
                    className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Resume Title"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/50 rounded-xl p-2 backdrop-blur-sm border border-white/20">
                <Palette className="h-4 w-4 text-gray-600" />
                <Select
                  value={resume.template}
                  onValueChange={(value) =>
                    setResume({ ...resume, template: value })
                  }
                >
                  <SelectTrigger className="w-40 border-0 bg-transparent shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/20">
                    <SelectItem value="minimal" className="hover:bg-blue-50">
                      Minimal
                    </SelectItem>
                    <SelectItem value="modern" className="hover:bg-purple-50">
                      Modern
                    </SelectItem>
                    <SelectItem
                      value="professional"
                      className="hover:bg-indigo-50"
                    >
                      Professional
                    </SelectItem>
                    <SelectItem value="creative" className="hover:bg-pink-50">
                      Creative
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={saveResume}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl px-6"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleExport}
                disabled={exporting}
                variant="outline"
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-6"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <Input
                      value={resume.data.personalInfo.firstName}
                      onChange={(e) =>
                        updateResumeData("personalInfo", {
                          ...resume.data.personalInfo,
                          firstName: e.target.value,
                        })
                      }
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <Input
                      value={resume.data.personalInfo.lastName}
                      onChange={(e) =>
                        updateResumeData("personalInfo", {
                          ...resume.data.personalInfo,
                          lastName: e.target.value,
                        })
                      }
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={resume.data.personalInfo.email}
                    onChange={(e) =>
                      updateResumeData("personalInfo", {
                        ...resume.data.personalInfo,
                        email: e.target.value,
                      })
                    }
                    className="border-blue-200 focus:border-blue-400"
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone
                    </label>
                    <Input
                      value={resume.data.personalInfo.phone}
                      onChange={(e) =>
                        updateResumeData("personalInfo", {
                          ...resume.data.personalInfo,
                          phone: e.target.value,
                        })
                      }
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Location
                    </label>
                    <Input
                      value={resume.data.personalInfo.location}
                      onChange={(e) =>
                        updateResumeData("personalInfo", {
                          ...resume.data.personalInfo,
                          location: e.target.value,
                        })
                      }
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full mr-3">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                  Professional Summary
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeywordInput(!showKeywordInput)}
                    className="ml-auto hover:bg-green-50"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showKeywordInput && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Generate Summary with AI
                      </span>
                    </div>
                    <Input
                      placeholder="Enter keywords (e.g., JavaScript, React, leadership, problem-solving)"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="mb-2 border-green-300 focus:border-green-500"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={generateSummary}
                        disabled={generating || !keywords.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {generating ? "Generating..." : "Generate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowKeywordInput(false);
                          setKeywords("");
                        }}
                        className="border-green-300 hover:bg-green-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <Textarea
                  placeholder="Write a compelling summary of your professional background, key skills, and career goals..."
                  value={resume.data.summary}
                  onChange={(e) => updateResumeData("summary", e.target.value)}
                  rows={5}
                  className="border-green-200 focus:border-green-400 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Keep it concise, 3-5 sentences highlighting your value
                  proposition
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.data.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg text-gray-900">
                        Experience {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Company
                        </label>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resume.data.experience];
                            updated[index].company = e.target.value;
                            updateResumeData("experience", updated);
                          }}
                          className="border-purple-200 focus:border-purple-400"
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Position
                        </label>
                        <Input
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...resume.data.experience];
                            updated[index].position = e.target.value;
                            updateResumeData("experience", updated);
                          }}
                          className="border-purple-200 focus:border-purple-400"
                          placeholder="Job Title"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe your key responsibilities, achievements, and impact. Use bullet points for clarity..."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...resume.data.experience];
                          updated[index].description = e.target.value;
                          updateResumeData("experience", updated);
                        }}
                        rows={4}
                        className="border-purple-200 focus:border-purple-400 resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        Tip: Start each bullet with strong action verbs and
                        quantify achievements
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addExperience}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full mr-3 shadow-inner">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  Skills
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200"
                  >
                    {resume.data.skills.length} added
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Highlight your technical and professional skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.data.skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="group relative border border-emerald-200/50 rounded-2xl p-6 space-y-5 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Header with index and remove button */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-800 transition-colors">
                            {skill.name || "Skill Name"}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {skill.level || "Level"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-full p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-emerald-500" />
                          Skill Name
                        </label>
                        <Input
                          value={skill.name}
                          onChange={(e) => {
                            const updated = [...resume.data.skills];
                            updated[index].name = e.target.value;
                            updateResumeData("skills", updated);
                          }}
                          className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white/70 backdrop-blur-sm"
                          placeholder="JavaScript"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <Settings className="h-4 w-4 mr-2 text-emerald-500" />
                          Proficiency Level
                        </label>
                        <Select
                          value={skill.level}
                          onValueChange={(value) => {
                            const updated = [...resume.data.skills];
                            updated[index].level = value;
                            updateResumeData("skills", updated);
                          }}
                        >
                          <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white/70 backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-md border-emerald-200">
                            <SelectItem value="beginner" className="hover:bg-emerald-50">Beginner</SelectItem>
                            <SelectItem value="intermediate" className="hover:bg-emerald-50">Intermediate</SelectItem>
                            <SelectItem value="advanced" className="hover:bg-emerald-50">Advanced</SelectItem>
                            <SelectItem value="expert" className="hover:bg-emerald-50">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Status indicator */}
                    {skill.name && skill.level && (
                      <div className="flex items-center space-x-2 pt-2 border-t border-emerald-200/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-700 font-medium">
                          Complete
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  onClick={addSkill}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl py-3 border-0"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Skill
                </Button>

                {resume.data.skills.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Zap className="h-12 w-12 mx-auto mb-3 opacity-50 text-emerald-400" />
                    <p className="text-sm">No skills added yet</p>
                    <p className="text-xs">
                      Click "Add Skill" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-200 rounded-full mr-3 shadow-inner">
                    <FileText className="h-5 w-5 text-pink-600" />
                  </div>
                  Projects
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200"
                  >
                    {resume.data.projects.length} added
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Showcase your personal and professional projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.data.projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative border border-pink-200/50 rounded-2xl p-6 space-y-5 bg-gradient-to-br from-pink-50/30 to-rose-50/30 hover:from-pink-50/50 hover:to-rose-50/50 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Header with index and remove button */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 group-hover:text-pink-800 transition-colors">
                            {project.name || "Project Name"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {project.technologies.join(", ") || "Technologies"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-full p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-pink-500" />
                            Project Name
                          </label>
                          <Input
                            value={project.name}
                            onChange={(e) => {
                              const updated = [...resume.data.projects];
                              updated[index].name = e.target.value;
                              updateResumeData("projects", updated);
                            }}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="E-commerce Website"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-pink-500" />
                            Technologies
                          </label>
                          <Input
                            value={project.technologies.join(", ")}
                            onChange={(e) => {
                              const updated = [...resume.data.projects];
                              updated[index].technologies = e.target.value.split(",").map(tech => tech.trim());
                              updateResumeData("projects", updated);
                            }}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-pink-500" />
                          Description
                        </label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...resume.data.projects];
                            updated[index].description = e.target.value;
                            updateResumeData("projects", updated);
                          }}
                          rows={3}
                          className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm resize-none"
                          placeholder="Describe the project, your role, and key achievements..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-pink-500" />
                            Project URL{" "}
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </label>
                          <Input
                            type="url"
                            value={project.url || ""}
                            onChange={(e) => {
                              const updated = [...resume.data.projects];
                              updated[index].url = e.target.value;
                              updateResumeData("projects", updated);
                            }}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="https://myproject.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-pink-500" />
                            GitHub URL{" "}
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </label>
                          <Input
                            type="url"
                            value={project.github || ""}
                            onChange={(e) => {
                              const updated = [...resume.data.projects];
                              updated[index].github = e.target.value;
                              updateResumeData("projects", updated);
                            }}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Settings className="h-4 w-4 mr-2 text-pink-500" />
                            Date Range
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              type="date"
                              value={project.startDate}
                              onChange={(e) => {
                                const updated = [...resume.data.projects];
                                updated[index].startDate = e.target.value;
                                updateResumeData("projects", updated);
                              }}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            />
                            <Input
                              type="date"
                              value={project.endDate}
                              onChange={(e) => {
                                const updated = [...resume.data.projects];
                                updated[index].endDate = e.target.value;
                                updateResumeData("projects", updated);
                              }}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20 bg-white/70 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      {project.name && project.description && (
                        <div className="flex items-center space-x-2 pt-2 border-t border-pink-200/30">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-700 font-medium">
                            Complete
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={addProject}
                  className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl py-3 border-0"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Project
                </Button>

                {resume.data.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50 text-pink-400" />
                    <p className="text-sm">No projects added yet</p>
                    <p className="text-xs">
                      Click "Add Project" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full mr-3 shadow-inner">
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  Certifications
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200"
                  >
                    {resume.data.certifications.length} added
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Showcase your professional certifications and credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.data.certifications &&
                  resume.data.certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="group relative border border-amber-200/50 rounded-2xl p-6 space-y-5 bg-gradient-to-br from-amber-50/30 to-orange-50/30 hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-300 hover:shadow-md"
                    >
                      {/* Header with index and remove button */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                              {cert.name || "Certification Name"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {cert.issuer || "Issuing Organization"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-full p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-amber-500" />
                            Certification Name
                          </label>
                          <Input
                            value={cert.name}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].name = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="AWS Certified Solutions Architect"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-amber-500" />
                            Issuing Organization
                          </label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].issuer = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="Amazon Web Services"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-amber-500" />
                            Issue Date
                          </label>
                          <Input
                            type="date"
                            value={cert.issueDate}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].issueDate = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Settings className="h-4 w-4 mr-2 text-amber-500" />
                            Expiry Date{" "}
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </label>
                          <Input
                            type="date"
                            value={cert.expiryDate || ""}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].expiryDate = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Badge className="h-4 w-4 mr-2 text-amber-500" />
                            Credential ID{" "}
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </label>
                          <Input
                            value={cert.credentialId || ""}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].credentialId = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="ABC123456789"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-amber-500" />
                            Credential URL{" "}
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </label>
                          <Input
                            type="url"
                            value={cert.url || ""}
                            onChange={(e) => {
                              const updated = [...resume.data.certifications];
                              updated[index].url = e.target.value;
                              updateResumeData("certifications", updated);
                            }}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/70 backdrop-blur-sm"
                            placeholder="https://verify.certification.com/ABC123"
                          />
                        </div>
                      </div>

                      {/* Status indicator */}
                      {cert.name && cert.issuer && (
                        <div className="flex items-center space-x-2 pt-2 border-t border-amber-200/30">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-700 font-medium">
                            Complete
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                <Button
                  onClick={addCertification}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl py-3 border-0"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Certification
                </Button>

                {resume.data.certifications.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50 text-amber-400" />
                    <p className="text-sm">No certifications added yet</p>
                    <p className="text-xs">
                      Click "Add Certification" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="sticky top-24">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full mr-3">
                    <Eye className="h-5 w-5 text-indigo-600" />
                  </div>
                  Live Preview
                </CardTitle>
                <CardDescription className="text-gray-600">
                  See how your resume looks in real-time as you type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[700px] shadow-inner">
                  {/* Resume Preview */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {resume.data.personalInfo.firstName || "First Name"}{" "}
                      {resume.data.personalInfo.lastName || "Last Name"}
                    </h1>
                    <div className="flex flex-col space-y-1 text-gray-600">
                      {resume.data.personalInfo.email && (
                        <p>{resume.data.personalInfo.email}</p>
                      )}
                      {resume.data.personalInfo.phone && (
                        <p>{resume.data.personalInfo.phone}</p>
                      )}
                      {resume.data.personalInfo.location && (
                        <p>{resume.data.personalInfo.location}</p>
                      )}
                    </div>
                  </div>

                  {resume.data.summary && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {resume.data.summary}
                      </p>
                    </div>
                  )}

                  {resume.data.experience.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-purple-600 pb-1">
                        Work Experience
                      </h2>
                      <div className="space-y-6">
                        {resume.data.experience.map((exp) => (
                          <div
                            key={exp.id}
                            className="border-l-4 border-purple-500 pl-4"
                          >
                            <h3 className="text-lg font-semibold text-gray-900">
                              {exp.position || "Job Title"}
                            </h3>
                            <p className="text-purple-600 font-medium mb-2">
                              {exp.company || "Company Name"}
                            </p>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {exp.description ||
                                "Describe your responsibilities and achievements..."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.data.skills.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-1">
                        Skills
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {resume.data.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="border-l-4 border-emerald-500 pl-4"
                          >
                            <h3 className="text-lg font-semibold text-gray-900">
                              {skill.name || "Skill Name"}
                            </h3>
                            <p className="text-emerald-600 font-medium capitalize">
                              {skill.level || "Level"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.data.certifications &&
                    resume.data.certifications.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-600 pb-1">
                          Certifications
                        </h2>
                        <div className="space-y-4">
                          {resume.data.certifications.map((cert) => (
                            <div
                              key={cert.id}
                              className="border-l-4 border-orange-500 pl-4"
                            >
                              <h3 className="text-lg font-semibold text-gray-900">
                                {cert.name || "Certification Name"}
                              </h3>
                              <p className="text-orange-600 font-medium mb-1">
                                {cert.issuer || "Issuing Organization"}
                              </p>
                              <p className="text-gray-600 text-sm mb-1">
                                Issued:{" "}
                                {cert.issueDate
                                  ? new Date(
                                      cert.issueDate
                                    ).toLocaleDateString()
                                  : "Issue Date"}
                              </p>
                              {cert.expiryDate && (
                                <p className="text-gray-600 text-sm mb-1">
                                  Expires:{" "}
                                  {new Date(
                                    cert.expiryDate
                                  ).toLocaleDateString()}
                                </p>
                              )}
                              {cert.credentialId && (
                                <p className="text-gray-600 text-sm">
                                  Credential ID: {cert.credentialId}
                                </p>
                              )}
                              {cert.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  View Credential
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {!resume.data.summary &&
                    resume.data.experience.length === 0 &&
                    (!resume.data.certifications ||
                      resume.data.certifications.length === 0) && (
                      <div className="text-center py-16 text-gray-400">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">
                          Your resume preview will appear here
                        </p>
                        <p className="text-sm">
                          Start filling out the form on the left
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
