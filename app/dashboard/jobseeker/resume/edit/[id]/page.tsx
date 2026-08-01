'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import GradientLoader from '@/app/components/GradientLoader';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch, authStorage } from '@/lib/api-client';
import {
  User, Briefcase, GraduationCap, Award, Code, Save, FileText, ArrowLeft, Star, Settings
} from 'lucide-react';

export default function EditResumePage() {
    const params = useParams();
    const router = useRouter();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('basics');

    useEffect(() => {
        const token = authStorage.getAccessToken();
        if (!token) {
            toast.error("Please log in to edit your resume");
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            setLoading(true);
            const response = await apiFetch<any>(`/api/resume/${params.id}`);
            if (!response?.data?.resume?.personalInfo) {
               // initialize objects if missing
               const r = response.data.resume;
               if(!r.personalInfo) r.personalInfo = {};
               if(!r.professionalDetails) r.professionalDetails = {};
               setResume(r);
            } else {
               setResume(response.data.resume);
            }
        } catch (err: any) {
            toast.error(err?.message || 'Failed to load resume');
            router.push('/dashboard/jobseeker/resume');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await apiFetch(`/api/resume/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(resume),
            });
            toast.success('Resume saved successfully');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const handleGeneratePDF = async () => {
        try {
            setGenerating(true);
            await apiFetch(`/api/resume/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(resume),
            });
            await apiFetch(`/api/resume/${params.id}/generate-pdf`, { method: "POST" });
            toast.success('PDF generated successfully');
            router.push(`/dashboard/jobseeker/resume/preview/${params.id}`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    const handleSetDefault = async () => {
        try {
            await apiFetch(`/api/resume/${params.id}/set-default`, { method: "POST" });
            toast.success('Resume set as default');
            fetchResume();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to set default');
        }
    };

    const handleGenerateAIEssay = async () => {
        try {
            toast.info("Generating professional summary with AI...");
            setGenerating(true);
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const aiText = "Dedicated and compassionate healthcare professional with a strong background in patient care and clinical operations. Proven ability to work effectively in high-pressure environments, ensuring the highest standards of medical service. Committed to continuous learning and improving patient outcomes through evidence-based practices.";
            handleRootFieldChange('summary', aiText);
            toast.success("Summary generated successfully!");
        } catch(err) {
            toast.error("Failed to generate summary");
        } finally {
            setGenerating(false);
        }
    };

    // Generic Handlers
    const handleFieldChange = (section: string, field: string, value: any) => {
        setResume((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleRootFieldChange = (field: string, value: any) => {
        setResume((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleArrayItemChange = (section: string, index: number, field: string, value: any) => {
        const newArr = [...(resume[section] || [])];
        newArr[index] = { ...newArr[index], [field]: value };
        setResume((prev: any) => ({ ...prev, [section]: newArr }));
    };

    const addArrayItem = (section: string, defaultObj: any) => {
        setResume((prev: any) => ({
            ...prev,
            [section]: [...(prev[section] || []), defaultObj]
        }));
    };

    const removeArrayItem = (section: string, index: number) => {
        setResume((prev: any) => ({
            ...prev,
            [section]: prev[section].filter((_: any, i: number) => i !== index)
        }));
    };

    const handleStringArrayChange = (section: string, index: number, value: string) => {
        const newArr = [...(resume[section] || [])];
        newArr[index] = value;
        setResume((prev: any) => ({ ...prev, [section]: newArr }));
    };

    const addStringArrayItem = (section: string) => {
        setResume((prev: any) => ({ ...prev, [section]: [...(prev[section] || []), ""] }));
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <GradientLoader />
            </div>
        );
    }

    if (!resume) return <div className="p-8">Resume not found</div>;

    const freeTabs = [
        { id: 'basics', label: 'Basics & Summary', icon: User },
        { id: 'core', label: 'Experience & Edu', icon: Briefcase },
        { id: 'skills', label: 'Skills & Hobbies', icon: Code },
        { id: 'additional', label: 'Declaration', icon: GraduationCap },
    ];

    const premiumTabs = [
        { id: 'basics', label: 'Basics & Summary', icon: User },
        { id: 'core', label: 'Experience & Edu', icon: Briefcase },
        { id: 'skills', label: 'Skills & Hobbies', icon: Code },
        { id: 'achievements', label: 'Achievements (Pro)', icon: Award },
        { id: 'extra', label: 'Projects & Memberships', icon: GraduationCap },
        { id: 'additional', label: 'Extra Details', icon: GraduationCap },
        { id: 'preferences', label: 'Preferences', icon: Settings },
    ];

    const tabs = resume.tier === 'Premium' ? premiumTabs : freeTabs;

    const isClinical = ['Doctor', 'Nurse', 'Dentist', 'AYUSH Practitioner', 'Allied Health Professional'].includes(resume.profession);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            {/* Header section similar to old one */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard/jobseeker/resume')} className="text-gray-500 hover:text-blue-600">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <input 
                                value={resume.title}
                                onChange={(e) => handleRootFieldChange('title', e.target.value)}
                                className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 outline-none w-full"
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-sm text-gray-500 font-medium">Healthcare Professional Resume</p>
                                
                                <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
                                    <button
                                        onClick={() => {
                                            handleRootFieldChange('tier', 'Free');
                                            setActiveTab('basics');
                                        }}
                                        className={`px-4 py-1 text-xs font-bold rounded-full transition-all duration-300 ${resume.tier !== 'Premium' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Free Tier
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleRootFieldChange('tier', 'Premium');
                                            setActiveTab('basics');
                                        }}
                                        className={`px-4 py-1 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1 ${resume.tier === 'Premium' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Premium 👑
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSetDefault} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2">
                            <Star size={16} className={resume.isDefault ? "fill-yellow-400 text-yellow-400" : ""} />
                            Default
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium flex items-center gap-2">
                            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleGeneratePDF} disabled={generating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                            <FileText size={16} /> {generating ? 'Generating PDF...' : 'Preview PDF'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sticky top-28">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors mb-1 ${
                                    activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? "text-blue-600" : "text-gray-400"} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    
                    {/* BASICS TAB */}
                    {activeTab === 'basics' && (
                        <div className="space-y-6">
                            {/* Personal Info */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium">Full Name</label><input className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.fullName || ''} onChange={(e) => handleFieldChange('personalInfo', 'fullName', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Email</label><input className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.email || ''} onChange={(e) => handleFieldChange('personalInfo', 'email', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Phone</label><input className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.phone || ''} onChange={(e) => handleFieldChange('personalInfo', 'phone', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">WhatsApp</label><input className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.whatsappNumber || ''} onChange={(e) => handleFieldChange('personalInfo', 'whatsappNumber', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">LinkedIn</label><input className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.linkedIn || ''} onChange={(e) => handleFieldChange('personalInfo', 'linkedIn', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Gender</label><select className="w-full mt-1 border rounded p-2" value={resume.personalInfo?.gender || ''} onChange={(e) => handleFieldChange('personalInfo', 'gender', e.target.value)}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                                    {resume.tier === 'Premium' && (
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-purple-700 flex items-center gap-1">👑 Photo URL</label>
                                            <input className="w-full mt-1 border border-purple-200 rounded p-2 bg-purple-50" placeholder="https://example.com/photo.jpg" value={resume.personalInfo?.photoUrl || ''} onChange={(e) => handleFieldChange('personalInfo', 'photoUrl', e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Professional Details</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium">Current Designation</label><input className="w-full mt-1 border rounded p-2" value={resume.professionalDetails?.currentDesignation || ''} onChange={(e) => handleFieldChange('professionalDetails', 'currentDesignation', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Department/Specialty</label><input className="w-full mt-1 border rounded p-2" value={resume.professionalDetails?.department || ''} onChange={(e) => handleFieldChange('professionalDetails', 'department', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Total Experience (Years)</label><input type="number" className="w-full mt-1 border rounded p-2" value={resume.professionalDetails?.totalExperience || ''} onChange={(e) => handleFieldChange('professionalDetails', 'totalExperience', e.target.value)} /></div>
                                    <div><label className="text-sm font-medium">Current Employer</label><input className="w-full mt-1 border rounded p-2" value={resume.professionalDetails?.currentEmployer || ''} onChange={(e) => handleFieldChange('professionalDetails', 'currentEmployer', e.target.value)} /></div>
                                </div>
                            </div>

                            {/* Summaries */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Summary & Objective</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-medium">Professional Summary (Essay)</label>
                                            <button onClick={handleGenerateAIEssay} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition shadow-sm border border-blue-200">✨ Generate with AI</button>
                                        </div>
                                        <textarea rows={4} className="w-full mt-1 border rounded p-2" value={resume.summary || ''} onChange={(e) => handleRootFieldChange('summary', e.target.value)} placeholder="A short summary (100–200 words) highlighting experience..." />
                                    </div>
                                    {resume.tier === 'Premium' && (
                                    <div>
                                        <label className="text-sm font-medium text-purple-700">👑 Career Goals / Objective</label>
                                        <textarea rows={3} className="w-full mt-1 border border-purple-200 bg-purple-50 rounded p-2" value={resume.careerObjective || ''} onChange={(e) => handleRootFieldChange('careerObjective', e.target.value)} placeholder="A concise statement describing career aspirations..." />
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CORE TAB */}
                    {activeTab === 'core' && (
                        <div className="space-y-6">
                            {/* Work Experience */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Work Experience</h2>
                                    <button onClick={() => addArrayItem('workExperience', { position: '', company: '', startDate: new Date() })} className="text-sm text-blue-600 font-medium">+ Add Experience</button>
                                </div>
                                {resume.workExperience?.map((exp: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                                        <button onClick={() => removeArrayItem('workExperience', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div><label className="text-xs font-medium">Position/Designation</label><input className="w-full border rounded p-2 text-sm" value={exp.position || ''} onChange={e => handleArrayItemChange('workExperience', i, 'position', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Organization</label><input className="w-full border rounded p-2 text-sm" value={exp.company || ''} onChange={e => handleArrayItemChange('workExperience', i, 'company', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Department</label><input className="w-full border rounded p-2 text-sm" value={exp.department || ''} onChange={e => handleArrayItemChange('workExperience', i, 'department', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Location</label><input className="w-full border rounded p-2 text-sm" value={exp.location || ''} onChange={e => handleArrayItemChange('workExperience', i, 'location', e.target.value)} /></div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="text-xs font-medium">Responsibilities</label>
                                            <textarea rows={2} className="w-full border rounded p-2 text-sm" value={exp.description || ''} onChange={e => handleArrayItemChange('workExperience', i, 'description', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Education */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Educational Qualifications</h2>
                                    <button onClick={() => addArrayItem('education', { degree: '', institution: '', yearOfCompletion: new Date().getFullYear() })} className="text-sm text-blue-600 font-medium">+ Add Education</button>
                                </div>
                                {resume.education?.map((ed: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                                        <button onClick={() => removeArrayItem('education', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div><label className="text-xs font-medium">Degree/Qualification</label><input className="w-full border rounded p-2 text-sm" value={ed.degree || ''} onChange={e => handleArrayItemChange('education', i, 'degree', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Specialization</label><input className="w-full border rounded p-2 text-sm" value={ed.field || ''} onChange={e => handleArrayItemChange('education', i, 'field', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Institution</label><input className="w-full border rounded p-2 text-sm" value={ed.institution || ''} onChange={e => handleArrayItemChange('education', i, 'institution', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">University/Board</label><input className="w-full border rounded p-2 text-sm" value={ed.university || ''} onChange={e => handleArrayItemChange('education', i, 'university', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Year</label><input type="number" className="w-full border rounded p-2 text-sm" value={ed.yearOfCompletion || ''} onChange={e => handleArrayItemChange('education', i, 'yearOfCompletion', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Registration */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Registrations & Licenses</h2>
                                    <button onClick={() => addArrayItem('registrationDetails', { registrationType: '' })} className="text-sm text-blue-600 font-medium">+ Add Registration</button>
                                </div>
                                {resume.registrationDetails?.map((reg: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                                        <button onClick={() => removeArrayItem('registrationDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div><label className="text-xs font-medium">Type (e.g. NMC)</label><input className="w-full border rounded p-2 text-sm" value={reg.registrationType || ''} onChange={e => handleArrayItemChange('registrationDetails', i, 'registrationType', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Number</label><input className="w-full border rounded p-2 text-sm" value={reg.registrationNumber || ''} onChange={e => handleArrayItemChange('registrationDetails', i, 'registrationNumber', e.target.value)} /></div>
                                            <div><label className="text-xs font-medium">Authority</label><input className="w-full border rounded p-2 text-sm" value={reg.authority || ''} onChange={e => handleArrayItemChange('registrationDetails', i, 'authority', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SKILLS TAB */}
                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Areas of Expertise</h2>
                                {resume.areasOfExpertise?.map((skill: string, i: number) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="flex-1 border rounded p-2 text-sm" value={skill} onChange={e => handleStringArrayChange('areasOfExpertise', i, e.target.value)} placeholder="e.g. General Surgery" />
                                        <button onClick={() => removeArrayItem('areasOfExpertise', i)} className="text-red-500 font-bold px-2">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addStringArrayItem('areasOfExpertise')} className="text-sm text-blue-600 font-medium mt-2">+ Add Area of Expertise</button>
                            </div>

                            {isClinical && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4">Clinical & Professional Skills</h2>
                                    {resume.clinicalSkills?.map((skill: string, i: number) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input className="flex-1 border rounded p-2 text-sm" value={skill} onChange={e => handleStringArrayChange('clinicalSkills', i, e.target.value)} placeholder="e.g. IV Cannulation" />
                                            <button onClick={() => removeArrayItem('clinicalSkills', i)} className="text-red-500 font-bold px-2">X</button>
                                        </div>
                                    ))}
                                    <button onClick={() => addStringArrayItem('clinicalSkills')} className="text-sm text-blue-600 font-medium mt-2">+ Add Clinical Skill</button>
                                </div>
                            )}

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Technical & Equipment Skills</h2>
                                {resume.technicalSkills?.map((skill: string, i: number) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="flex-1 border rounded p-2 text-sm" value={skill} onChange={e => handleStringArrayChange('technicalSkills', i, e.target.value)} placeholder="e.g. Ventilator, HIS/EMR" />
                                        <button onClick={() => removeArrayItem('technicalSkills', i)} className="text-red-500 font-bold px-2">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addStringArrayItem('technicalSkills')} className="text-sm text-blue-600 font-medium mt-2">+ Add Technical Skill</button>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Hobbies & Interests</h2>
                                {resume.hobbies?.map((hobby: string, i: number) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="flex-1 border rounded p-2 text-sm" value={hobby} onChange={e => handleStringArrayChange('hobbies', i, e.target.value)} placeholder="e.g. Photography, Reading, Traveling" />
                                        <button onClick={() => removeArrayItem('hobbies', i)} className="text-red-500 font-bold px-2">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addStringArrayItem('hobbies')} className="text-sm text-blue-600 font-medium mt-2">+ Add Hobby</button>
                            </div>

                        </div>
                    )}

                    {/* ACHIEVEMENTS TAB */}
                    {activeTab === 'achievements' && (
                        <div className="space-y-6">
                            {/* Workshops */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 Workshops / Conferences</h2>
                                    <button onClick={() => addArrayItem('workshopDetails', { name: '', yearMonth: '', organization: '', role: '' })} className="text-sm text-purple-600 font-medium">+ Add Workshop</button>
                                </div>
                                {resume.workshopDetails?.map((w: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-2 gap-4">
                                        <button onClick={() => removeArrayItem('workshopDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Name</label><input className="w-full border rounded p-2 text-sm bg-white" value={w.name || ''} onChange={e => handleArrayItemChange('workshopDetails', i, 'name', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Year/Month</label><input className="w-full border rounded p-2 text-sm bg-white" value={w.yearMonth || ''} onChange={e => handleArrayItemChange('workshopDetails', i, 'yearMonth', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Organization</label><input className="w-full border rounded p-2 text-sm bg-white" value={w.organization || ''} onChange={e => handleArrayItemChange('workshopDetails', i, 'organization', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Faculty/Delegate</label><input className="w-full border rounded p-2 text-sm bg-white" value={w.role || ''} onChange={e => handleArrayItemChange('workshopDetails', i, 'role', e.target.value)} /></div>
                                    </div>
                                ))}
                            </div>

                            {/* Research */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 Research / Publications</h2>
                                    <button onClick={() => addArrayItem('researchDetails', { type: '', articleName: '', journal: '', year: '', issue: '' })} className="text-sm text-purple-600 font-medium">+ Add Research</button>
                                </div>
                                {resume.researchDetails?.map((r: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <button onClick={() => removeArrayItem('researchDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Type</label><input className="w-full border rounded p-2 text-sm bg-white" value={r.type || ''} onChange={e => handleArrayItemChange('researchDetails', i, 'type', e.target.value)} /></div>
                                        <div className="col-span-2"><label className="text-xs font-medium">Name of Article</label><input className="w-full border rounded p-2 text-sm bg-white" value={r.articleName || ''} onChange={e => handleArrayItemChange('researchDetails', i, 'articleName', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Journal</label><input className="w-full border rounded p-2 text-sm bg-white" value={r.journal || ''} onChange={e => handleArrayItemChange('researchDetails', i, 'journal', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Year</label><input type="number" className="w-full border rounded p-2 text-sm bg-white" value={r.year || ''} onChange={e => handleArrayItemChange('researchDetails', i, 'year', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Issue</label><input className="w-full border rounded p-2 text-sm bg-white" value={r.issue || ''} onChange={e => handleArrayItemChange('researchDetails', i, 'issue', e.target.value)} /></div>
                                    </div>
                                ))}
                            </div>

                            {/* Awards */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 Awards & Achievements</h2>
                                    <button onClick={() => addArrayItem('awardDetails', { name: '', year: '', awardedBy: '' })} className="text-sm text-purple-600 font-medium">+ Add Award</button>
                                </div>
                                {resume.awardDetails?.map((a: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-3 gap-4">
                                        <button onClick={() => removeArrayItem('awardDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Name of Award</label><input className="w-full border rounded p-2 text-sm bg-white" value={a.name || ''} onChange={e => handleArrayItemChange('awardDetails', i, 'name', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Year</label><input type="number" className="w-full border rounded p-2 text-sm bg-white" value={a.year || ''} onChange={e => handleArrayItemChange('awardDetails', i, 'year', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Awarded By</label><input className="w-full border rounded p-2 text-sm bg-white" value={a.awardedBy || ''} onChange={e => handleArrayItemChange('awardDetails', i, 'awardedBy', e.target.value)} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EXTRA TAB (Premium) */}
                    {activeTab === 'extra' && (
                        <div className="space-y-6">
                            {/* Projects */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 Projects</h2>
                                    <button onClick={() => addArrayItem('projectDetails', { name: '', year: '', organization: '', status: 'Completed' })} className="text-sm text-purple-600 font-medium">+ Add Project</button>
                                </div>
                                {resume.projectDetails?.map((p: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-2 gap-4">
                                        <button onClick={() => removeArrayItem('projectDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Name</label><input className="w-full border rounded p-2 text-sm bg-white" value={p.name || ''} onChange={e => handleArrayItemChange('projectDetails', i, 'name', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Year</label><input type="number" className="w-full border rounded p-2 text-sm bg-white" value={p.year || ''} onChange={e => handleArrayItemChange('projectDetails', i, 'year', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Organization</label><input className="w-full border rounded p-2 text-sm bg-white" value={p.organization || ''} onChange={e => handleArrayItemChange('projectDetails', i, 'organization', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Ongoing/Complete</label>
                                            <select className="w-full border rounded p-2 text-sm bg-white" value={p.status || 'Completed'} onChange={e => handleArrayItemChange('projectDetails', i, 'status', e.target.value)}>
                                                <option value="Completed">Completed</option>
                                                <option value="Ongoing">Ongoing</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Professional Memberships */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 Professional Memberships</h2>
                                    <button onClick={() => addArrayItem('membershipDetails', { organization: '', type: 'Full time', memberNo: '' })} className="text-sm text-purple-600 font-medium">+ Add Membership</button>
                                </div>
                                {resume.membershipDetails?.map((m: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-3 gap-4">
                                        <button onClick={() => removeArrayItem('membershipDetails', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Organization Name</label><input className="w-full border rounded p-2 text-sm bg-white" value={m.organization || ''} onChange={e => handleArrayItemChange('membershipDetails', i, 'organization', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Type</label>
                                            <select className="w-full border rounded p-2 text-sm bg-white" value={m.type || 'Full time'} onChange={e => handleArrayItemChange('membershipDetails', i, 'type', e.target.value)}>
                                                <option value="Lifetime">Lifetime</option>
                                                <option value="Full time">Full time</option>
                                                <option value="Associate">Associate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div><label className="text-xs font-medium">Member No.</label><input className="w-full border rounded p-2 text-sm bg-white" value={m.memberNo || ''} onChange={e => handleArrayItemChange('membershipDetails', i, 'memberNo', e.target.value)} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* ADDITIONAL TAB */}
                    {activeTab === 'additional' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Languages Known</h2>
                                {resume.languages?.map((l: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 mb-3 border-b pb-3">
                                        <input className="flex-1 border rounded p-2 text-sm" value={l.name || ''} placeholder="Language" onChange={e => handleArrayItemChange('languages', i, 'name', e.target.value)} />
                                        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={l.read || false} onChange={e => handleArrayItemChange('languages', i, 'read', e.target.checked)} /> Read</label>
                                        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={l.write || false} onChange={e => handleArrayItemChange('languages', i, 'write', e.target.checked)} /> Write</label>
                                        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={l.speak || false} onChange={e => handleArrayItemChange('languages', i, 'speak', e.target.checked)} /> Speak</label>
                                        <button onClick={() => removeArrayItem('languages', i)} className="text-red-500 font-bold">X</button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('languages', { name: '', read: true, write: true, speak: true })} className="text-sm text-blue-600 font-medium">+ Add Language</button>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Declaration</h2>
                                <textarea rows={3} className="w-full mt-1 border rounded p-2" value={resume.declaration?.text || ''} onChange={(e) => handleFieldChange('declaration', 'text', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div><label className="text-sm font-medium">Place</label><input className="w-full mt-1 border rounded p-2" value={resume.declaration?.place || ''} onChange={(e) => handleFieldChange('declaration', 'place', e.target.value)} /></div>
                                </div>
                            </div>
                            
                            {resume.tier === 'Premium' && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-purple-900">👑 References</h2>
                                    <button onClick={() => addArrayItem('references', { name: '', email: '', mobile: '', organization: '' })} className="text-sm text-purple-600 font-medium">+ Add Reference</button>
                                </div>
                                {resume.references?.map((ref: any, i: number) => (
                                    <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50 relative grid grid-cols-2 gap-4">
                                        <button onClick={() => removeArrayItem('references', i)} className="absolute top-2 right-2 text-red-500">X</button>
                                        <div><label className="text-xs font-medium">Name</label><input className="w-full border rounded p-2 text-sm bg-white" value={ref.name || ''} onChange={e => handleArrayItemChange('references', i, 'name', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Email</label><input className="w-full border rounded p-2 text-sm bg-white" value={ref.email || ''} onChange={e => handleArrayItemChange('references', i, 'email', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Mobile</label><input className="w-full border rounded p-2 text-sm bg-white" value={ref.mobile || ''} onChange={e => handleArrayItemChange('references', i, 'mobile', e.target.value)} /></div>
                                        <div><label className="text-xs font-medium">Organization/Designation</label><input className="w-full border rounded p-2 text-sm bg-white" value={ref.organization || ''} onChange={e => handleArrayItemChange('references', i, 'organization', e.target.value)} /></div>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                    )}
                    
                    {/* PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <Star className="text-yellow-500 fill-yellow-500" size={24} />
                                    <h2 className="text-xl font-bold text-blue-900">CareerMed Exclusive Fields</h2>
                                </div>
                                <p className="text-sm text-blue-800 mb-6">These fields give your resume a premium look and help you stand out to employers by showing verified badges directly on your PDF.</p>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" className="w-5 h-5 text-blue-600" checked={resume.careerMedExclusive?.showVerifiedBadge !== false} onChange={e => handleFieldChange('careerMedExclusive', 'showVerifiedBadge', e.target.checked)} />
                                        <span className="font-medium text-gray-800">Show Profile Verified Badge</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" className="w-5 h-5 text-blue-600" checked={resume.careerMedExclusive?.showRegistrationVerified !== false} onChange={e => handleFieldChange('careerMedExclusive', 'showRegistrationVerified', e.target.checked)} />
                                        <span className="font-medium text-gray-800">Show Registration Verified Badge</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" className="w-5 h-5 text-blue-600" checked={resume.careerMedExclusive?.showMobileVerified !== false} onChange={e => handleFieldChange('careerMedExclusive', 'showMobileVerified', e.target.checked)} />
                                        <span className="font-medium text-gray-800">Show Mobile Verified Badge</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" className="w-5 h-5 text-blue-600" checked={resume.careerMedExclusive?.showEmailVerified !== false} onChange={e => handleFieldChange('careerMedExclusive', 'showEmailVerified', e.target.checked)} />
                                        <span className="font-medium text-gray-800">Show Email Verified Badge</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
