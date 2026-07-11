"use client";

import React, { useEffect, useState } from "react";
import ConsentModal from "./ConsentModal";
import { authStorage, apiFetch } from "@/lib/api-client";
import { usePathname } from "next/navigation";

export default function ConsentWrapper({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only check on protected routes (dashboard)
    if (!pathname?.startsWith("/dashboard")) {
      setShowModal(false);
      return;
    }

    const checkConsent = async () => {
      const token = authStorage.getAccessToken();
      if (!token) return;

      const user = authStorage.getUser<any>();
      
      // We must ALWAYS verify with the backend directly if possible, or trust local storage.
      // But just to be safe, if `hasAcceptedTerms` is explicitely false, show it.
      if (user && user.hasAcceptedTerms === false) {
        setShowModal(true);
      } else if (user && user.hasAcceptedTerms === true) {
        setShowModal(false);
      } else {
        // Fetch from profile if unknown
        try {
          const profile = await apiFetch<{ data?: { user?: any } }>("/api/auth/profile");
          const profileUser = profile?.data?.user;
          if (profileUser) {
            authStorage.setUser(profileUser);
            if (profileUser.hasAcceptedTerms === false) {
              setShowModal(true);
            } else {
              setShowModal(false);
            }
          }
        } catch (e) {
          // Ignore
        }
      }
    };

    checkConsent();
  }, [pathname]);

  return (
    <>
      {children}
      <ConsentModal 
        isOpen={showModal} 
        onAccept={() => setShowModal(false)} 
      />
    </>
  );
}
