"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Filter,
  Info,
  ListChecks,
  RefreshCw,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import GradientLoader from "@/app/components/GradientLoader";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

type Audience = "employer" | "jobseeker";
type SubscriptionStatus = "Active" | "Inactive" | "Cancelled" | "Expired";
type FeatureFlagMap = Record<string, boolean>;
type LimitMap = Record<string, number>;
type PlanMetadata = Record<string, string>;

type FeatureDefinition = {
  key: string;
  label: string;
  category?: string;
  tooltip?: string;
  icon?: string;
};

type LimitDefinition = {
  key: string;
  label: string;
  category?: string;
  unit?: string;
  defaultValue?: number;
  tooltip?: string;
};

type TextMetadataField = {
  key: string;
  label: string;
  maxLength?: number;
  tooltip?: string;
};

type RegistryMap<T> = Record<Audience, T[]>;

type PricingPlanConfig = {
  id: string;
  audience: Audience;
  displayName: string;
  price: number;
  description: string;
  tag?: string;
  ctaLabel?: string;
  highlighted?: boolean;
  isActive?: boolean;
  features?: FeatureFlagMap;
  limits?: LimitMap;
  metadata?: PlanMetadata;
  featureList?: string[];
  displayFeatures?: { key: string; label: string }[];
  displayLimits?: { key: string; label: string; value: number; displayValue: string }[];
  subscriptionFeatures?: Record<string, number | boolean> | null;
};

type EmployerSubscription = {
  _id: string;
  organizationName: string;
  email: string;
  address?: {
    city?: string;
    state?: string;
  };
  verification?: {
    isVerified?: boolean;
  };
  subscription: {
    plan: string;
    status: SubscriptionStatus;
    startDate?: string;
    endDate?: string;
    autoRenew: boolean;
  };
};

type Overview = {
  byPlan: Record<string, number>;
  byStatus: Record<string, number>;
  estimatedMrr: number;
  renewalDueSoon: number;
};

type SyncSummary = {
  syncedSubscriberCount?: number;
  modifiedSubscriberCount?: number;
};

type SubscriptionDraftState = {
  plan: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  endDate: string;
};

const statuses: SubscriptionStatus[] = ["Active", "Inactive", "Cancelled", "Expired"];
const numberInputClass =
  "no-spinner w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100";
const textInputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-blue-100";
const checkboxClass = "h-4 w-4 rounded border-gray-300 text-[#155DFC] focus:ring-[#155DFC]";

const emptyRegistry = <T,>(): RegistryMap<T> => ({ employer: [], jobseeker: [] });

const humanizeKey = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const groupByCategory = <T extends { category?: string }>(items: T[]) =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const category = item.category || "General";
    acc[category] = [...(acc[category] || []), item];
    return acc;
  }, {});

const mergeDynamicDefinitions = <T extends { key: string; label: string }>(
  definitions: T[],
  keys: string[],
  buildFallback: (key: string) => T
) => {
  const seen = new Set(definitions.map((item) => item.key));
  return [
    ...definitions,
    ...keys.filter((key) => !seen.has(key)).map((key) => buildFallback(key)),
  ];
};

