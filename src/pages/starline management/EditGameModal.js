import React, { useEffect } from "react";

/** Helpers */
const pad2 = (n) => String(n).padStart(2, "0");
const buildTime = (hh, mm, period) => {
  const h = Math.max(1, Math.min(12, Number(hh || 1)));
  const m = Math.max(0, Math.min(59, Number(mm || 0)));
  const p = String(period || "AM").toUpperCase() === "PM" ? "PM" : "AM";
  return `${pad2(h)}:${pad2(m)} ${p}`;
};
const parseTime = (t) => {
  if (typeof t !== "string") return { hour: 1, minute: 0, period: "AM" };
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])$/);
  if (!m) return { hour: 1, minute: 0, period: "AM" };
  const hour = Math.max(1, Math.min(12, Number(m[1])));
  const minute = Math.max(0, Math.min(59, Number(m[2])));
  const period = m[3].toUpperCase() === "PM" ? "PM" : "AM";
  return { hour, minute, period };
};
const WEEK_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const EditGameModal = ({ 
  editingGame, 
  setEditingGame, 
  handleUpdateGame, 
  closeEditPopup, 
  toggleDayStatus, 
  loadingAction 
}) => {
  // Initialize derived fields from strings when the editing object changes
  useEffect(() => {
    if (!editingGame) return;

    setEditingGame((prev) => {
      if (!prev) return prev;
      let next = { ...prev };

      // Ensure week_selection exists with 7 days
      if (!Array.isArray(next.week_selection) || next.week_selection.length === 0) {
        next.week_selection = WEEK_DAYS.map((d) => ({
          day: d,
          game_name: next.game_name || "",
          close_time: next.close_time || "",
          is_open: false,
        }));
      }

      // Top-level "Game Name" (as time)
      const needTopNameExplode = next.nameHour == null || next.nameMinute == null || next.namePeriod == null;
      if (needTopNameExplode) {
        const { hour, minute, period } = parseTime(next.game_name || "");
        next.nameHour = hour;
        next.nameMinute = minute;
        next.namePeriod = period;
        next.game_name = buildTime(hour, minute, period);
      }

      // Top-level close time
      const needTopCloseExplode = next.closeHour == null || next.closeMinute == null || next.closePeriod == null;
      if (needTopCloseExplode) {
        const { hour, minute, period } = parseTime(next.close_time || "");
        next.closeHour = hour;
        next.closeMinute = minute;
        next.closePeriod = period;
        next.close_time = buildTime(hour, minute, period);
      }

      // Per-day defaults (only fill if missing)
      next.week_selection = next.week_selection.map((d) => {
        const out = { ...d };
        // Day Game Name
        if (out.nameHour == null || out.nameMinute == null || out.namePeriod == null) {
          const { hour, minute, period } = parseTime(out.game_name || next.game_name || "");
          out.nameHour = hour;
          out.nameMinute = minute;
          out.namePeriod = period;
          out.game_name = buildTime(hour, minute, period);
        }
        // Day Close Time
        if (out.closeHour == null || out.closeMinute == null || out.closePeriod == null) {
          const { hour, minute, period } = parseTime(out.close_time || next.close_time || "");
          out.closeHour = hour;
          out.closeMinute = minute;
          out.closePeriod = period;
          out.close_time = buildTime(hour, minute, period);
        }
        return out;
      });

      return next;
    });
  }, [editingGame, setEditingGame]);

  if (!editingGame) return null;

  /** Keep top-level time strings in sync when HH/MM/AM-PM change */
  const setTopNameField = (key, val) => {
    setEditingGame((prev) => {
      const next = { ...prev, [key]: val };
      next.game_name = buildTime(next.nameHour, next.nameMinute, next.namePeriod);
      return next;
    });
  };
  const setTopCloseField = (key, val) => {
    setEditingGame((prev) => {
      const next = { ...prev, [key]: val };
      next.close_time = buildTime(next.closeHour, next.closeMinute, next.closePeriod);
      return next;
    });
  };

  /** Per-day setters; keep strings in sync */
  const setDayNameField = (index, key, val) =>
    setEditingGame((prev) => {
      const days = Array.isArray(prev.week_selection) ? [...prev.week_selection] : [];
      const d = { ...(days[index] || {}) };
      d[key] = val;
      d.game_name = buildTime(d.nameHour, d.nameMinute, d.namePeriod);
      days[index] = d;
      return { ...prev, week_selection: days };
    });

  const setDayCloseField = (index, key, val) =>
    setEditingGame((prev) => {
      const days = Array.isArray(prev.week_selection) ? [...prev.week_selection] : [];
      const d = { ...(days[index] || {}) };
      d[key] = val;
      d.close_time = buildTime(d.closeHour, d.closeMinute, d.closePeriod);
      days[index] = d;
      return { ...prev, week_selection: days };
    });

  /** Quick-fill buttons */
  const applyNameToAllDays = () => {
    setEditingGame((prev) => {
      const name = buildTime(prev.nameHour, prev.nameMinute, prev.namePeriod);
      const days = (prev.week_selection || []).map((d) => ({
        ...d,
        nameHour: prev.nameHour,
        nameMinute: prev.nameMinute,
        namePeriod: prev.namePeriod,
        game_name: name,
      }));
      return { ...prev, week_selection: days };
    });
  };
  const applyCloseToAllDays = () => {
    setEditingGame((prev) => {
      const t = buildTime(prev.closeHour, prev.closeMinute, prev.closePeriod);
      const days = (prev.week_selection || []).map((d) => ({
        ...d,
        closeHour: prev.closeHour,
        closeMinute: prev.closeMinute,
        closePeriod: prev.closePeriod,
        close_time: t,
      }));
      return { ...prev, week_selection: days };
    });
  };
  const applyNameAndCloseToAllDays = () => {
    setEditingGame((prev) => {
      const name = buildTime(prev.nameHour, prev.nameMinute, prev.namePeriod);
      const t = buildTime(prev.closeHour, prev.closeMinute, prev.closePeriod);
      const days = (prev.week_selection || []).map((d) => ({
        ...d,
        nameHour: prev.nameHour,
        nameMinute: prev.nameMinute,
        namePeriod: prev.namePeriod,
        game_name: name,
        closeHour: prev.closeHour,
        closeMinute: prev.closeMinute,
        closePeriod: prev.closePeriod,
        close_time: t,
      }));
      return { ...prev, week_selection: days };
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Game</h2>

        {/* Top row: Game Name (time) and Close Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block font-semibold">Game Name</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <input
                type="number" min={1} max={12} placeholder="HH"
                value={editingGame.nameHour ?? ""}
                onChange={(e) => setTopNameField("nameHour", Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              />
              <input
                type="number" min={0} max={59} placeholder="MM"
                value={editingGame.nameMinute ?? ""}
                onChange={(e) => setTopNameField("nameMinute", Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              />
              <select
                value={editingGame.namePeriod || "AM"}
                onChange={(e) => setTopNameField("namePeriod", e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Value: <b>{buildTime(editingGame.nameHour, editingGame.nameMinute, editingGame.namePeriod)}</b>
            </div>
          </div>

          <div>
            <label className="block font-semibold">Close Time</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <input
                type="number" min={1} max={12} placeholder="HH"
                value={editingGame.closeHour ?? ""}
                onChange={(e) => setTopCloseField("closeHour", Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              />
              <input
                type="number" min={0} max={59} placeholder="MM"
                value={editingGame.closeMinute ?? ""}
                onChange={(e) => setTopCloseField("closeMinute", Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              />
              <select
                value={editingGame.closePeriod || "AM"}
                onChange={(e) => setTopCloseField("closePeriod", e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Value: <b>{buildTime(editingGame.closeHour, editingGame.closeMinute, editingGame.closePeriod)}</b>
            </div>
          </div>
        </div>

        {/* Apply to all buttons */}
        <div className="flex flex-wrap gap-2 mb-4 justify-end">
          <button
            type="button"
            onClick={applyNameToAllDays}
            className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm"
          >
            Apply Game Name to All
          </button>
          <button
            type="button"
            onClick={applyCloseToAllDays}
            className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
          >
            Apply Close Time to All
          </button>
          <button
            type="button"
            onClick={applyNameAndCloseToAllDays}
            className="px-3 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white text-sm"
          >
            Apply Both to All
          </button>
        </div>

        {/* Day cards */}
        <h3 className="font-semibold mb-3">Day Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(editingGame.week_selection || []).map((day, index) => (
            <div key={index} className="border p-3 rounded-md shadow-md">
              <h3 className="font-semibold text-center mb-2">{day.day}</h3>

              {/* Day Game Name */}
              <label className="block text-sm mt-2">Game Name</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number" min={1} max={12} placeholder="HH"
                  value={day.nameHour ?? ""}
                  onChange={(e) => setDayNameField(index, "nameHour", Number(e.target.value))}
                  className="w-full border p-2 rounded-md text-sm"
                />
                <input
                  type="number" min={0} max={59} placeholder="MM"
                  value={day.nameMinute ?? ""}
                  onChange={(e) => setDayNameField(index, "nameMinute", Number(e.target.value))}
                  className="w-full border p-2 rounded-md text-sm"
                />
                <select
                  value={day.namePeriod || "AM"}
                  onChange={(e) => setDayNameField(index, "namePeriod", e.target.value)}
                  className="w-full border p-2 rounded-md text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              {/* Day Close Time */}
              <label className="block text-sm mt-3">Close Time</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="number" min={1} max={12} placeholder="HH"
                  value={day.closeHour ?? ""}
                  onChange={(e) => setDayCloseField(index, "closeHour", Number(e.target.value))}
                  className="w-full border p-2 rounded-md text-sm"
                />
                <input
                  type="number" min={0} max={59} placeholder="MM"
                  value={day.closeMinute ?? ""}
                  onChange={(e) => setDayCloseField(index, "closeMinute", Number(e.target.value))}
                  className="w-full border p-2 rounded-md text-sm"
                />
                <select
                  value={day.closePeriod || "AM"}
                  onChange={(e) => setDayCloseField(index, "closePeriod", e.target.value)}
                  className="w-full border p-2 rounded-md text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <button
                onClick={() => toggleDayStatus && toggleDayStatus(index, editingGame._id)}
                disabled={loadingAction === `toggle-day-${index}`}
                className={`w-full px-3 py-2 rounded-md text-white font-semibold text-sm ${
                  day.is_open ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                } transition-colors`}
              >
                {loadingAction === `toggle-day-${index}` ? "Updating..." : day.is_open ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button 
            onClick={handleUpdateGame} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Update Game
          </button>
          <button 
            onClick={closeEditPopup} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;