import React, { useState } from "react";
import { useApi } from "infrastructure/api/ApiContext";
import type { BankEntry } from "core/domain/types";
import { LoadingSpinner } from "adapters/ui/components/LoadingSpinner";
import { ErrorMessage } from "adapters/ui/components/ErrorMessage";
import { Modal } from "adapters/ui/components/Modal";

export const BankingTab: React.FC = () => {
  const api = useApi();
  const [shipId, setShipId] = useState("SHIP01");
  const [year, setYear] = useState(2025);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cb, setCb] = useState<number | null>(null);
  const [bankedRecords, setBankedRecords] = useState<BankEntry[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyAmount, setApplyAmount] = useState("");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleFetchData = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      const cbRes = await api.getCB(shipId, year);
      setCb(cbRes.complianceBalance);
      const records = await api.getBankRecords(shipId);
      setBankedRecords(records);
    } catch (err) {
      setError((err as Error).message);
      setCb(null);
      setBankedRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSurplus = async () => {
    clearMessages();
    if (!cb || cb <= 0) {
      setError("No surplus to bank.");
      return;
    }
    try {
      await api.bankSurplus(shipId, year);
      setSuccess(`Successfully banked ${Number(cb).toFixed(2)} units for ${shipId} (${year}).`);
      handleFetchData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleApplySurplus = async () => {
    clearMessages();
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount to apply.");
      return;
    }
    try {
      await api.applySurplus(shipId, year, amount);
      setSuccess(`Successfully applied ${amount} units to ${shipId} for ${year}.`);
      setIsApplyModalOpen(false);
      setApplyAmount("");
      handleFetchData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const totalBanked = bankedRecords.reduce((sum, r) => sum + Number(r.amountGco2eq), 0);

  return (
    <div className="space-y-8 animate-fadeIn transition-all duration-500">
      {/* ===== Page Header ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
          Banking
        </h2>

        {success && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] px-4 py-2 text-sm text-[var(--color-accent)] font-medium animate-fadeIn">
            {success}
          </div>
        )}
      </div>

      {/* ===== Error Message ===== */}
      <ErrorMessage message={error} />

      {/* ===== Filters / Inputs ===== */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-5 flex flex-col sm:flex-row gap-4 sm:items-end transition-all duration-300">
        <div className="flex-1">
          <label htmlFor="shipId" className="block text-sm font-medium text-[var(--color-subtext)] mb-1">
            Ship ID
          </label>
          <input
            id="shipId"
            type="text"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-medium text-[var(--color-subtext)] mb-1">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          />
        </div>
        <button
          onClick={handleFetchData}
          className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
        >
          Fetch Data
        </button>
      </div>

      {/* ===== Loading Spinner ===== */}
      {isLoading && <LoadingSpinner />}

      {/* ===== KPI Cards ===== */}
      {cb !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] text-center p-5 transition hover:shadow-[var(--shadow-glow)]">
            <h4 className="text-sm font-medium text-[var(--color-subtext)] uppercase tracking-wide">
              Compliance Balance ({year})
            </h4>
            <p
              className={`mt-2 text-3xl font-bold ${
                cb > 0 ? "text-[var(--color-accent)]" : "text-red-500"
              }`}
            >
              {Number(cb).toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] text-center p-5 transition hover:shadow-[var(--shadow-glow)]">
            <h4 className="text-sm font-medium text-[var(--color-subtext)] uppercase tracking-wide">
              Total Available in Bank
            </h4>
            <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
              {Number(totalBanked).toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] flex flex-col gap-3 justify-center p-5">
            <button
              onClick={handleBankSurplus}
              disabled={!cb || cb <= 0}
              className="w-full rounded-lg py-2.5 bg-[var(--color-accent)] text-white font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-50"
            >
              Bank Surplus
            </button>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              disabled={!cb || cb >= 0}
              className="w-full rounded-lg py-2.5 bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition disabled:opacity-50"
            >
              Apply Surplus
            </button>
          </div>
        </div>
      )}

      {/* ===== Bank Records ===== */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-5 transition hover:shadow-[var(--shadow-glow)]">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
          Available Banked Surplus for {shipId}
        </h3>

        {bankedRecords.length > 0 ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {bankedRecords.map((record) => (
              <li
                key={record.id}
                className="py-3 flex justify-between items-center hover:bg-[var(--color-bg)]/60 rounded-lg px-2 transition-all duration-200"
              >
                <span className="text-sm text-[var(--color-subtext)]">
                  From Year:{" "}
                  <span className="font-medium text-[var(--color-text)]">
                    {record.year}
                  </span>
                </span>
                <span className="text-sm font-semibold text-[var(--color-accent)]">
                  {Number(record.amountGco2eq).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-subtext)]">No banked records found.</p>
        )}
      </div>

      {/* ===== Apply Surplus Modal ===== */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply Banked Surplus"
      >
        <div className="space-y-4">
          <ErrorMessage message={error} />

          <p className="text-sm text-[var(--color-subtext)]">
            Applying surplus for{" "}
            <span className="font-semibold text-[var(--color-text)]">{shipId}</span> (
            {year}).
          </p>

          <p className="text-sm text-[var(--color-subtext)]">
            Deficit:{" "}
            <span className="font-semibold text-red-500">
              {Number(cb)?.toFixed(2)}
            </span>
          </p>

          <p className="text-sm text-[var(--color-subtext)]">
            Max Available:{" "}
            <span className="font-semibold text-[var(--color-accent)]">
              {Number(totalBanked).toFixed(2)}
            </span>
          </p>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
            >
              Amount to Apply
            </label>
            <input
              id="amount"
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>

          <button
            onClick={handleApplySurplus}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            Apply Surplus
          </button>
        </div>
      </Modal>
    </div>
  );
};