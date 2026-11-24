// One component for the loading / error / empty states,
// so every page shows them the same way.
export default function StateMessage({ type = "info", title, children, action }) {
  return (
    <div className={`state state--${type}`} role={type === "error" ? "alert" : "status"}>
      {title && <p className="state__title">{title}</p>}
      {children && <div className="state__text">{children}</div>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}