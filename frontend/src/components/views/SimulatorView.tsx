import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Lightbulb,
  Wallet,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs } from '../../utils/currency';
import { simulatorService } from '../../services/simulatorService';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge, recommendationTone } from '../ui/Badge';
import { Stat } from '../ui/Stat';
import { clsx } from 'clsx';

interface SimulatorViewProps {
  onBack?: () => void;
}

function SliderField({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-ink-2">{label}</span>
        <span className="font-semibold text-ink">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--range' as string]: `${pct}%` }}
        aria-label={label}
      />
    </div>
  );
}

export const SimulatorView: React.FC<SimulatorViewProps> = () => {
  const { t } = useTranslation();

  const [purchasePriceLakhs, setPurchasePriceLakhs] = useState<number>(75);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [targetYield, setTargetYield] = useState<number>(5.5);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const purchaseInr = purchasePriceLakhs * 100000;
  const downPaymentInr = purchaseInr * (downPaymentPct / 100);
  const loanAmountInr = purchaseInr - downPaymentInr;
  const estStampDutyRegInr = purchaseInr * 0.066;
  const totalUpfrontNeededInr = downPaymentInr + estStampDutyRegInr;
  const monthlyRent = Math.round((purchaseInr * (targetYield / 100)) / 12);

  const result = simulatorService.calculateScenario({
    purchasePriceLakhs,
    downPaymentPct,
    interestRate,
    monthlyRent,
    holdingPeriod,
  });

  const flipResult = simulatorService.calculateDecisionFlip(
    purchasePriceLakhs,
    purchasePriceLakhs * 0.95,
    monthlyRent,
    interestRate
  );

  const handlePreset = (price: number, down: number, rate: number, yieldPct: number) => {
    setPurchasePriceLakhs(price);
    setDownPaymentPct(down);
    setInterestRate(rate);
    setTargetYield(yieldPct);
  };

  const handleReset = () => {
    setPurchasePriceLakhs(75);
    setDownPaymentPct(20);
    setInterestRate(8.5);
    setTargetYield(5.5);
    setHoldingPeriod(5);
  };

  const handleSave = () => {
    setSaveToast(`Scenario saved: ₹${purchasePriceLakhs}L property @ ${interestRate}% loan interest.`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const presets = [
    { label: '₹45L Starter', price: 45, down: 20, rate: 8.5, y: 6.0 },
    { label: '₹75L Standard', price: 75, down: 20, rate: 8.5, y: 5.5 },
    { label: '₹1.3Cr Premium', price: 130, down: 25, rate: 8.5, y: 5.0 },
    { label: '₹2.5Cr Luxury', price: 250, down: 30, rate: 8.5, y: 4.5 },
  ];

  const growthPoints = [
    { label: 'Now', value: purchasePriceLakhs, highlight: false },
    { label: '1 yr', value: result.projected2025ValLakhs, highlight: false },
    { label: '2 yr', value: result.projected2026ValLakhs, highlight: false },
    { label: `${holdingPeriod} yr`, value: result.projectedFutureValLakhs, highlight: true },
  ];
  const maxVal = Math.max(...growthPoints.map((p) => p.value));

  return (
    <div className="space-y-6 pb-4">
      <SectionHeader
        eyebrow="Simulator"
        title="Investment & cash flow simulator"
        subtitle="Adjust the sliders to project EMI, rental income, upfront costs and returns."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleReset}><RotateCcw size={15} /> Reset</Button>
            <Button onClick={handleSave}>Save Scenario</Button>
          </div>
        }
      />

      {saveToast && (
        <div className="p-3 rounded-lg bg-pos-soft text-pos text-sm flex items-center gap-2 rv-fade-in">
          <CheckCircle2 size={16} className="shrink-0" /> {saveToast}
        </div>
      )}

      {/* Presets */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 shrink-0">Presets</span>
        {presets.map((p) => {
          const active = purchasePriceLakhs === p.price;
          return (
            <button
              key={p.label}
              onClick={() => handlePreset(p.price, p.down, p.rate, p.y)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap cursor-pointer transition-colors',
                active ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-2 hover:border-line-strong'
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-line">
              <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Sliders size={16} /></span>
              <div>
                <h3 className="text-sm font-semibold text-ink">Your assumptions</h3>
                <p className="text-xs text-ink-3">Live-calculated</p>
              </div>
            </div>

            <SliderField
              label="Property price"
              valueLabel={<span className="text-pos">{formatInrLakhs(purchasePriceLakhs)}</span>}
              min={20} max={300} step={2.5} value={purchasePriceLakhs}
              onChange={setPurchasePriceLakhs}
            />

            <SliderField
              label={`Down payment (${downPaymentPct}%)`}
              valueLabel={`₹${(downPaymentInr / 100000).toFixed(1)}L`}
              min={10} max={50} step={5} value={downPaymentPct}
              onChange={setDownPaymentPct}
            />

            <div className="text-[11px] text-ink-3 -mt-2">
              Loan principal: <span className="font-semibold text-ink">₹{(loanAmountInr / 100000).toFixed(1)}L</span> ({(100 - downPaymentPct)}%)
            </div>

            <SliderField
              label="Loan interest (20 yr)"
              valueLabel={`${interestRate}% p.a.`}
              min={7} max={12} step={0.25} value={interestRate}
              onChange={setInterestRate}
            />

            <SliderField
              label="Rental yield"
              valueLabel={<span className="text-pos">{targetYield}% (₹{monthlyRent.toLocaleString('en-IN')}/mo)</span>}
              min={3} max={10} step={0.25} value={targetYield}
              onChange={setTargetYield}
            />

            <SliderField
              label="Holding period"
              valueLabel={`${holdingPeriod} yr`}
              min={1} max={10} step={1} value={holdingPeriod}
              onChange={setHoldingPeriod}
            />
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero verdict */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Projected outcome</p>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                  +₹{(result.totalProfitInr / 100000).toFixed(1)}L
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-pos font-medium">
                  <TrendingUp size={14} /> +{result.totalRoiPct}% total ROI · {result.annualizedRoiPct}% / yr
                </div>
              </div>
              <div className="shrink-0">
                <Badge tone={recommendationTone(result.decision)} className="text-xs px-3 py-1">
                  {result.decision === 'BUY' ? 'Recommended: Buy' : result.decision === 'HOLD' ? 'Moderate: Hold' : 'Avoid / Re-evaluate'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div>
                <p className="text-[11px] text-ink-3 uppercase tracking-wide">Monthly EMI</p>
                <p className="text-lg font-semibold text-ink mt-0.5">₹{result.monthlyEmi.toLocaleString('en-IN')}/mo</p>
                <p className="text-xs text-ink-3">20-yr loan</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-3 uppercase tracking-wide">Rent inflow</p>
                <p className="text-lg font-semibold text-pos mt-0.5">+₹{monthlyRent.toLocaleString('en-IN')}/mo</p>
                <p className="text-xs text-ink-3">{targetYield}% gross yield</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-3 uppercase tracking-wide">Net cash flow</p>
                <p className={clsx('text-lg font-semibold mt-0.5', result.netMonthlyCashFlow >= 0 ? 'text-pos' : 'text-warn')}>
                  {result.netMonthlyCashFlow >= 0 ? '+' : ''}₹{result.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
                </p>
                <p className="text-xs text-ink-3">{result.netMonthlyCashFlow >= 0 ? 'Surplus' : 'EMI gap'}</p>
              </div>
            </div>
          </Card>

          {/* Upfront cash */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Wallet size={16} /></span>
              <h3 className="text-sm font-semibold text-ink">Total upfront cash needed</h3>
              <span className="ml-auto text-lg font-semibold text-ink">₹{(totalUpfrontNeededInr / 100000).toFixed(1)}L</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-line p-3 flex items-center justify-between text-sm">
                <span className="text-ink-3">Down payment ({downPaymentPct}%)</span>
                <span className="font-semibold text-ink">₹{(downPaymentInr / 100000).toFixed(1)}L</span>
              </div>
              <div className="rounded-lg border border-line p-3 flex items-center justify-between text-sm">
                <span className="text-ink-3">Stamp duty & reg (6.6%)</span>
                <span className="font-semibold text-ink">₹{(estStampDutyRegInr / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </Card>

          {/* Growth chart */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Calendar size={16} /></span>
              <h3 className="text-sm font-semibold text-ink">Estimated property value growth</h3>
              <span className="ml-auto text-xs text-pos font-medium">~6.5% p.a.</span>
            </div>
            <div className="flex items-end justify-between gap-2 pt-6" style={{ height: 140 }}>
              {growthPoints.map((pt) => (
                <div key={pt.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className={clsx('text-xs font-semibold', pt.highlight ? 'text-pos' : 'text-ink')}>{formatInrLakhs(pt.value)}</span>
                  <div
                    className={clsx('w-full max-w-[70px] rounded-t-md transition-all', pt.highlight ? 'bg-pos' : 'bg-brand')}
                    style={{ height: `${(pt.value / maxVal) * 70}px` }}
                  />
                  <span className="text-[11px] text-ink-3">{pt.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Takeaways */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-warn-soft text-warn flex items-center justify-center"><Lightbulb size={16} /></span>
              <h3 className="text-sm font-semibold text-ink">Investor takeaways</h3>
            </div>
            <div className="space-y-2.5 text-sm text-ink-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-pos shrink-0 mt-0.5" />
                <span>Holding at least <span className="font-semibold text-ink">3.5 years</span> fully absorbs the ₹{(estStampDutyRegInr / 100000).toFixed(1)}L registration and loan interest.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Info size={16} className="text-brand shrink-0 mt-0.5" />
                <span>{flipResult.rentFlipText}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-warn shrink-0 mt-0.5" />
                <span>{flipResult.rateFlipText}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
