import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  schoolId: string | null;
  schoolName: string | null;
  teacherName: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  schoolId: null,
  schoolName: null,
  teacherName: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    // Check role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    const admin = roles?.some((r: any) => r.role === "admin") ?? false;
    setIsAdmin(admin);

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("school_id, teacher_name")
      .eq("id", userId)
      .single();

    if (profile) {
      setSchoolId(profile.school_id);
      setTeacherName(profile.teacher_name);

      if (profile.school_id) {
        const { data: school } = await supabase
          .from("schools")
          .select("name")
          .eq("id", profile.school_id)
          .single();
        setSchoolName(school?.name ?? null);
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setIsAdmin(false);
          setSchoolId(null);
          setSchoolName(null);
          setTeacherName(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, schoolId, schoolName, teacherName, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
