"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface EditProfileFormProps {
  userId: string;
  initialName: string;
  initialUsername: string;
  initialExperienceLevel: string;
}

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "home_baker", label: "Home Baker" },
  { value: "pro_baker", label: "Pro Baker" },
  { value: "business_owner", label: "Business Owner" },
];

export default function EditProfileForm({
  userId,
  initialName,
  initialUsername,
  initialExperienceLevel,
}: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [experienceLevel, setExperienceLevel] = useState(initialExperienceLevel);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({ full_name: name, username, experience_level: experienceLevel })
      .eq("id", userId);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-dark block">Experience level</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => setExperienceLevel(level.value)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium text-left transition-colors ${
                experienceLevel === level.value
                  ? "border-caramel bg-caramel/5 text-caramel"
                  : "border-border text-text-mid hover:border-caramel"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button
        variant="primary"
        onClick={handleSave}
        loading={saving}
        disabled={!name.trim()}
      >
        {saved ? "Saved!" : "Save changes"}
      </Button>
    </div>
  );
}
