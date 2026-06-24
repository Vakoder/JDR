import { useState } from 'react';
import { Download, FileJson, FileText, CheckCircle } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import { exportToJSON } from '../services/exportService';
import { exportToPDF } from '../services/pdfService';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';

export default function ExportPage() {
  const { ruleSet, updateMeta } = useRuleSetStore();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!ruleSet) return null;

  const handleExportJSON = () => {
    exportToJSON(ruleSet);
    setJsonSuccess(true);
    setTimeout(() => setJsonSuccess(false), 2500);
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      exportToPDF(ruleSet);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    } finally {
      setPdfLoading(false);
    }
  };

  const stats = [
    { label: 'Statistiques', value: ruleSet.stats.length },
    { label: 'Races', value: ruleSet.races.length },
    { label: 'Classes', value: ruleSet.classes.length },
    { label: 'Personnages', value: ruleSet.characters.length },
    { label: 'Objets', value: ruleSet.items.length },
    { label: 'Compétences', value: ruleSet.skills.length },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Export" subtitle="Exportez votre set de règles" />
      <div className="p-8 max-w-4xl">
        {/* Metadata */}
        <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Informations du set</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <FormField
                label="Nom"
                value={ruleSet.name}
                onChange={(e) => updateMeta({ name: e.target.value })}
              />
            </div>
            <FormField
              label="Version"
              value={ruleSet.version}
              placeholder="ex: 1.0.0"
              onChange={(e) => updateMeta({ version: e.target.value })}
            />
            <div className="sm:col-span-3">
              <FormField
                as="textarea"
                label="Description"
                value={ruleSet.description}
                placeholder="Description de votre set de règles…"
                onChange={(e) => updateMeta({ description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contenu du set</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-[#0f1117] border border-[#2a2d3a] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <span>Créé le: {new Date(ruleSet.createdAt).toLocaleDateString('fr-FR')}</span>
            <span>Modifié le: {new Date(ruleSet.updatedAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Export options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* JSON */}
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                <FileJson size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Export JSON</p>
                <p className="text-xs text-slate-500">Format réimportable complet</p>
              </div>
            </div>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>✓ Toutes les données préservées</li>
              <li>✓ Réimportable dans l'application</li>
              <li>✓ Version incluse: v{ruleSet.version}</li>
              <li>✓ Horodatage automatique</li>
            </ul>
            <Button
              variant="primary"
              icon={jsonSuccess ? <CheckCircle size={16} /> : <Download size={16} />}
              onClick={handleExportJSON}
              className={jsonSuccess ? 'bg-emerald-600 border-emerald-500 hover:bg-emerald-500' : ''}
            >
              {jsonSuccess ? 'Téléchargé !' : 'Exporter en JSON'}
            </Button>
          </div>

          {/* PDF */}
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center">
                <FileText size={22} className="text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Export PDF</p>
                <p className="text-xs text-slate-500">Document lisible et imprimable</p>
              </div>
            </div>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>✓ Statistiques, Races, Classes</li>
              <li>✓ Personnages, Objets, Compétences</li>
              <li>✓ Système de résolution</li>
              <li>✓ Fiche de personnage vierge</li>
            </ul>
            <Button
              variant="secondary"
              loading={pdfLoading}
              icon={pdfSuccess ? <CheckCircle size={16} /> : <FileText size={16} />}
              onClick={handleExportPDF}
              className={pdfSuccess ? 'bg-emerald-600/20 border-emerald-600/30 text-emerald-300' : ''}
            >
              {pdfLoading ? 'Génération…' : pdfSuccess ? 'Téléchargé !' : 'Exporter en PDF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
