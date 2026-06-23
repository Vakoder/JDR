import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, FolderOpen, BookOpen, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center px-4">
      {/* Background decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-600/30 mb-6 mx-auto">
            <BookOpen size={30} className="text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            JDR Ruleset Editor
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Créez, modifiez et exportez des sets de règles pour vos jeux de rôle.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Create */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex flex-col gap-4 p-6 bg-[#13151c] border border-[#2a2d3a] rounded-2xl text-left hover:border-violet-500/50 hover:bg-[#16192a] transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
              <FilePlus2 size={22} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Créer un nouveau set</p>
              <p className="text-slate-500 text-sm mt-1">
                Démarrez avec un set vide et construisez vos règles de zéro.
              </p>
            </div>
            <span className="text-violet-400 text-sm font-medium group-hover:text-violet-300 transition-colors mt-auto">
              Commencer →
            </span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="group flex flex-col gap-4 p-6 bg-[#13151c] border border-[#2a2d3a] rounded-2xl text-left hover:border-blue-500/50 hover:bg-[#16192a] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
              <FolderOpen size={22} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Importer un set</p>
              <p className="text-slate-500 text-sm mt-1">
                Chargez un fichier JSON existant pour le modifier.
              </p>
            </div>
            <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors mt-auto">
              {importing ? 'Chargement…' : 'Parcourir →'}
            </span>
          </button>
        </div>

        {/* Import error */}
        {importError && (
          <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-xl w-full">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{importError}</p>
          </div>
        )}

        <p className="text-slate-600 text-xs">Format supporté : JSON (.json)</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImport}
      />

      {/* Create modal */}
      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); setNewName(''); }}
        title="Nouveau set de règles"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <FormField
            label="Nom du set"
            placeholder="ex: Chroniques Oubliées, D&D 5e Maison…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div className="flex gap-3 justify-end pt-2">
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
