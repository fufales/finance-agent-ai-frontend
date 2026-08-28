import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { defineChart } from '@tanstack/charts';
import { pie, polar, radialArc, radialText } from '@tanstack/charts/polar';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { Chart } from '@tanstack/charts/react';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORY_COLORS = {
  'Extra Expenses': '#f59e0b',
  'Life Style': '#ec4899',
  'Debts': '#ef4444',
  'Subscriptions': '#8b5cf6',
  'Food': '#10b981',
  'Credit cards': '#3b82f6',
  'Home Expenses': '#f97316',
  'Health': '#06b6d4',
  'Car': '#6366f1',
};

const FALLBACK_COLOR = '#94a3b8';

const formatColones = (value) => `₡${Math.round(value).toLocaleString('es-CR')}`;

const ChartsPage = ({ expenses, onBack }) => {
  const { t } = useLanguage();
  const [hiddenCategories, setHiddenCategories] = useState(() => new Set());

  // Aggregate expenses by category (monthly totals)
  const series = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      if (!map[cat]) map[cat] = { category: cat, total: 0 };
      map[cat].total += e.amount;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [expenses]);

  const visibleSeries = series.filter(s => !hiddenCategories.has(s.category));

  const definition = useMemo(() => {
    const slices = pie(visibleSeries, { value: 'total' });
    // Only label slices big enough to fit text (>= 4% of total)
    const labels = slices.filter(s => s.fraction >= 0.04);
    return defineChart({
      marks: [
        polar({
          inset: 8,
          radiusRatio: 0.82,
          marks: [
            radialArc(slices, {
              innerRadius: ({ radius }) => radius * 0.58,
              cornerRadius: 4,
              color: 'category',
              key: 'category',
            }),
            radialText(labels, {
              angle: 'angle',
              radius: ({ radius }) => radius * 0.79,
              text: (d) => `${Math.round(d.fraction * 100)}%`,
              fill: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              anchor: 'middle',
              baseline: 'middle',
              key: (d) => `label-${d.category}`,
            }),
          ],
          scales: {
            angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
            radius: { scale: scaleLinear().domain([0, 1]) },
          },
        }),
      ],
      scales: {
        x: null,
        y: null,
      },
      color: {
        domain: visibleSeries.map(s => s.category),
        range: visibleSeries.map(s => CATEGORY_COLORS[s.category] || FALLBACK_COLOR),
      },
      tooltip: {
        use: tooltip,
        format: (point) => `${point.groupLabel}: ${formatColones(point.datum.total)}`,
      },
    }, { svgAnimation: { duration: 300 } });
  }, [visibleSeries]);

  const toggleCategory = (category) => {
    setHiddenCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('spendingByCategory')}</h2>
      </div>

      {series.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('noChartData')}</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Chart
              definition={definition}
              height={280}
              initialWidth={360}
              ariaLabel={t('spendingByCategory')}
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 px-1">{t('tapToToggle')}</p>

          <div className="flex flex-wrap gap-2">
            {series.map(s => {
              const hidden = hiddenCategories.has(s.category);
              const color = CATEGORY_COLORS[s.category] || FALLBACK_COLOR;
              return (
                <button
                  key={s.category}
                  onClick={() => toggleCategory(s.category)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                    hidden
                      ? 'opacity-40 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800'
                      : 'border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {t(`cat_${s.category}`)}
                  <span className="text-gray-500 dark:text-gray-400 font-normal">{formatColones(s.total)}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartsPage;
