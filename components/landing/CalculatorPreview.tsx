import Card from "@/components/ui/Card";

export default function CalculatorPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="text-sm font-semibold text-caramel uppercase tracking-wider">
              Sourdough Architect
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-brown">
              Your perfect loaf, calculated
            </h2>
            <p className="mt-4 text-text-mid text-lg leading-relaxed">
              Tell us how many loaves, pick your flours, set your hydration —
              and the Sourdough Architect gives you exact gram measurements for
              every ingredient. No more guesswork.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Supports multi-flour blends with ratio sliders",
                "Smart advice based on room temperature",
                "Automatic 15% moisture loss calculation",
                "Estimated bulk rise time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-sage mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-text-mid text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preview mockup */}
          <Card hover={false} className="p-0 overflow-hidden">
            <div className="bg-brown p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-white/50 text-xs">
                  Sourdough Architect
                </span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Step indicator */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full ${
                      step <= 4 ? "bg-caramel" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Mock flour selection */}
              <div>
                <p className="text-sm font-medium text-text-dark mb-3">
                  Step 4: Select Your Flours
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Bread Flour", "Whole Wheat", "Rye", "Spelt"].map(
                    (flour) => (
                      <div
                        key={flour}
                        className={`
                          px-3 py-2 rounded-lg border text-sm text-center
                          ${
                            flour === "Bread Flour"
                              ? "border-caramel bg-caramel/5 text-caramel font-medium"
                              : "border-border text-text-mid"
                          }
                        `}
                      >
                        {flour}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Mock slider */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-mid">Hydration</span>
                  <span className="font-semibold text-caramel">72%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full">
                  <div
                    className="h-full bg-caramel rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>

              {/* Mock result preview */}
              <div className="bg-cream rounded-lg p-4">
                <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">
                  Formula Preview
                </p>
                <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <span className="text-text-mid">Bread Flour</span>
                  <span className="text-text-dark font-medium text-right">
                    450g
                  </span>
                  <span className="text-text-mid">Water</span>
                  <span className="text-text-dark font-medium text-right">
                    324g
                  </span>
                  <span className="text-text-mid">Starter</span>
                  <span className="text-text-dark font-medium text-right">
                    90g
                  </span>
                  <span className="text-text-mid">Salt</span>
                  <span className="text-text-dark font-medium text-right">
                    9g
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
