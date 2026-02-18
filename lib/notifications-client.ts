import { apiFetch } from "@/lib/api-client";

export type NotificationType =
  | "job_recommendation"
  | "application_status"
  | "saved_job_expiry"
  | "pricing"
  | "system";

export type AppNotification = {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  ctaPath?: string;
  ctaLabel?: string;
  readAt: string | null;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

type ListNotificationsResponse = {
  data?: {
    items?: AppNotification[];
    unreadCount?: number;
  };
};

export async function listNotifications(limit = 20) {
  const res = await apiFetch<ListNotificationsResponse>(`/api/notifications/mine?limit=${limit}`);
  return {
    items: res?.data?.items || [],
    unreadCount: res?.data?.unreadCount || 0,
  };
}

export async function markNotificationRead(id: string) {
  await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  await apiFetch(`/api/notifications/read-all`, { method: "PATCH" });
}

export async function createPricingNotificationEvent(payload: {
  eventType: "view_pricing" | "select_plan" | "checkout_intent";
  planId?: string;
  planName?: string;
}) {
  await apiFetch(`/api/notifications/events/pricing`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
