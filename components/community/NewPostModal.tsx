"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { createPost } from "@/lib/community/posts";
import { PostType, PostTopic } from "@/lib/community/types";
import { createClient } from "@/lib/supabase/client";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const POST_TYPES: { value: PostType; label: string; desc: string }[] = [
  { value: "question", label: "Question", desc: "Ask the community" },
  { value: "discussion", label: "Discussion", desc: "Start a conversation" },
];

const TOPICS: { value: PostTopic; label: string }[] = [
  { value: "sourdough", label: "Sourdough" },
  { value: "pricing", label: "Pricing" },
  { value: "decorating", label: "Decorating" },
  { value: "business", label: "Business" },
  { value: "general", label: "General" },
];

export default function NewPostModal({ isOpen, onClose, userId }: NewPostModalProps) {
  const router = useRouter();
  const [type, setType] = useState<PostType>("discussion");
  const [topic, setTopic] = useState<PostTopic>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setError(null);

    let imageUrl: string | undefined;

    if (imageFile) {
      const supabase = createClient();
      const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("community-images")
        .upload(filePath, imageFile, {
          upsert: false,
          contentType: imageFile.type || "image/jpeg",
        });

      if (uploadError) {
        setSubmitting(false);
        setError("Image upload failed. Please try again.");
        return;
      }

      const { data } = supabase.storage.from("community-images").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const { id, error: err } = await createPost(userId, {
      type,
      topic,
      title: title.trim(),
      body: body.trim(),
      image_url: imageUrl,
    });
    setSubmitting(false);
    if (err) { setError(err); return; }
    onClose();
    if (id) router.push(`/app/community/${id}`);
    else router.refresh();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Post">
      <div className="space-y-4">
        {/* Type */}
        <div className="grid grid-cols-2 gap-2">
          {POST_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`p-2.5 rounded-lg border text-left transition-colors ${
                type === t.value ? "border-caramel bg-caramel/5" : "border-border"
              }`}
            >
              <div className="text-xs font-semibold text-brown">{t.label}</div>
              <div className="text-xs text-text-light mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Topic */}
        <div>
          <label className="text-xs font-medium text-text-mid mb-1.5 block">Topic</label>
          <div className="flex gap-2 flex-wrap">
            {TOPICS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTopic(t.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  topic === t.value ? "bg-caramel text-white border-caramel" : "border-border text-text-mid"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-medium text-text-mid mb-1.5 block">Title</label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-caramel"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-xs font-medium text-text-mid mb-1.5 block">Details</label>
          <textarea
            rows={4}
            placeholder="Share more details..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-caramel"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="text-xs font-medium text-text-mid mb-1.5 block">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-caramel"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!title.trim() || !body.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </Modal>
  );
}
