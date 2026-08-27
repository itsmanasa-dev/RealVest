import React, { useState, useEffect } from 'react';
import type { NavTab, Property } from '../../types';
import {
  BookmarkCheck,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  TrendingUp,
  Scale,
  Sparkles,
  Trophy,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs } from '../../utils/currency';
import {
  comparisonApi,
  SavedComparisonSummary,
  SavedComparisonDetail,
} from '../../services/api/comparisonApi';

interface SavedComparisonsViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectProperty: (property: Property) => void;
}

export const SavedComparisonsView: React.FC<SavedComparisonsViewProps> = ({
  onNavigate,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  const [comparisons, setComparisons] = useState<SavedComparisonSummary[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<SavedComparisonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSaved = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const list = await comparisonApi.listSavedComparisons();
      setComparisons(list || []);
    } catch (err: any) {
      console.warn('Could not fetch saved comparisons from backend:', err.message);
      setErrorMsg('RealVest backend is connecting. Retrying database fetch...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleOpenDetail = async (id: string) => {
    try {
      const detail = await comparisonApi.getSavedComparison(id);
      setSelectedDetail(detail);
    } catch (err: any) {
      setErrorMsg(`Could not load comparison detail: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this saved comparison?')) return;
    setIsDeleting(id);
    try {
      await comparisonApi.deleteSavedComparison(id);
      setComparisons((prev) => prev.filter((c) => c.id !== id));
      if (selectedDetail?.id === id) {
        setSelectedDetail(null);
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
              MYSQL PERSISTENCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Saved Property Comparisons
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Persistent comparison scenarios saved to your RealVest MySQL database
          </p>
        </div>

        <button
          onClick={() => onNavigate('compare')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Comparison Scenario</span>
        </button>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected Detail Modal / Inspection Screen */}
      {selectedDetail ? (
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-white dark:bg-[#111827] shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
            <button
              onClick={() => setSelectedDetail(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Saved Comparisons List
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('compare')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#273449] text-xs font-bold hover:border-emerald-500 transition-colors cursor-pointer"
              >
                Run New Scenario
              </button>
              <button
                onClick={() => handleDelete(selectedDetail.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Saved Comparison Scenario
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              {selectedDetail.title}
            </h2>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {new Date(selectedDetail.created_at).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {selectedDetail.criteria?.locality || 'Bengaluru'}
              </span>
            </div>
          </div>

          {/* Top Pick Highlight */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#172033] border border-emerald-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Trophy size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">
                Top Pick Outcome
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {selectedDetail.top_pick}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {selectedDetail.recommendation}
              </p>
            </div>
          </div>

          {/* Reasoning Bullets */}
          {selectedDetail.reasoning && selectedDetail.reasoning.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Decision Reasoning:
              </span>
              <div className="space-y-1.5">
                {selectedDetail.reasoning.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Saved Comparisons Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-xs font-mono text-slate-400">
              Loading saved comparisons from MySQL...
            </div>
          ) : comparisons.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] space-y-3">
              <BookmarkCheck size={32} className="mx-auto text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No Saved Comparisons Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Compare properties in the Compare tab and click "Save Comparison" to persist your scenarios in MySQL.
              </p>
              <button
                onClick={() => onNavigate('compare')}
                className="mt-2 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Create Your First Comparison →
              </button>
            </div>
          ) : (
            comparisons.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                      {c.properties_count} Properties Compared
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {c.title}
                  </h3>

                  <div className="space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-emerald-500" />
                      <span>{c.location}</span>
                    </div>
                    <div>Budget: <b className="text-slate-800 dark:text-slate-200">{c.budget_range}</b></div>
                    <div>Goal: <b className="text-slate-800 dark:text-slate-200">{c.goal}</b></div>
                    <div>Top Pick: <b className="text-emerald-600 dark:text-emerald-400">{c.top_pick}</b></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#273449]">
                  <button
                    onClick={() => handleOpenDetail(c.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} /> View
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={isDeleting === c.id}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Comparison"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
