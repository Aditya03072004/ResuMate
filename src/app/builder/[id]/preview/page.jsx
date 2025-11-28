"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
} from "lucide-react";

export default function ResumePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchResume();
    }
  }, [params.id]);

  useEffect(() => {
    if (resume) {
      window.print();
    }
  }, [resume]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
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
    <div className="bg-white">
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
    </div>
  );
}
