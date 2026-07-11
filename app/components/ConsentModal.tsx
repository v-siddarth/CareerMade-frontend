"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function ConsentModal({ isOpen, onAccept }: ConsentModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcceptAndContinue = async () => {
    if (!accepted) {
      toast.error("Please read and accept the terms and conditions to continue.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await apiFetch<{ data: { user: any } }>("/api/auth/accept-terms", {
        method: "POST"
      });
      
      const updatedUser = res.data?.user;
      if (updatedUser) {
        authStorage.setUser(updatedUser);
      }
      
      toast.success("Terms accepted successfully!");
      onAccept();
    } catch (error) {
      toast.error("Failed to accept terms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Terms of Service & Consent</h2>
                <p className="text-sm text-gray-500 mt-0.5">Please review and accept our updated terms before continuing.</p>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="prose prose-blue max-w-none">
                <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-100">
                  <h3 className="flex items-center gap-2 text-blue-800 font-semibold mb-2 mt-0">
                    <FileText className="w-5 h-5" />
                    Important Notice
                  </h3>
                  <p className="text-blue-900/80 text-sm m-0">
                    We have updated our platform terms and conditions. Please read through the following documents carefully. By accepting, you consent to all outlined policies.
                  </p>
                </div>

                {/* Terms Content - 19 Legal Documents */}
                <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
                  
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                      Platform Legal Documents
                    </h3>
                    <div className="pl-8">
                      <p className="mb-4">
                        Please click on each document to read our full policies, terms, and agreements:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Candidate Agreement.pdf",
                          "Candidate Declaration.pdf",
                          "Corporate Hospital Annual Subscription Agreement.pdf",
                          "Credential Verification Consent.pdf",
                          "Doctor and Nurse Verification.pdf",
                          "Employer Agreement.pdf",
                          "Employer Registration Form.pdf",
                          "Employer Service Level Policy.pdf",
                          "Employer Subscription Agreement.pdf",
                          "Grievance Redressal Policy.pdf",
                          "Healthcare Recruitment Portal Disclaimer.pdf",
                          "Job Posting Declaration.pdf",
                          "Medical Registration Disclaimer.pdf",
                          "Privacy Policy.pdf",
                          "Recruitment Assignment Request.pdf",
                          "Recruitment Services Agreement.pdf",
                          "Resume Database Access Agreement.pdf",
                          "SUCCESS FEE AGREEMENT.pdf",
                          "Terms and Conditions.pdf"
                        ].map((doc, index) => (
                          <a 
                            key={index} 
                            href={`/documents/${doc}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-gray-800 line-clamp-1" title={doc.replace(".pdf", "")}>
                              {doc.replace(".pdf", "")}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/80">
              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-500"></div>
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">I have read and agree to the Terms of Service and Consent Policies</span>
                  <p className="text-gray-500 mt-0.5">I understand that these terms govern my use of the platform and acknowledge my consent.</p>
                </div>
              </label>

              <button
                onClick={handleAcceptAndContinue}
                disabled={!accepted || loading}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Accept & Continue"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
