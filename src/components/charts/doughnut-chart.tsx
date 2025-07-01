'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  title?: string;
  height?: number;
  options?: Partial<ChartOptions<'doughnut'>>;
}

export function DoughnutChart({ data, title, height = 300, options = {} }: DoughnutChartProps) {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '70%',
    ...options,
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update('active');
    }
  }, [data]);

  return (
    <div style={{ height }}>
      <Doughnut ref={chartRef} data={data} options={defaultOptions} />
    </div>
  );
}
