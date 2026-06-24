import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, FolderOpen, AlertCircle } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import { importFromFile } from '../services/importService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormField from '../components/common/FormField';

export default function HomePage() {
  const navigate = useNavigate();
  const { createNew, loadRuleSet } = useRuleSetStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);

  const handleCreate = () => {
    const name = newName.trim() || 'Nouveau set de règles';
    createNew(name);
    setShowCreateModal(false);
    navigate('/dashboard');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError('');
    try {
      const rs = await importFromFile(file);
      loadRuleSet(rs);
      navigate('/dashboard');
    } catch (err) {
      setImportError((err as Error).message);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#141414',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background texture lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(46,46,50,0.4) 39px, rgba(46,46,50,0.4) 40px)',
        pointerEvents: 'none',
        opacity: 0.4,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        width: '100%',
        maxWidth: '560px',
      }}>
        {/* Logo & title */}
        <div style={{ textAlign: 'center' }}>
          {/* Logo */}
          <img
            src="/sword_logo.png"
            alt="JDR Ruleset"
            style={{ width: '90px', height: '90px', objectFit: 'contain', margin: '0 auto 20px', display: 'block' }}
          />

          <h1 style={{
            margin: '0 0 10px',
            fontSize: '38px',
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontWeight: 700,
            color: '#f0e6d3',
            letterSpacing: '0.01em',
            lineHeight: 1.1,
          }}>
            JDR Ruleset Editor
          </h1>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5a5a5e',
            maxWidth: '380px',
          }}>
            Créez, modifiez et exportez des systèmes de règles pour vos jeux de rôle.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#2e2e32',
        }} />

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          width: '100%',
        }}>
          {/* Create */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '22px',
              backgroundColor: '#1c1c1e',
              border: '1px solid #2e2e32',
              borderRadius: '10px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232,168,56,0.4)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222224';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e32';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1c1c1e';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(232,168,56,0.1)',
              border: '1px solid rgba(232,168,56,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FilePlus2 size={19} color="#e8a838" />
            </div>
            <div>
              <p style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontWeight: 600,
                color: '#f0e6d3',
              }}>
                Créer un nouveau set
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#5a5a5e', lineHeight: 1.5 }}>
                Démarrez avec un set vide et construisez vos règles from scratch.
              </p>
            </div>
            <span style={{ fontSize: '12px', color: '#e8a838', marginTop: 'auto' }}>
              Commencer →
            </span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '22px',
              backgroundColor: '#1c1c1e',
              border: '1px solid #2e2e32',
              borderRadius: '10px',
              textAlign: 'left',
              cursor: importing ? 'not-allowed' : 'pointer',
              opacity: importing ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!importing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#404046';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222224';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e32';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1c1c1e';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#222224',
              border: '1px solid #2e2e32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FolderOpen size={19} color="#7a7a80" />
            </div>
            <div>
              <p style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontWeight: 600,
                color: '#f0e6d3',
              }}>
                Importer un set
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#5a5a5e', lineHeight: 1.5 }}>
                Chargez un fichier JSON existant pour le modifier.
              </p>
            </div>
            <span style={{ fontSize: '12px', color: '#7a7a80', marginTop: 'auto' }}>
              {importing ? 'Chargement…' : 'Parcourir →'}
            </span>
          </button>
        </div>

        {/* Import error */}
        {importError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: 'rgba(192,57,43,0.1)',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: '8px',
            width: '100%',
          }}>
            <AlertCircle size={16} color="#e06050" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#e06050' }}>{importError}</p>
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#3a3a3e', margin: 0 }}>
          Format supporté : JSON (.json)
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      {/* Create modal */}
      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); setNewName(''); }}
        title="Nouveau set de règles"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField
            label="Nom du set"
            placeholder="ex: Chroniques Oubliées, D&D 5e Maison…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <Button
              variant="secondary"
              onClick={() => { setShowCreateModal(false); setNewName(''); }}
            >
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Créer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
