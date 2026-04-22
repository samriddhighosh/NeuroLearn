"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { fetchProfile, logDailyStreak } from "./progress.js";
import { XPToast } from "../src/components/XPToast";

const ProfileContext = createContext(null);

export function ProfileProvider({ children, user }) {
  const [profile, setProfile] = useState(null);
  const [toasts,  setToasts]  = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then(setProfile);
    logDailyStreak(user.id).then(({ streak, xpAwarded }) => {
      if (xpAwarded > 0) {
        addToast(xpAwarded, "daily_streak");
        setProfile(p => p ? { ...p, xp: p.xp + xpAwarded, streak } : p);
      }
    });
  }, [user]);

  const addToast = (amount, reason) => {
    const id = Date.now();
    setToasts(t => [...t, { id, amount, reason }]);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const awardXP = (result) => {
    if (result.totalXP > 0) {
      const reason = result.courseDone
        ? "course_complete"
        : result.lessonDone
        ? "lesson_complete"
        : "subsection_complete";
      addToast(result.totalXP, reason);
      setProfile(p => p ? { ...p, xp: p.xp + result.totalXP } : p);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, awardXP }}>
      {children}
      {toasts.map(t => (
        <XPToast key={t.id} amount={t.amount} reason={t.reason} onDone={() => removeToast(t.id)} />
      ))}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);