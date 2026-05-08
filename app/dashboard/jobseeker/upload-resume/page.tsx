"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

export default function UploadResume() {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = authStorage.getAccessToken();

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data?: { jobSeeker?: { resume?: unknown } } }>("/api/jobseeker/profile")
      .then((data) => setResume(data.data?.jobSeeker?.resume || null))
      .catch(() => setResume(null));
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements.namedItem("resume") as HTMLInputElement);
    if (!fileInput.files?.length) return toast.success("Please select a file.");

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);

    setLoading(true);
    try {
      const data = await apiFetch<{ data?: { resume?: unknown } }>("/api/jobseeker/resume", {
        method: "POST",
        body: formData,
      });
      setResume(data?.data?.resume || null);
      toast.success("Resume uploaded!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete resume?")) return;
    setLoading(true);
    try {
      await apiFetch("/api/jobseeker/resume", {
        method: "DELETE",
      });
      setResume(null);
      toast.success("Resume deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete resume";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
      {resume ? (
        <div className="space-y-3">
          <a href={resume.url} target="_blank" className="text-blue-600 underline">{resume.filename}</a>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Resume
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" name="resume" accept=".pdf,.doc,.docx" className="border p-2 w-full rounded" />
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}
    </div>
  );
}
