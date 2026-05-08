"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

export default function UploadCoverLetter() {
  const [coverLetter, setCoverLetter] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = authStorage.getAccessToken();

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data?: { jobSeeker?: { coverLetter?: unknown } } }>("/api/jobseeker/profile")
      .then((data) => setCoverLetter(data.data?.jobSeeker?.coverLetter || null))
      .catch(() => setCoverLetter(null));
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements.namedItem("coverLetter") as HTMLInputElement);
    if (!fileInput.files?.length) return toast.success("Please select a file.");

    const formData = new FormData();
    formData.append("coverLetter", fileInput.files[0]);

    setLoading(true);
    try {
      const data = await apiFetch<{ data?: { coverLetter?: unknown } }>("/api/jobseeker/cover-letter", {
        method: "POST",
        body: formData,
      });
      setCoverLetter(data?.data?.coverLetter || null);
      toast.success("Cover letter uploaded!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete cover letter?")) return;
    setLoading(true);
    try {
      await apiFetch("/api/jobseeker/cover-letter", {
        method: "DELETE",
      });
      setCoverLetter(null);
      toast.success("Cover letter deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete cover letter";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Cover Letter</h2>
      {coverLetter ? (
        <div className="space-y-3">
          <a href={coverLetter.url} target="_blank" className="text-blue-600 underline">{coverLetter.filename}</a>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Cover Letter
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" name="coverLetter" accept=".pdf,.doc,.docx" className="border p-2 w-full rounded" />
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}
    </div>
  );
}