const CapabilityEditor = ({
  audience,
  draft,
  featureDefinitions,
  limitDefinitions,
  textMetadataFields,
  onFeatureToggle,
  onLimitChange,
  onLimitToggle,
  onMetadataChange,
}: {
  audience: Audience;
  draft: PricingPlanConfig;
  featureDefinitions: FeatureDefinition[];
  limitDefinitions: LimitDefinition[];
  textMetadataFields: TextMetadataField[];
  onFeatureToggle: (key: string, value: boolean) => void;
  onLimitChange: (key: string, value: number) => void;
  onLimitToggle: (definition: LimitDefinition, enabled: boolean) => void;
  onMetadataChange: (key: string, value: string) => void;
}) => {
  const features = draft.features || {};
  const limits = draft.limits || {};
  const metadata = draft.metadata || {};
  const fullFeatureDefinitions = mergeDynamicDefinitions(
    featureDefinitions,
    Object.keys(features),
    (key) => ({ key, label: humanizeKey(key), category: "Custom" })
  );
  const fullLimitDefinitions = mergeDynamicDefinitions(
    limitDefinitions,
    Object.keys(limits),
    (key) => ({ key, label: humanizeKey(key), category: "Custom", defaultValue: 0 })
  );
  const featureGroups = groupByCategory(fullFeatureDefinitions);
  const limitGroups = groupByCategory(fullLimitDefinitions);

  return (
    <div className="space-y-4 rounded-lg border border-blue-100 bg-white p-3">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <ListChecks className="h-4 w-4" />
          Feature Access
        </p>
        <div className="mt-3 space-y-4">
          {Object.entries(featureGroups).map(([category, items]) => (
            <div key={`${audience}-${category}`}>
              <p className="mb-2 text-xs font-semibold text-gray-500">{category}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((feature) => (
                  <label
                    key={feature.key}
                    className="flex min-h-11 items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                    title={feature.tooltip || feature.label}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(features[feature.key])}
                      onChange={(e) => onFeatureToggle(feature.key, e.target.checked)}
                      className={`${checkboxClass} mt-0.5`}
                    />
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900">{feature.label}</span>
                      {feature.tooltip && (
                        <span className="mt-0.5 line-clamp-2 block text-xs text-gray-500">{feature.tooltip}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <SlidersHorizontal className="h-4 w-4" />
          Numeric Limits
        </p>
        <div className="mt-3 space-y-4">
          {Object.entries(limitGroups).map(([category, items]) => (
            <div key={`${audience}-${category}`}>
              <p className="mb-2 text-xs font-semibold text-gray-500">{category}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((limit) => {
                  const enabled = Number(limits[limit.key] || 0) > 0;
                  return (
                    <div key={limit.key} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => onLimitToggle(limit, e.target.checked)}
                          className={checkboxClass}
                        />
                        {limit.label}
                      </label>
                      <input
                        type="number"
                        min={0}
                        disabled={!enabled}
                        value={Number(limits[limit.key] || 0)}
                        onChange={(e) => onLimitChange(limit.key, Number(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                        className={`${numberInputClass} disabled:bg-gray-100 disabled:text-gray-400`}
                        placeholder={limit.unit ? `Included ${limit.unit}` : "Limit"}
                      />
                      {limit.tooltip && (
                        <p className="mt-1 flex items-start gap-1 text-xs text-gray-500">
                          <Info className="mt-0.5 h-3 w-3 shrink-0" />
                          {limit.tooltip}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Plan Metadata</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {textMetadataFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium text-gray-600">{field.label}</label>
              <input
                value={metadata[field.key] || ""}
                maxLength={field.maxLength || 120}
                onChange={(e) => onMetadataChange(field.key, e.target.value)}
                className={textInputClass}
                title={field.tooltip || field.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DistributionBars = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) => {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#155DFC] to-[#00B8DB]"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminPricingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingPlans, setSavingPlans] = useState(false);

  const [items, setItems] = useState<EmployerSubscription[]>([]);
  const [overview, setOverview] = useState<Overview>({
    byPlan: {},
    byStatus: {},
    estimatedMrr: 0,
    renewalDueSoon: 0,
  });

  const [planConfigs, setPlanConfigs] = useState<PricingPlanConfig[]>([]);
  const [planDrafts, setPlanDrafts] = useState<Record<string, PricingPlanConfig>>({});
  const [featureRegistry, setFeatureRegistry] = useState<RegistryMap<FeatureDefinition>>(() =>
    emptyRegistry<FeatureDefinition>()
  );
  const [limitRegistry, setLimitRegistry] = useState<RegistryMap<LimitDefinition>>(() =>
    emptyRegistry<LimitDefinition>()
  );
  const [textMetadataFields, setTextMetadataFields] = useState<TextMetadataField[]>([
    { key: "planLabel", label: "Plan Label", maxLength: 80 },
    { key: "badgeText", label: "Badge Text", maxLength: 80 },
    { key: "ctaLabel", label: "CTA Label", maxLength: 80 },
  ]);
  const [subscriptionDrafts, setSubscriptionDrafts] = useState<Record<string, SubscriptionDraftState>>({});

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [autoRenewFilter, setAutoRenewFilter] = useState("");

  const planKey = (audience: Audience, id: string) => `${audience}:${id}`;
  const applyPlanConfigs = (plans: PricingPlanConfig[]) => {
    setPlanConfigs(plans);
    const nextDrafts: Record<string, PricingPlanConfig> = {};
    plans.forEach((plan) => {
      const metadata = {
        planLabel: plan.metadata?.planLabel || plan.displayName || "",
        badgeText: plan.metadata?.badgeText || plan.tag || "",
        ctaLabel: plan.metadata?.ctaLabel || plan.ctaLabel || "Choose Plan",
        ...(plan.metadata || {}),
      };
      nextDrafts[planKey(plan.audience, plan.id)] = {
        ...plan,
        featureList: Array.isArray(plan.featureList) ? [...plan.featureList] : [],
        features: { ...(plan.features || {}) },
        limits: { ...(plan.limits || {}) },
        metadata,
        ctaLabel: metadata.ctaLabel || plan.ctaLabel || "Choose Plan",
        tag: metadata.badgeText || plan.tag || "",
        subscriptionFeatures: plan.subscriptionFeatures ? { ...plan.subscriptionFeatures } : null,
      };
    });
    setPlanDrafts(nextDrafts);
  };

  useEffect(() => {
    fetchPlanConfigs();
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [page, appliedSearchQuery, planFilter, statusFilter, autoRenewFilter]);

  const fetchPlanConfigs = async () => {
    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        toast.error("Please log in again");
        router.push("/login");
        return;
      }

      const data = await apiFetch<{
        data: {
          plans: PricingPlanConfig[];
          featureRegistry?: RegistryMap<FeatureDefinition>;
          limitRegistry?: RegistryMap<LimitDefinition>;
          textMetadataFields?: TextMetadataField[];
        };
      }>(
        `/api/admin/pricing-plans?t=${Date.now()}`,
        { cache: "no-store" }
      );

      if (data.data.featureRegistry) setFeatureRegistry(data.data.featureRegistry);
      if (data.data.limitRegistry) setLimitRegistry(data.data.limitRegistry);
      if (data.data.textMetadataFields) setTextMetadataFields(data.data.textMetadataFields);
      const plans = (data.data.plans || []) as PricingPlanConfig[];
      applyPlanConfigs(plans);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load plan configuration";
      toast.error(message);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = authStorage.getAccessToken();
      if (!token) {
        toast.error("Please log in again");
        router.push("/login");
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (appliedSearchQuery) params.append("q", appliedSearchQuery);
      if (planFilter) params.append("plan", planFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (autoRenewFilter) params.append("autoRenew", autoRenewFilter);

      params.append("t", Date.now().toString());
      const data = await apiFetch<{
        data: { items: EmployerSubscription[]; overview: Overview; total: number };
      }>(`/api/admin/subscriptions?${params.toString()}`, {
        cache: "no-store",
      });

      const responseItems = data.data.items as EmployerSubscription[];
      setItems(responseItems);
      setOverview(data.data.overview as Overview);
      setTotal(data.data.total);

      const nextSubDrafts: Record<string, SubscriptionDraftState> = {};
      responseItems.forEach((item) => {
        nextSubDrafts[item._id] = {
          plan: item.subscription.plan,
          status: item.subscription.status,
          autoRenew: item.subscription.autoRenew,
          endDate: item.subscription.endDate
            ? new Date(item.subscription.endDate).toISOString().slice(0, 10)
            : "",
        };
      });
      setSubscriptionDrafts(nextSubDrafts);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load subscriptions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const employerPlans = useMemo(
    () => planConfigs.filter((plan) => plan.audience === "employer"),
    [planConfigs]
  );
  const jobSeekerPlans = useMemo(
    () => planConfigs.filter((plan) => plan.audience === "jobseeker"),
    [planConfigs]
  );
  const hasVisibleCatalog = employerPlans.length > 0 || jobSeekerPlans.length > 0;

  const employerPlanOptions = useMemo(
    () => employerPlans.map((plan) => plan.id),
    [employerPlans]
  );

  const handleSearch = () => {
    setPage(1);
    setAppliedSearchQuery(searchQuery);
  };

  const handleSubscriptionDraftChange = <K extends keyof SubscriptionDraftState>(
    employerId: string,
    field: K,
    value: SubscriptionDraftState[K]
  ) => {
    setSubscriptionDrafts((prev) => ({
      ...prev,
      [employerId]: {
        ...(prev[employerId] || {
          plan: "Free",
          status: "Active",
          autoRenew: false,
          endDate: "",
        }),
        [field]: value,
      },
    }));
  };

  const handlePlanTextUpdate = (
    audience: Audience,
    id: string,
    field: keyof PricingPlanConfig,
    value: string | number | boolean
  ) => {
    const key = planKey(audience, id);
    setPlanDrafts((prev) => {
      const current =
        prev[key] ||
        ({
          id,
          audience,
          displayName: id,
          price: 0,
          description: "",
          features: {},
          limits: {},
          metadata: {},
        } satisfies PricingPlanConfig);
      const metadata = { ...(current?.metadata || {}) };
      if (field === "ctaLabel") metadata.ctaLabel = String(value);
      if (field === "tag") metadata.badgeText = String(value);

      return {
        ...prev,
        [key]: {
          ...current,
          [field]: value,
          metadata,
        },
      };
    });
  };

  const handlePlanFeatureToggle = (
    audience: Audience,
    id: string,
    featureKey: string,
    value: boolean
  ) => {
    const key = planKey(audience, id);
    setPlanDrafts((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        features: {
          ...(prev[key]?.features || {}),
          [featureKey]: value,
        },
      },
    }));
  };

  const handlePlanLimitUpdate = (audience: Audience, id: string, limitKey: string, value: number) => {
    const key = planKey(audience, id);
    setPlanDrafts((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        limits: {
          ...(prev[key]?.limits || {}),
          [limitKey]: Math.max(0, Number.isFinite(value) ? value : 0),
        },
      },
    }));
  };

  const handlePlanLimitToggle = (
    audience: Audience,
    id: string,
    definition: LimitDefinition,
    enabled: boolean
  ) => {
    handlePlanLimitUpdate(audience, id, definition.key, enabled ? Number(definition.defaultValue || 1) : 0);
  };

  const handlePlanMetadataUpdate = (
    audience: Audience,
    id: string,
    metadataKey: string,
    value: string
  ) => {
    const key = planKey(audience, id);
    setPlanDrafts((prev) => {
      const current =
        prev[key] ||
        ({
          id,
          audience,
          displayName: id,
          price: 0,
          description: "",
          features: {},
          limits: {},
          metadata: {},
        } satisfies PricingPlanConfig);
      const nextMetadata = {
        ...(current?.metadata || {}),
        [metadataKey]: value,
      };
      return {
        ...prev,
        [key]: {
          ...current,
          metadata: nextMetadata,
          ctaLabel: metadataKey === "ctaLabel" ? value : current?.ctaLabel,
          tag: metadataKey === "badgeText" ? value : current?.tag,
        },
      };
    });
  };

  const hasPlanChanges = useMemo(() => {
    if (planConfigs.length === 0) return false;

    return planConfigs.some((plan) => {
      const key = planKey(plan.audience, plan.id);
      const draft = planDrafts[key];
      if (!draft) return false;
      return JSON.stringify(plan) !== JSON.stringify(draft);
    });
  }, [planConfigs, planDrafts]);

  const canSavePlanCatalog = hasPlanChanges || !hasVisibleCatalog;

  const hasSubscriptionChanges = (item: EmployerSubscription) => {
    const draft = subscriptionDrafts[item._id];
    if (!draft) return false;

    const currentEndDate = item.subscription.endDate
      ? new Date(item.subscription.endDate).toISOString().slice(0, 10)
      : "";

    return (
      draft.plan !== item.subscription.plan ||
      draft.status !== item.subscription.status ||
      draft.autoRenew !== item.subscription.autoRenew ||
      draft.endDate !== currentEndDate
    );
  };

  const handleSavePlanConfigs = async () => {
    try {
      setSavingPlans(true);
      const token = authStorage.getAccessToken();
      if (!token) {
        toast.error("Please log in again");
        return;
      }

      const invalidDraft = planConfigs
        .map((planConfig) => planDrafts[planKey(planConfig.audience, planConfig.id)] || planConfig)
        .find((plan) => {
          const hasInvalidLimit = Object.values(plan.limits || {}).some(
            (value) => !Number.isFinite(Number(value)) || Number(value) < 0
          );
          return (
            !String(plan.displayName || "").trim() ||
            !Number.isFinite(Number(plan.price)) ||
            Number(plan.price) < 0 ||
            hasInvalidLimit
          );
        });

      if (invalidDraft) {
        toast.error(`Please fix ${invalidDraft.displayName || invalidDraft.id}: name, price, and limits are required.`);
        return;
      }

      const payloadPlans = planConfigs.map((planConfig) => {
        const key = planKey(planConfig.audience, planConfig.id);
        const plan = planDrafts[key] || planConfig;
        const metadata = {
          ...(plan.metadata || {}),
          planLabel: plan.metadata?.planLabel || plan.displayName || "",
          badgeText: plan.metadata?.badgeText || plan.tag || "",
          ctaLabel: plan.metadata?.ctaLabel || plan.ctaLabel || "Choose Plan",
        };
        const limits = Object.fromEntries(
          Object.entries(plan.limits || {}).map(([limitKey, value]) => [
            limitKey,
            Math.max(0, Number(value) || 0),
          ])
        );
        return {
          id: plan.id,
          audience: plan.audience,
          displayName: String(plan.displayName || "").trim(),
          price: Number(plan.price) || 0,
          description: plan.description || "",
          tag: metadata.badgeText || plan.tag || "",
          ctaLabel: metadata.ctaLabel || "Choose Plan",
          highlighted: Boolean(plan.highlighted),
          isActive: plan.isActive !== false,
          features: { ...(plan.features || {}) },
          limits,
          metadata,
          featureList: [],
        };
      });
      const hasVisibleCatalog = employerPlans.length > 0 || jobSeekerPlans.length > 0;
      const sanitizedPayloadPlans = hasVisibleCatalog
        ? payloadPlans.filter(
            (plan) =>
              (plan.audience === "employer" || plan.audience === "jobseeker") &&
              typeof plan.id === "string" &&
              plan.id.trim().length > 0
          )
        : [];

      const data = await apiFetch<{
        data?: {
          plans?: PricingPlanConfig[];
          featureRegistry?: RegistryMap<FeatureDefinition>;
          limitRegistry?: RegistryMap<LimitDefinition>;
          textMetadataFields?: TextMetadataField[];
          syncSummary?: SyncSummary;
        };
      }>("/api/admin/pricing-plans", {
        method: "PUT",
        body: JSON.stringify({
          plans: sanitizedPayloadPlans,
          forceReseed: !hasVisibleCatalog,
        }),
      });

      const updatedPlans = (data.data?.plans || []) as PricingPlanConfig[];
      if (data.data?.featureRegistry) setFeatureRegistry(data.data.featureRegistry);
      if (data.data?.limitRegistry) setLimitRegistry(data.data.limitRegistry);
      if (data.data?.textMetadataFields) setTextMetadataFields(data.data.textMetadataFields);
      if (updatedPlans.length > 0) {
        applyPlanConfigs(updatedPlans);
      }

      const syncedCount = Number(data.data?.syncSummary?.syncedSubscriberCount || 0);
      toast.success(
        syncedCount > 0
          ? `Pricing plans updated and synced to ${syncedCount} subscribers`
          : "Pricing plans updated successfully"
      );
      await fetchSubscriptions();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update plan settings";
      toast.error(message);
    } finally {
      setSavingPlans(false);
    }
  };

  const handleSaveSubscription = async (item: EmployerSubscription) => {
    const draft = subscriptionDrafts[item._id];
    if (!draft) return;

    try {
      setSavingId(item._id);
      const token = authStorage.getAccessToken();
      if (!token) {
        toast.error("Please log in again");
        return;
      }

      const payload = {
        plan: draft.plan,
        status: draft.status,
        autoRenew: draft.autoRenew,
        endDate: draft.endDate || null,
      };

      await apiFetch(`/api/admin/subscriptions/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success("Employer subscription updated");
      await fetchSubscriptions();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save changes";
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const paidSubscribers = useMemo(() => {
    return (overview.byPlan.Basic || 0) + (overview.byPlan.Premium || 0) + (overview.byPlan.Enterprise || 0);
  }, [overview.byPlan]);

  if (loading && items.length === 0 && planConfigs.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <GradientLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full relative bg-[#002B6B] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/new1.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001b3e]/90 via-[#002b6b]/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Pricing &{" "}
              <span className="bg-gradient-to-r from-[#00A3FF] to-[#00E0FF] bg-clip-text text-transparent">
                Subscription Admin
              </span>
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mt-3">
              Configure employer and jobseeker plans separately, then manage employer assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/admin")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-full text-sm sm:text-base font-semibold transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Estimated MRR</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">₹{overview.estimatedMrr.toLocaleString()}</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Paid Subscribers</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{paidSubscribers.toLocaleString()}</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Renewal Due (14d)</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{overview.renewalDueSoon.toLocaleString()}</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tracked Subscriptions</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{total.toLocaleString()}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DistributionBars title="Employer Plans Distribution" data={overview.byPlan} />
          <DistributionBars title="Subscription Statuses" data={overview.byStatus} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-[#007BFF]" />
              Plan Catalog Configuration
            </h2>
            <button
              onClick={handleSavePlanConfigs}
              disabled={!canSavePlanCatalog || savingPlans}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {savingPlans ? "Saving..." : canSavePlanCatalog && !hasPlanChanges ? "Re-seed Plan Catalog" : "Save Plan Catalog"}
            </button>
          </div>

          <div className="space-y-8">
            {[{ title: "Employer Plans", plans: employerPlans }, { title: "Jobseeker Plans", plans: jobSeekerPlans }].map(
              ({ title, plans }) => (
                <div key={title}>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
                  {plans.length === 0 && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      No plans found for {title}. Click <span className="font-semibold">Save Plan Catalog</span> to re-seed defaults.
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {plans.map((plan) => {
                      const key = planKey(plan.audience, plan.id);
                      const draft = planDrafts[key] || plan;
                      return (
                        <div key={key} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Plan ID</label>
                              <input value={plan.id} disabled className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
                              <input
                                value={draft.displayName}
                                onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "displayName", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Price (INR)</label>
                              <input
                                type="number"
                                min={0}
                                value={draft.price}
                                onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "price", Number(e.target.value))}
                                onWheel={(e) => e.currentTarget.blur()}
                                className={numberInputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Tag</label>
                              <input
                                value={draft.tag || ""}
                                onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "tag", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">CTA Label</label>
                              <input
                                value={draft.ctaLabel || ""}
                                onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "ctaLabel", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={Boolean(draft.highlighted)}
                                  onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "highlighted", e.target.checked)}
                                />
                                Highlighted
                              </label>
                              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={draft.isActive !== false}
                                  onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "isActive", e.target.checked)}
                                />
                                Active
                              </label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={draft.description}
                              onChange={(e) => handlePlanTextUpdate(plan.audience, plan.id, "description", e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>

                          <CapabilityEditor
                            audience={plan.audience}
                            draft={draft}
                            featureDefinitions={featureRegistry[plan.audience] || []}
                            limitDefinitions={limitRegistry[plan.audience] || []}
                            textMetadataFields={textMetadataFields}
                            onFeatureToggle={(featureKey, value) =>
                              handlePlanFeatureToggle(plan.audience, plan.id, featureKey, value)
                            }
                            onLimitChange={(limitKey, value) =>
                              handlePlanLimitUpdate(plan.audience, plan.id, limitKey, value)
                            }
                            onLimitToggle={(definition, enabled) =>
                              handlePlanLimitToggle(plan.audience, plan.id, definition, enabled)
                            }
                            onMetadataChange={(metadataKey, value) =>
                              handlePlanMetadataUpdate(plan.audience, plan.id, metadataKey, value)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#007BFF]" />
            <h2 className="text-lg font-semibold text-gray-900">Employer Subscription Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Organization, email, city..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan</label>
              <select
                value={planFilter}
                onChange={(e) => {
                  setPage(1);
                  setPlanFilter(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All plans</option>
                {employerPlanOptions.map((planId) => (
                  <option key={planId} value={planId}>
                    {planDrafts[planKey("employer", planId)]?.displayName || planId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Auto Renew</label>
              <select
                value={autoRenewFilter}
                onChange={(e) => {
                  setPage(1);
                  setAutoRenewFilter(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            Apply Filters
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#007BFF]" />
              <h2 className="text-lg font-semibold text-gray-900">Employer Subscriptions ({total})</h2>
            </div>
            <button
              onClick={fetchSubscriptions}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Renew</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const draft = subscriptionDrafts[item._id];
                  const modified = hasSubscriptionChanges(item);
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.organizationName}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                          {item.verification?.isVerified && (
                            <span className="mt-1 inline-block rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {[item.address?.city, item.address?.state].filter(Boolean).join(", ") || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={draft?.plan || item.subscription.plan}
                          onChange={(e) => handleSubscriptionDraftChange(item._id, "plan", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                        >
                          {employerPlanOptions.map((planId) => (
                            <option key={planId} value={planId}>
                              {planDrafts[planKey("employer", planId)]?.displayName || planId}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={draft?.status || item.subscription.status}
                          onChange={(e) =>
                            handleSubscriptionDraftChange(item._id, "status", e.target.value as SubscriptionStatus)
                          }
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={draft?.autoRenew ?? item.subscription.autoRenew}
                            onChange={(e) => handleSubscriptionDraftChange(item._id, "autoRenew", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          Enabled
                        </label>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="date"
                          value={draft?.endDate || ""}
                          onChange={(e) => handleSubscriptionDraftChange(item._id, "endDate", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleSaveSubscription(item)}
                          disabled={!modified || savingId === item._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          {savingId === item._id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {items.length === 0 && !loading && (
            <div className="p-10 text-center text-sm text-gray-500">No subscriptions found for the selected filters.</div>
          )}

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} employers
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-[#007BFF] mt-0.5" />
          <p className="text-sm text-gray-700">
            You now manage separate pricing catalogs for employers and jobseekers. Any updates here automatically reflect in the public pricing page.
          </p>
        </div>
      </div>
      <style jsx global>{`
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spinner[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
    </div>
  );
}
