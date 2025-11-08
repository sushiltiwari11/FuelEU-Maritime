import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "infrastructure/api/ApiContext";
import type { Route } from "core/domain/types";
import { LoadingSpinner } from "adapters/ui/components/LoadingSpinner";
import { ErrorMessage } from "adapters/ui/components/ErrorMessage";

export const RoutesTab: React.FC = () => {
  const api = useApi();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [vesselTypeFilter, setVesselTypeFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSetBaseline = async (id: string) => {
    try {
      setError(null);
      await api.setBaseline(id);
      fetchRoutes();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(
      (route) =>
        (vesselTypeFilter === "" || route.vesselType === vesselTypeFilter) &&
        (fuelTypeFilter === "" || route.fuelType === fuelTypeFilter) &&
        (yearFilter === "" || route.year.toString() === yearFilter)
    );
  }, [routes, vesselTypeFilter, fuelTypeFilter, yearFilter]);

  // Get unique values for filters
  const uniqueVesselTypes = useMemo(
    () => [...new Set(routes.map((r) => r.vesselType))],
    [routes]
  );
  const uniqueFuelTypes = useMemo(
    () => [...new Set(routes.map((r) => r.fuelType))],
    [routes]
  );
  const uniqueYears = useMemo(
    () => [...new Set(routes.map((r) => r.year.toString()))],
    [routes]
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10 animate-fadeIn transition-all duration-500">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
          All Routes
        </h2>
        <button
          onClick={fetchRoutes}
          className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:shadow-[var(--shadow-glow)] hover:text-[var(--color-primary)] transition-all duration-300"
        >
          Refresh
        </button>
      </div>

      <ErrorMessage message={error} />

      {/* ===== Filters ===== */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
        <div>
          <label
            htmlFor="vesselType"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Vessel Type
          </label>
          <select
            id="vesselType"
            value={vesselTypeFilter}
            onChange={(e) => setVesselTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          >
            <option value="">All</option>
            {uniqueVesselTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fuelType"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Fuel Type
          </label>
          <select
            id="fuelType"
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          >
            <option value="">All</option>
            {uniqueFuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Year
          </label>
          <select
            id="year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          >
            <option value="">All</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Routes Table ===== */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-surface)]/80 backdrop-blur-md">
            <tr>
              {[
                "Route ID",
                "Vessel",
                "Fuel",
                "Year",
                "GHG Intensity",
                "Baseline",
                "Actions",
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
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <tr
                  key={route.id}
                  className="hover:bg-[var(--color-bg)]/60 transition-all duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                    {route.routeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-subtext)]">
                    {route.vesselType}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-subtext)]">
                    {route.fuelType}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-subtext)]">
                    {route.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-subtext)]">
                    {Number(route.ghgIntensity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {route.isBaseline ? (
                      <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-[var(--color-border)]/40 text-[var(--color-subtext)]">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.id)}
                        className="text-[var(--color-primary)] hover:underline hover:brightness-110 transition-all"
                      >
                        Set as Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-[var(--color-subtext)] text-sm"
                >
                  No routes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};