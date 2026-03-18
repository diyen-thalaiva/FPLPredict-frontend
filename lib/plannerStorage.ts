// /lib/plannerStorage.ts

export type PlannerPlayer = {
  element: number;
  web_name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  team: string;
  opponent: string;
  is_vice_captain: boolean; // Add this
  fixtures: string[];       // Add this
  form: number;             // Add this
  value: number;
  is_bench: boolean;
  is_captain: boolean;
  pred_points: number;
  pred_points_base: number;
};

export type Transfer = {
  out: number; // element id
  in: number;  // element id
};

export type Plan = {
  id: string;
  name: string;
  gw: number;
  created_at: string;
  squad: PlannerPlayer[];
  bank: number;
  transfers: Transfer[];
  transferCount?: number;
  transferCost?: number;
  activeChip?: string | null;
};

const MAX_PLANS = 5;

// ---------- helpers ----------

function getStorageKey(managerId: string) {
  return `planner_${managerId}`;
}

function generateId() {
  return `plan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// ---------- CRUD ----------

export function getPlans(managerId: string): Plan[] {
  if (!managerId) return [];

  const raw = localStorage.getItem(getStorageKey(managerId));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Plan[];
  } catch {
    return [];
  }
}

export function savePlans(managerId: string, plans: Plan[]) {
  localStorage.setItem(getStorageKey(managerId), JSON.stringify(plans));
}

export function createPlan(
  managerId: string,
  gw: number,
  squad: PlannerPlayer[],
  initialBank: number
): Plan | null {
  const plans = getPlans(managerId);

  if (plans.length >= MAX_PLANS) return null;

  const newPlan: Plan = {
    id: generateId(),
    name: `Transfer Plan (GW${gw}+)`,
    gw,
    created_at: new Date().toISOString(),
    squad,
    bank: initialBank,
    transfers: [],
  };

  const updated = [...plans, newPlan];
  savePlans(managerId, updated);

  return newPlan;
}

export function deletePlan(managerId: string, planId: string) {
  const plans = getPlans(managerId);
  const updated = plans.filter(p => p.id !== planId);
  savePlans(managerId, updated);
}

export function renamePlan(
  managerId: string,
  planId: string,
  newName: string
) {
  const plans = getPlans(managerId);

  const updated = plans.map(p =>
    p.id === planId ? { ...p, name: newName } : p
  );

  savePlans(managerId, updated);
}

export function duplicatePlan(
  managerId: string,
  planId: string
): Plan | null {
  const plans = getPlans(managerId);

  if (plans.length >= MAX_PLANS) return null;

  const original = plans.find(p => p.id === planId);
  if (!original) return null;

  const copy: Plan = {
    ...original,
    id: generateId(),
    name: original.name + " (Copy)",
    created_at: new Date().toISOString(),
  };

  const updated = [...plans, copy];
  savePlans(managerId, updated);

  return copy;
}

export function getPlanById(
  managerId: string,
  planId: string
): Plan | null {
  const plans = getPlans(managerId);
  return plans.find(p => p.id === planId) || null;
}

export function updatePlan(
  managerId: string,
  updatedPlan: Plan
) {
  const plans = getPlans(managerId);

  const updated = plans.map(p =>
    p.id === updatedPlan.id ? updatedPlan : p
  );

  savePlans(managerId, updated);
}