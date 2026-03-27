import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

const samplePosts = [
  {
    type: "question" as const,
    author: "Sarah M.",
    badge: null,
    title: "Why does my sourdough keep turning out flat?",
    preview:
      "I've been baking for 3 months now and my starter seems active, but my loaves don't get good oven spring...",
    topic: "Sourdough",
    upvotes: 12,
    comments: 8,
    time: "2h ago",
  },
  {
    type: "share" as const,
    author: "Mike T.",
    badge: "Pro Baker",
    title: "First successful laminated sourdough croissants!",
    preview:
      "After 4 failed attempts, I finally nailed the lamination. The key was keeping the butter at exactly...",
    topic: "Sourdough",
    upvotes: 34,
    comments: 15,
    time: "5h ago",
  },
  {
    type: "discussion" as const,
    author: "Priya K.",
    badge: "Early Backer",
    title: "How do you price custom cakes in your area?",
    preview:
      "I'm struggling with pricing my custom cakes. I want to be competitive but also make a fair profit...",
    topic: "Pricing",
    upvotes: 21,
    comments: 19,
    time: "1d ago",
  },
];

const typeColors = {
  question: "purple",
  share: "caramel",
  discussion: "sage",
} as const;

export default function CommunityPreview() {
  return (
    <section id="community" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-purple uppercase tracking-wider">
            Community
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-brown">
            You are not baking alone
          </h2>
          <p className="mt-4 text-text-mid text-lg max-w-2xl mx-auto">
            Ask questions, share your wins (and fails), and learn from a
            community of bakers who get it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samplePosts.map((post) => (
            <Card key={post.title} className="p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={post.author} size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-dark">
                      {post.author}
                    </span>
                    {post.badge && (
                      <Badge
                        variant={
                          post.badge === "Pro Baker" ? "caramel" : "sage"
                        }
                      >
                        {post.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-text-light">{post.time}</span>
                </div>
              </div>

              {/* Type & Topic */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={typeColors[post.type]}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                <span className="text-xs text-text-light">{post.topic}</span>
              </div>

              {/* Content */}
              <h3 className="text-sm font-semibold text-text-dark mb-1.5 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-text-mid leading-relaxed line-clamp-2 mb-4">
                {post.preview}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-4 text-xs text-text-light">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                  {post.upvotes}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  {post.comments}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
