'use client';

import type { FleetMetric } from '@/core/types';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

interface VehicleMetricsChartProps {
  metrics: FleetMetric[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export function VehicleMetricsChart({ metrics }: VehicleMetricsChartProps) {
  const labels = metrics.map((_, index) => `P${index + 1}`);

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Speed',
        data: metrics.map((metric) => metric.speed),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
      },
      {
        label: 'Fuel',
        data: metrics.map((metric) => metric.fuelLevel),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.16)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          color: '#475569',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (items) => `Reading ${items[0]?.label ?? ''}`,
          label: (context) => {
            const suffix = context.dataset.label === 'Speed' ? 'km/h' : '%';
            return `${context.dataset.label}: ${context.formattedValue} ${suffix}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="h-52 rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
