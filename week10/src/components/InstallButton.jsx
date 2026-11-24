import { useState } from "react";
import { useInstallApp } from "../hooks/useInstallApp.js";

export default function InstallButton() {
  const { canInstall, installed, ios, install } = useInstallApp();
  const [showIosHint, setShowIosHint] = useState(false);

  if (installed || (!canInstall && !ios)) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn--small install-button"
        onClick={() => (canInstall ? install() : setShowIosHint(true))}
        title="Install Departures Board as an app"
      >
        ⬇ Install<span className="install-button__more"> app</span>
      </button>

      {showIosHint && (
        <div className="install-hint" role="dialog" aria-modal="true" aria-labelledby="install-hint-title">
          <div className="install-hint__card">
            <h2 id="install-hint-title">Install Departures Board</h2>
            <ol>
              <li>
                Tap <strong>Share</strong> <span aria-hidden="true">(□↑)</span> in Safari.
              </li>
              <li>
                Choose <strong>Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong>Add</strong>. The app opens from its icon, full screen, and works offline.
              </li>
            </ol>
            <button type="button" className="btn" onClick={() => setShowIosHint(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}