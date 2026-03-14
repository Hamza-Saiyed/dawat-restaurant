'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendData {
  date: string;
  count: number;
}

interface DayData {
  day: string;
  count: number;
}

interface ReservationChartProps {
  trendData: TrendData[];
  dayData: DayData[];
}

export default function ReservationChart({ trendData, dayData }: ReservationChartProps) {
  
  // Chart.js dark theme options configuration
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#161B22',
        titleColor: '#E6EDF3',
        bodyColor: '#8B949E',
        borderColor: '#30363D',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return ` ${context.parsed.y} Bookings`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#8B949E',
          font: { family: 'Inter', size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#8B949E',
          font: { family: 'Inter', size: 11 },
          stepSize: 1,
          beginAtZero: true
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const lineChartData = {
    labels: trendData.map(d => {
      // Format as DD MMM
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Reservations',
        data: trendData.map(d => d.count),
        borderColor: '#C9A84C',
        backgroundColor: 'rgba(201, 168, 76, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#161B22',
        pointBorderColor: '#C9A84C',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4, // Smooth curves
      },
    ],
  };

  const barChartData = {
    labels: dayData.map(d => d.day),
    datasets: [
      {
        label: 'Average Bookings',
        data: dayData.map(d => d.count),
        backgroundColor: dayData.map((_, i) => 
          i === 5 || i === 6 ? '#C9A84C' : 'rgba(201, 168, 76, 0.4)' // Highlight weekends
        ),
        borderRadius: 4,
        barThickness: 'flex' as const,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 30 Day Trend Line Chart - takes up 2 columns on large screens */}
      <div className="lg:col-span-2 bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl p-5">
        <div className="mb-4">
          <h3 className="text-[#E6EDF3] font-medium">Reservation Trends</h3>
          <p className="text-[#8B949E] text-xs mt-1">Bookings over the last 30 days</p>
        </div>
        <div className="h-[280px] w-full">
          {trendData.length > 0 ? (
            <Line options={commonOptions} data={lineChartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-[#8B949E] text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Day of Week Bar Chart - takes up 1 column on large screens */}
      <div className="lg:col-span-1 bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl p-5">
        <div className="mb-4">
          <h3 className="text-[#E6EDF3] font-medium">Busiest Days</h3>
          <p className="text-[#8B949E] text-xs mt-1">Total bookings by day of week</p>
        </div>
        <div className="h-[280px] w-full">
          {dayData.length > 0 ? (
            <Bar options={{
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                x: {
                  ...commonOptions.scales.x,
                  grid: { display: false }
                }
              }
            }} data={barChartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-[#8B949E] text-sm">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
