'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import GradientLoader from '@/app/components/GradientLoader';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch, authStorage } from '@/lib/api-client';

const HEALTHCARE_PROFESSIONS = [
  'Doctor',
  'Dentist',
  'AYUSH Practitioner',
  'Nurse',
  'Allied Health Professional',
  'Pharmacist',
  'Technician',
  'Hospital Administrator',
  'HR & Recruitment',
  'Insurance/TPA Professional',
  'Biomedical Engineer',
  'Front Office & Support Staff',
  'Student/Intern/Fresher'
];

export default function BuildResumePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobSeekerData, setJobSeekerData] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: 'My Resume',
    autoPopulate: true,
    profession: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
    },
    styling: {
      fontFamily: 'Arial',
      fontSize: 11,
      primaryColor: '#000000',
      accentColor: '#2563eb',
      spacing: 'normal',
    },
  });

  useEffect(() => {
    const token = authStorage.getAccessToken();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      toast.error("Please log in to build your resume");
      router.push("/login");
      return;
    }

    if (!storedUser || storedUser.role !== "jobseeker") {
      toast.error("Unauthorized access");
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    fetchJobSeekerData();
  }, []);

  const fetchJobSeekerData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch<any>('/api/jobseeker/profile');
      const jobSeeker = response?.data?.jobSeeker;
      if (!jobSeeker) throw new Error('Failed to load your profile');
      setJobSeekerData(jobSeeker);

      setFormData((prev: any) => ({
        ...prev,
        profession: jobSeeker.professionalInfo?.category || 'Doctor',
        personalInfo: {
          ...prev.personalInfo,
          fullName: jobSeeker.user?.firstName && jobSeeker.user?.lastName
            ? `${jobSeeker.user.firstName} ${jobSeeker.user.lastName}`
            : '',
          email: jobSeeker.user?.email || '',
        }
      }));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.profession) {
      return toast.error("Please select a profession");
    }

    try {
      setCreating(true);
      
      // If auto-populate is checked, build the full payload
      let submitData = { ...formData };
      
      if (formData.autoPopulate && jobSeekerData) {
        submitData = {
          ...submitData,
          personalInfo: {
            fullName: formData.personalInfo.fullName,
            email: formData.personalInfo.email,
            phone: jobSeekerData.user?.phone || jobSeekerData.personalInfo?.alternatePhone || '',
            gender: jobSeekerData.personalInfo?.gender || '',
            dateOfBirth: jobSeekerData.personalInfo?.dateOfBirth || null,
            maritalStatus: jobSeekerData.personalInfo?.maritalStatus || '',
            whatsappNumber: jobSeekerData.personalInfo?.alternatePhone || '',
            linkedIn: jobSeekerData.linkedIn || '',
            careerMedProfileUrl: `${window.location.origin}/profile/${jobSeekerData.user?._id}`,
            address: {
              street: jobSeekerData.personalInfo?.address?.line1 || '',
              city: jobSeekerData.personalInfo?.address?.city || '',
              state: jobSeekerData.personalInfo?.address?.state || '',
              country: jobSeekerData.personalInfo?.address?.country || '',
              zipCode: jobSeekerData.personalInfo?.address?.pincode || '',
            }
          },
          summary: jobSeekerData.bio || '',
          professionalDetails: {
            department: jobSeekerData.professionalInfo?.doctorSpecialization || jobSeekerData.professionalInfo?.specifications?.[0] || '',
            totalExperience: jobSeekerData.experience?.totalYears || 0,
            employmentTypePreferred: jobSeekerData.jobPreferences?.preferredJobTypes || [],
            preferredShifts: jobSeekerData.jobPreferences?.preferredShifts || [],
          },
          education: (jobSeekerData.education || []).map((ed: any) => ({
            degree: ed.degree,
            field: ed.field,
            institution: ed.institution,
            yearOfCompletion: ed.yearOfCompletion,
            grade: ed.grade,
            isVisible: true
          })),
          registrationDetails: jobSeekerData.professionalInfo?.councilNo ? [{
            registrationNumber: jobSeekerData.professionalInfo.councilNo,
            validTill: jobSeekerData.professionalInfo.registrationExpiryDate,
            isVisible: true
          }] : [],
          workExperience: (jobSeekerData.workExperience || []).map((exp: any) => ({
            position: exp.position,
            company: exp.company || exp.organization,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent,
            description: exp.description,
            isVisible: true
          })),
          skills: (jobSeekerData.skills || []).map((s: any) => ({ name: s.name, isVisible: true })),
        };
      }

      const response = await apiFetch<any>('/api/resume/build', {
        method: 'POST',
        body: JSON.stringify(submitData),
      });
      const resumeId = response?.data?.resume?._id;
      if (!resumeId) throw new Error('Resume created but identifier is missing');
      
      router.push(`/dashboard/jobseeker/resume/edit/${resumeId}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <GradientLoader />
        <p className="mt-4 text-gray-500">Loading your profile data...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="p-8 max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/dashboard/jobseeker/resume')}
          className="text-blue-600 hover:text-blue-800 font-medium mb-6 flex items-center gap-2"
        >
          ← Back
        </button>
        
        <div className="bg-white p-8 rounded-xl border shadow-sm">
          <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
          <p className="text-gray-600 mb-8">
            Select your profession to generate a customized universal healthcare template.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">Resume Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Senior Resident Resume"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Profession <span className="text-red-500">*</span></label>
              <select
                name="profession"
                required
                value={formData.profession}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="" disabled>Select your profession...</option>
                {HEALTHCARE_PROFESSIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg mt-6">
              <input
                type="checkbox"
                id="autoPopulate"
                name="autoPopulate"
                checked={formData.autoPopulate}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="autoPopulate" className="text-sm cursor-pointer flex-1">
                <span className="font-semibold text-blue-900 block text-base">Auto-fill from Profile</span>
                <span className="text-blue-700">Import your education, experience, and skills directly from your CareerMed profile.</span>
              </label>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg transition shadow-md"
              >
                {creating ? 'Initializing Template...' : 'Continue to Builder →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
