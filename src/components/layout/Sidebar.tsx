import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Shield,
  Sword,
  Package,
  Zap,
  Dice6,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useRuleSetStore } from '../../store/ruleSetStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stats', icon: BarChart2, label: 'Statistiques' },
  { to: '/characters', icon: Users, label: 'Personnages' },
  { to: '/races', icon: Shield, label: 'Races' },
  { to: '/classes', icon: Sword, label: 'Classes' },
  { to: '/items', icon: Package, label: 'Objets' },
  { to: '/skills', icon: Zap, label: 'Compétences' },
  { to: '/dice', icon: Dice6, label: 'Système de dés' },
  { to: '/export', icon: Download, label: 'Export' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const ruleSet = useRuleSetStore((s) => s.ruleSet);

  return (
    <aside
      style={{
        backgroundColor: '#171719',
        borderRight: '1px solid #2e2e32',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: collapsed ? '60px' : '220px',
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: collapsed ? '20px 0' : '20px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #2e2e32',
        }}
      >
        {/* Logo */}
        <img
          src="/sword_logo.png"
          alt="JDR Ruleset"
          style={{ width: '34px', height: '34px', objectFit: 'contain', flexShrink: 0 }}
        />
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              margin: 0,
              fontSize: '15px',
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontWeight: 600,
              color: '#f0e6d3',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
            }}>
              JDR Ruleset
            </p>
            {ruleSet && (
              <p style={{
                margin: 0,
                fontSize: '11px',
                color: '#5a5a5e',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '160px',
              }}>
                {ruleSet.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '10px 0' : '9px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              margin: '2px 8px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              position: 'relative',
              color: isActive ? '#e8a838' : '#7a7a80',
              backgroundColor: isActive ? 'rgba(232,168,56,0.1)' : 'transparent',
              borderLeft: isActive ? '2px solid #e8a838' : '2px solid transparent',
            })}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              if (!target.style.borderLeftColor.includes('232')) {
                target.style.backgroundColor = '#222224';
                target.style.color = '#c0b090';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              if (!target.style.borderLeftColor.includes('232')) {
                target.style.backgroundColor = 'transparent';
                target.style.color = '#7a7a80';
              }
            }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          borderTop: '1px solid #2e2e32',
          background: 'none',
          border: 'none',
          borderTop: '1px solid #2e2e32',
          color: '#5a5a5e',
          cursor: 'pointer',
          transition: 'color 0.15s ease',
          width: '100%',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0b090'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#5a5a5e'; }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
