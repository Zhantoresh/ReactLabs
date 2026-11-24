import { useNotifications } from "../hooks/useNotifications.js";

const ICONS = { success: "✓", error: "⚠", info: "ℹ" };

// Toast messages in the corner (bonus). The texts come from Redux (notifications slice),
// the listener middleware adds them after thunks finish and closes them after a few seconds.
export default function Toaster() {
  const { items, dismiss, undoDelete } = useNotifications();

  return (
    <div className="toaster" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={`toast toast--${item.type}`} role={item.type === "error" ? "alert" : "status"}>
          <span className="toast__icon" aria-hidden="true">
            {ICONS[item.type]}
          </span>
          <p className="toast__message">{item.message}</p>

          {item.undoDeleteId !== null && (
            <button className="toast__undo" onClick={() => undoDelete(item.undoDeleteId)}>
              Undo
            </button>
          )}
          <button className="toast__close" onClick={() => dismiss(item.id)} aria-label="Close message">
            ×
          </button>

          {/* countdown line: the CSS animation runs exactly as long as the toast lives */}
          <span className="toast__timer" style={{ animationDuration: `${item.duration}ms` }} />
        </div>
      ))}
    </div>
  );
}
