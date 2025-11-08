import React, { useState, useEffect } from "react";
import { useApi } from "infrastructure/api/ApiContext";
import type { ComparisonData } from "core/domain/types";
import { LoadingSpinner } from "adapters/ui/components/LoadingSpinner";
import { ErrorMessage } from "adapters/ui/components/ErrorMessage";
import { ComparisonChart } from "adapters/ui/components/ComparisonChart";

export const CompareTab: React.FC = () => {
  const api = useApi();
  const [data, setData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await api.getComparison(year);
        setData(result);
      } catch (err) {
        setError((err as Error).message);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparison();
  }, [api, year]);

  return (
    <div className="space-y-10 animate-fadeIn transition-all duration-500">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
          Compare Routes
        </h2>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Select Year
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* ===== Error / Loading ===== */}
      <ErrorMessage message={error} />
      {isLoading && <LoadingSpinner />}

      {/* ===== Main Content ===== */}
      {data && (
        <div className="space-y-10 animate-fadeIn">
          {/* --- Baseline Card --- */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Baseline Route
            </h3>
            <p className="mt-1 text-sm text-[var(--color-subtext)]">
              Using{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {data.baseline.routeId}
              </span>{" "}
              ({data.baseline.vesselType}) as baseline for {data.baseline.year}.
            </p>
            <p className="mt-4 text-3xl font-bold text-[var(--color-accent)]">
              {Number(data.baseline.ghgIntensity).toFixed(2)} gCO₂e/MJ
            </p>
          </div>

          {/* --- Comparison Table --- */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] overflow-hidden transition hover:shadow-[var(--shadow-glow)]">
            <table className="min-w-full divide-y divide-[var(--color-border)]">
              <thead className="bg-[var(--color-surface)]/80 backdrop-blur-md">
                <tr>
                  {[
                    "Route ID",
                    "GHG Intensity",
                    "% Diff from Baseline",
                    "Compliant (vs Target)",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-subtext)] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {data.comparisons.map((route) => (
                  <tr
                    key={route.id}
                    className="hover:bg-[var(--color-bg)]/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                      {route.routeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-subtext)]">
                      {Number(route.ghgIntensity).toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        route.percentDiff > 0
                          ? "text-red-500"
                          : "text-[var(--color-accent)]"
                      }`}
                    >
                      {Number(route.percentDiff.toFixed(2))}%
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {route.compliant ? (
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-red-500/15 text-red-500">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Chart Card --- */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 transition hover:shadow-[var(--shadow-glow)]">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              GHG Comparison Chart
            </h3>
            <ComparisonChart data={data} />
          </div>
        </div>
      )}
    </div>
  );
};