"use client";

export default function ManageSubscriptionButton() {
  return (
    <form action="/api/stripe/portal" method="POST">
      <button
        type="submit"
        className="text-sm text-caramel hover:underline font-medium"
      >
        Manage subscription →
      </button>
    </form>
  );
}
