import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import type { ComparisonData } from "core/domain/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonChartProps {
  data: ComparisonData;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Listen to theme changes dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Dynamic color palette based on theme
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const subTextColor = isDark ? "#94a3b8" : "#475569";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
  const bgSurface = isDark ? "rgba(27,31,39,0.85)" : "rgba(255,255,255,0.9)";

  const chartData: ChartData<"bar"> = {
    labels: data.comparisons.map((c) => c.routeId),
    datasets: [
      {
        label: "Comparison GHG Intensity",
        data: data.comparisons.map((c) => Number(c.ghgIntensity)),
        backgroundColor: isDark ? "rgba(96,165,250,0.8)" : "rgba(37,99,235,0.8)", // Blue
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Baseline GHG Intensity",
        data: Array(data.comparisons.length).fill(Number(data.baseline.ghgIntensity)),
        backgroundColor: isDark ? "rgba(52,211,153,0.8)" : "rgba(16,185,129,0.8)", // Green
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Target GHG Intensity",
        data: Array(data.comparisons.length).fill(data.target),
        backgroundColor: isDark ? "rgba(248,113,113,0.8)" : "rgba(239,68,68,0.8)", // Red
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: subTextColor,
          font: { size: 13, family: "Inter, sans-serif", weight: 500 },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "GHG Intensity Comparison",
        color: textColor,
        font: { size: 16, weight: 600, family: "Inter, sans-serif" },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: bgSurface,
        titleColor: textColor,
        bodyColor: subTextColor,
        borderColor: isDark ? "rgba(96,165,250,0.5)" : "rgba(37,99,235,0.4)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: subTextColor,
          font: { family: "Inter, sans-serif" },
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: subTextColor,
          font: { family: "Inter, sans-serif" },
        },
        grid: {
          color: gridColor,
        },
        title: {
          display: true,
          text: "GHG Intensity (gCO₂e/MJ)",
          color: subTextColor,
          font: { family: "Inter, sans-serif", size: 13 },
        },
      },
    },
  };

  return (
    <div
      className="w-full h-[400px] sm:h-[450px] bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] 
                 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] p-4 sm:p-6 animate-fadeIn transition-all duration-500"
    >
      <Bar options={options} data={chartData} />
    </div>
  );
};