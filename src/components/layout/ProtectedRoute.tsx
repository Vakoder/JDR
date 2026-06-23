import { Navigate } from 'react-router-dom';
import { useRuleSetStore } from '../../store/ruleSetStore';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const ruleSet = useRuleSetStore((s) => s.ruleSet);
  if (!ruleSet) return <Navigate to="/" replace />;
  return <>{children}</>;
}
