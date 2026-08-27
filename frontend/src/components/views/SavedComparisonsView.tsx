import React, { useState, useEffect } from 'react';
import type { NavTab, Property } from '../../types';
import {
  BookmarkCheck,
  Trash2,
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  AlertCircle,
  Plus,
  Scale,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import {
  comparisonApi,
  SavedComparisonSummary,
  SavedComparisonDetail,
} from '../../services/api/comparisonApi';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Badge, recommendationTone } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

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
      setErrorMsg("Couldn't load your saved comparisons. Please try again.");
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
      setErrorMsg("Couldn't open this comparison. Please try again.");
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
      setErrorMsg("Couldn't delete this comparison. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <SectionHeader
        eyebrow="Workspace"
        title="Saved comparisons"
        subtitle="Your saved investment scenarios"
        action={
          <Button onClick={() => onNavigate('analysis')}>
            <Plus size={15} /> New Comparison
          </Button>
        }
      />


      {errorMsg && (
        <div className="p-4 rounded-lg bg-warn-soft text-warn text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {selectedDetail ? (
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <button onClick={() => setSelectedDetail(null)} className="btn btn-ghost -ml-2 cursor-pointer">
              <ArrowLeft size={15} /> Back to list
            </button>
            <button
              onClick={() => handleDelete(selectedDetail.id)}
              className="btn btn-ghost text-neg hover:!text-neg hover:!bg-neg-soft cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>

          <div className="mt-4">
            <p className="section-eyebrow mb-1">Saved comparison</p>
            <h2 className="text-lg font-semibold text-ink">{selectedDetail.title}</h2>
            <div className="flex items-center gap-3 text-xs text-ink-3 mt-1.5">
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(selectedDetail.created_at).toLocaleDateString()}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {selectedDetail.criteria?.locality || 'Bengaluru'}</span>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-brand-soft/50 border border-line flex items-start gap-3">
            <span className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center shrink-0"><Trophy size={17} /></span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Top pick outcome</p>
              <h4 className="text-sm font-semibold text-ink mt-0.5">{selectedDetail.top_pick}</h4>
              <Badge tone={recommendationTone(selectedDetail.recommendation)} className="mt-1.5">{selectedDetail.recommendation}</Badge>
            </div>
          </div>

          {selectedDetail.reasoning && selectedDetail.reasoning.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Decision reasoning</p>
              {selectedDetail.reasoning.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-ink-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rv-card p-5 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : comparisons.length === 0 ? (
        <div className="rv-card p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center">
            <BookmarkCheck size={22} className="text-ink-3" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink">No saved comparisons yet</h3>
          <p className="mt-1 text-sm text-ink-3 max-w-sm mx-auto">
            Compare properties in the Analysis workspace and click "Save Comparison" to keep your scenarios here.
          </p>
          <Button className="mt-5" onClick={() => onNavigate('analysis')}>
            <Scale size={15} /> Compare properties
          </Button>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.map((c) => (
            <Card key={c.id} hover className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Badge tone="brand">{c.properties_count} properties</Badge>
                <span className="text-xs text-ink-3">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>

              <h3 className="text-sm font-semibold text-ink leading-snug">{c.title}</h3>

              <div className="mt-3 space-y-1 text-xs text-ink-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-ink-3" /> {c.location}
                </div>
                <div>Budget: <span className="font-medium text-ink">{c.budget_range}</span></div>
                <div>Goal: <span className="font-medium text-ink">{c.goal}</span></div>
                <div>Top pick: <span className="font-medium text-pos">{c.top_pick}</span></div>
              </div>

              <div className="flex items-center gap-2 pt-3 mt-3 border-t border-line">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleOpenDetail(c.id)}>
                  View
                </Button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={isDeleting === c.id}
                  className="w-8 h-8 rounded-md border border-line text-ink-3 hover:text-neg hover:border-neg flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Delete comparison"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
