import React, { useState, useMemo } from "react";
import { useApi } from "infrastructure/api/ApiContext";
import type { PoolMember } from "core/domain/types";
import { LoadingSpinner } from "adapters/ui/components/LoadingSpinner";
import { ErrorMessage } from "adapters/ui/components/ErrorMessage";

type MemberInput = {
  shipId: string;
  cb_before: number;
};

export const PoolingTab: React.FC = () => {
  const api = useApi();
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<MemberInput[]>([]);
  const [poolResult, setPoolResult] = useState<PoolMember[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newShipId, setNewShipId] = useState("");

  const totalPoolCB = useMemo(
    () => members.reduce((sum, m) => sum + m.cb_before, 0),
    [members]
  );

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipId) return setError("Please enter a valid Ship ID.");
    if (members.find((m) => m.shipId === newShipId))
      return setError("This ship is already in the pool.");

    setError(null);
    setIsAdding(true);
    setPoolResult(null);

    try {
      const res = await api.getAdjustedCB(newShipId, year);
      const cb = res.adjustedComplianceBalance;
      setMembers([...members, { shipId: newShipId, cb_before: cb }]);
      setNewShipId("");
    } catch (err) {
      setError(`Failed to fetch CB for ${newShipId}: ${(err as Error).message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = (shipId: string) => {
    setMembers(members.filter((m) => m.shipId !== shipId));
    setPoolResult(null);
  };

  const handleCreatePool = async () => {
    setError(null);
    setIsLoading(true);
    setPoolResult(null);
    try {
      const result = await api.createPool(year, members);
      setPoolResult(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPool = totalPoolCB >= 0;

  return (
    <div className="space-y-10 animate-fadeIn transition-all duration-500">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
          Pooling
        </h2>
      </div>

      <ErrorMessage message={error} />

      {/* ===== Add Member Form ===== */}
      <form
        onSubmit={handleAddMember}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
      >
        <div>
          <label
            htmlFor="poolYear"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Pool Year
          </label>
          <input
            id="poolYear"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="newShipId"
            className="block text-sm font-medium text-[var(--color-subtext)] mb-1"
          >
            Ship ID
          </label>
          <input
            id="newShipId"
            type="text"
            value={newShipId}
            onChange={(e) => setNewShipId(e.target.value)}
            placeholder="e.g., SHIP01"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 disabled:opacity-50"
        >
          {isAdding ? "Fetching CB..." : "Add Member"}
        </button>
      </form>

      {/* ===== Pool Summary ===== */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Pool Members ({members.length})
          </h3>
          <div className="px-4 py-2 rounded-lg bg-[var(--color-bg)] flex items-center gap-2 border border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-subtext)]">Total CB:</span>
            <span
              className={`text-xl font-semibold ${
                isValidPool ? "text-[var(--color-accent)]" : "text-red-500"
              }`}
            >
              {Number(totalPoolCB).toFixed(2)}
            </span>
          </div>
        </div>

        {members.length > 0 ? (
          <ul className="divide-y divide-[var(--color-border)] mb-6">
            {members.map((member) => (
              <li
                key={member.shipId}
                className="py-3 flex justify-between items-center hover:bg-[var(--color-bg)]/50 rounded-lg px-2 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {member.shipId}
                  </p>
                  <p
                    className={`text-sm ${
                      member.cb_before > 0
                        ? "text-[var(--color-accent)]"
                        : "text-red-500"
                    }`}
                  >
                    {Number(member.cb_before).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.shipId)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-all duration-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-subtext)]">
            No members added yet. Add at least one to create a pool.
          </p>
        )}

        <button
          onClick={handleCreatePool}
          disabled={!isValidPool || members.length === 0 || isLoading}
          className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:shadow-[var(--shadow-glow)] transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Creating Pool..." : "Create Pool"}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}

      {/* ===== Pool Results ===== */}
      {poolResult && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
          <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-4">
            Pool Created Successfully!
          </h3>
          <table className="min-w-full divide-y divide-[var(--color-border)]">
            <thead className="bg-[var(--color-surface)]/80 backdrop-blur-md">
              <tr>
                {["Ship ID", "CB Before", "CB After"].map((header) => (
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
              {poolResult.map((res) => (
                <tr
                  key={res.shipId}
                  className="hover:bg-[var(--color-bg)]/50 transition-all duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                    {res.shipId}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      res.cb_before > 0
                        ? "text-[var(--color-accent)]"
                        : "text-red-500"
                    }`}
                  >
                    {Number(res.cb_before).toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      res.cb_after > 0
                        ? "text-[var(--color-accent)]"
                        : "text-red-500"
                    }`}
                  >
                    {Number(res.cb_after).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};