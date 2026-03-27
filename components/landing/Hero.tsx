import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32 lg:py-40">
      {/* Warm ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] bg-caramel/10 rounded-full blur-3xl" />
      </div>
      {/* Subtle grain texture via radial gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-caramel/10 border border-caramel/20 rounded-full text-caramel text-xs font-semibold tracking-wide uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
          AI-Powered for Micro-Bakeries
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-brown leading-tight">
          You Bake the Bread.
          <br />
          <span className="text-caramel italic">Let AI Build the Business.</span>
        </h1>

        <p className="mt-8 text-base sm:text-lg text-text-mid leading-relaxed max-w-2xl mx-auto">
          Dough Getter is the AI Co-Founder built for micro-bakery owners.
          Stop drowning in spreadsheets — get a business partner that handles
          your pricing, scaling, and profit, one loaf at a time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 px-8 py-3.5 bg-caramel hover:bg-caramel-lt text-white font-semibold rounded-full transition-colors shadow-md shadow-caramel/20 text-sm sm:text-base"
          >
            Meet Your Co-Founder
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/#features"
            className="px-8 py-3.5 border border-border text-text-mid hover:border-caramel/40 hover:text-brown font-semibold rounded-full transition-colors text-sm sm:text-base"
          >
            See How It Works
          </Link>
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-text-light">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-caramel" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            No credit card required
          </span>
          <span className="hidden sm:block text-border">·</span>
          <span>Free forever plan</span>
          <span className="hidden sm:block text-border">·</span>
          <span>Built for cottage bakers</span>
        </div>
      </div>
    </section>
  );
}
