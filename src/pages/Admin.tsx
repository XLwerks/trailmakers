import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Users, School, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PortalFooter from "@/components/PortalFooter";

interface ImageRecord {
  id: string;
  school_id: string;
  teacher_name: string | null;
  class_name: string | null;
  task_type: string;
  task_stage: string | null;
  prompt: string | null;
  image_url: string;
  created_at: string;
}

interface SchoolRecord {
  id: string;
  name: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchSchools();
  }, [isAdmin]);

  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [filterSchoolId, setFilterSchoolId] = useState<string>("");

  useEffect(() => {
    if (!isAdmin) return;
    fetchImages();
  }, [isAdmin, filterSchoolId]);

  const fetchImages = async () => {
    setLoadingImages(true);
    let q = supabase.from("generated_images").select("*").order("created_at", { ascending: false }).limit(500);
    if (filterSchoolId) q = q.eq("school_id", filterSchoolId);
    const { data } = await q;
    if (data) setImages(data as ImageRecord[]);
    setLoadingImages(false);
  };

  const fetchSchools = async () => {
    const { data } = await supabase.from("schools").select("*").order("name");
    if (data) setSchools(data);
  };

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) return;
    setCreatingSchool(true);
    try {
      const { error } = await supabase.from("schools").insert({ name: newSchoolName.trim() });
      if (error) throw error;
      toast({ title: "School created", description: `"${newSchoolName}" has been added.` });
      setNewSchoolName("");
      fetchSchools();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreatingSchool(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword || !selectedSchoolId || !newTeacherName.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setCreatingUser(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: newEmail,
          password: newPassword,
          schoolId: selectedSchoolId,
          teacherName: newTeacherName.trim(),
          role: "teacher",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Account created", description: `Teacher account for ${newEmail} has been created.` });
      setNewEmail("");
      setNewPassword("");
      setNewTeacherName("");
      setSelectedSchoolId("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-accent bg-accent backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/portal")} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-accent-foreground leading-tight">Admin Panel</h1>
            <p className="text-xs text-accent-foreground/70">Manage schools and teacher accounts</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Create School */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <School className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Add School</h2>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="School name"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateSchool} disabled={creatingSchool}>
              {creatingSchool ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Add</>}
            </Button>
          </div>
          {schools.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">Existing schools:</p>
              {schools.map((s) => (
                <div key={s.id} className="text-sm text-foreground bg-muted px-3 py-1.5 rounded">{s.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Create Teacher Account */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Create Teacher Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>School</Label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a school...</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Teacher Name</Label>
              <Input
                placeholder="e.g. Mrs Smith"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="teacher@school.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="text"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleCreateUser} disabled={creatingUser} className="w-full">
              {creatingUser ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...</> : "Create Teacher Account"}
            </Button>
          </div>
        </div>

        {/* Submissions Gallery */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Images className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Submissions Gallery</h2>
          </div>
          <div className="mb-4">
            <Label>Filter by school</Label>
            <select
              value={filterSchoolId}
              onChange={(e) => setFilterSchoolId(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {loadingImages ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : images.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">{images.length} image{images.length === 1 ? "" : "s"} (most recent first, up to 500)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img) => {
                  const school = schools.find((s) => s.id === img.school_id);
                  return (
                    <a
                      key={img.id}
                      href={img.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block group"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={img.image_url}
                          alt={img.prompt || img.task_type}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="mt-1.5 text-xs">
                        <p className="font-semibold text-foreground truncate">{school?.name || "—"}</p>
                        <p className="text-muted-foreground truncate">
                          {img.teacher_name || "—"}{img.class_name ? ` · ${img.class_name}` : ""}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {img.task_type}{img.task_stage ? ` · ${img.task_stage}` : ""}
                        </p>
                        <p className="text-muted-foreground/70 text-[10px]">{new Date(img.created_at).toLocaleDateString()}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <PortalFooter />
    </div>
  );
};

export default Admin;
