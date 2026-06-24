import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Users, Shield, Sword, Package, Zap, Dice6,
  Download, ArrowRight, Calendar
} from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import Header from '../components/layout/Header';

const navCards = [
  { to: '/stats', icon: BarChart2, label: 'Statistiques', key: 'stats' as const },
  { to: '/characters', icon: Users, label: 'Personnages', key: 'characters' as const },
  { to: '/races', icon: Shield, label: 'Races', key: 'races' as const },
  { to: '/classes', icon: Sword, label: 'Classes', key: 'classes' as const },
  { to: '/items', icon: Package, label: 'Objets', key: 'items' as const },
  { to: '/skills', icon: Zap, label: 'Compétences', key: 'skills' as const },
  { to: '/dice', icon: Dice6, label: 'Système de dés', key: null },
  { to: '/export', icon: Download, label: 'Export', key: null },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { ruleSet, updateMeta } = useRuleSetStore();

  if (!ruleSet) return null;

  const counts: Record<string, number> = {
    stats: ruleSet.stats.length,
    characters: ruleSet.characters.length,
    races: ruleSet.races.length,
    classes: ruleSet.classes.length,
    items: ruleSet.items.length,
    skills: ruleSet.skills.length,
  };

  const totalElements = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Header title="Dashboard" subtitle="Vue d'ensemble de votre set de règles" />

      <div style={{ padding: '28px 32px' }}>
        {/* Ruleset name banner */}
        <div style={{
          backgroundColor: '#1c1c1e',
          border: '1px solid #2e2e32',
          borderLeft: '3px solid #e8a838',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}>
          {/* Logo */}
          <img
            src="/sword_logo.png"
            alt="logo"
            style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0 }}
          />

          <div style={{ flex: 1 }}>
            <input
              value={ruleSet.name}
              onChange={(e) => updateMeta({ name: e.target.value })}
              style={{
                width: '100%',
                fontSize: '22px',
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontWeight: 600,
                color: '#f0e6d3',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: 0,
                margin: 0,
                letterSpacing: '0.01em',
              }}
              placeholder="Nom du set…"
            />
            <input
              value={ruleSet.description}
              onChange={(e) => updateMeta({ description: e.target.value })}
              style={{
                width: '100%',
                fontSize: '13px',
                color: '#a0a0b0',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: 0,
                marginTop: '4px',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
              placeholder="Description du set…"
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '10px',
              fontSize: '11px',
              color: '#8a8a9a',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={11} />
                Créé le {new Date(ruleSet.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <span style={{
                backgroundColor: '#222224',
                border: '1px solid #2e2e32',
                borderRadius: '4px',
                padding: '1px 6px',
                fontFamily: 'monospace',
                fontSize: '10px',
              }}>
                v{ruleSet.version}
              </span>
              <span>{totalElements} élément{totalElements !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          marginBottom: '28px',
        }}>
          {navCards.filter((c) => c.key).map((card) => {
            const count = card.key ? counts[card.key] : 0;
            return (
              <button
                key={card.to}
                onClick={() => navigate(card.to)}
                style={{
                  backgroundColor: '#1c1c1e',
                  border: '1px solid #2e2e32',
                  borderRadius: '9px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232,168,56,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222224';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e32';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1c1c1e';
                }}
              >
                <div style={{
                  fontSize: '28px',
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  fontWeight: 700,
                  color: '#e8a838',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {count}
                </div>
                <div style={{ fontSize: '11px', color: '#a0a0b0' }}>
                  {card.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Section label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#8a8a9a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Sections
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#2e2e32' }} />
        </div>

        {/* Navigation cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
        }}>
          {navCards.map((card) => {
            const count = card.key ? counts[card.key] : null;
            return (
              <button
                key={card.to}
                onClick={() => navigate(card.to)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#1c1c1e',
                  border: '1px solid #2e2e32',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#404046';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222224';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e32';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1c1c1e';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#222224',
                    border: '1px solid #2e2e32',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <card.icon size={15} color="#7a7a80" />
                  </div>
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#c0b090',
                    }}>
                      {card.label}
                    </p>
                    {count !== null && (
                      <p style={{ margin: 0, fontSize: '11px', color: '#8a8a9a' }}>
                        {count} élément{count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} color="#8a8a9a" />
              </button>
            );
          })}
        </div>

        {/* Empty hint */}
        {totalElements === 0 && (
          <div style={{
            marginTop: '24px',
            padding: '18px 20px',
            backgroundColor: 'rgba(232,168,56,0.05)',
            border: '1px solid rgba(232,168,56,0.2)',
            borderLeft: '3px solid #e8a838',
            borderRadius: '9px',
          }}>
            <p style={{
              margin: '0 0 4px',
              fontSize: '15px',
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontWeight: 600,
              color: '#e8a838',
            }}>
              Commencez par les statistiques
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#7a7a80', lineHeight: 1.6 }}>
              Les statistiques sont la base de votre système. Créez-en quelques-unes (Force, Intelligence, Agilité…) pour pouvoir les référencer dans les races, classes, compétences et personnages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
