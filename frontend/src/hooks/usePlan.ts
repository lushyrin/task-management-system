import { useAuth } from './useAuth';

export type PlanType = 'free' | 'pro';

const PLAN_LIMITS: Record<PlanType, { workspaces: number; tasks: number }> = {
    free: { workspaces: 2, tasks: 20 },
    pro: { workspaces: Infinity, tasks: Infinity },
};

export const usePlan = () => {
    const { user } = useAuth();
    const plan = (user?.plan ?? 'free') as PlanType;
    const limits = PLAN_LIMITS[plan];

    return {
        plan,
        limits,
        isPro: plan === 'pro',
        isFree: plan === 'free',
        canCreateWorkspace: (currentCount: number) => currentCount < limits.workspaces,
        canCreateTask: (currentCount: number) => currentCount < limits.tasks,
        planExpiresAt: user?.planExpiresAt ?? null,
    };
};