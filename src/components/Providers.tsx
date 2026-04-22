"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ProfileProvider } from "../../lib/useProfile";

export function Providers({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => l.subscription.unsubscribe();
  }, []);

  return <ProfileProvider user={user}>{children}</ProfileProvider>;
}