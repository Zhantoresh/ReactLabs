import { useState } from 'react';

export default function ProjectCard({ project, onRemove, onCycleStatus, onForceRemount }) {
  // Local state — lives ONLY inside this component instance. It has
  // nothing to do with Dashboard's `projects` state array.
  const [sessionCount, setSessionCount] = useState(0);
  const [notes, setNotes] = useState('');

  // Fires on every render of THIS card — mount, re-render from a parent
  // update, or a fresh mount after a key change (force remount). Watch
  // this in DevTools to see exactly when React re-runs this component.
  console.log(
    `Rendering ProjectCard: ${project.name} | sessions=${sessionCount} notes="${notes}"`
  );

  function handleLogSession() {
    setSessionCount((count) => count + 1);
  }

  function handleResetCount() {
    // Ordinary state reset: only touches sessionCount. `notes` is left
    // completely untouched — this is a manual, partial reset.
    setSessionCount(0);
  }

  function handleForceRemount() {
    // Delegates to the parent, which changes THIS card's `key`. A key
    // change makes React treat it as a brand-new element: it unmounts
    // the current instance and mounts a fresh one. EVERY local state
    // variable resets to its initial value — sessionCount AND notes,
    // even though this button never touches either directly.
    onForceRemount(project.id);
  }

  return (
    <div className="project-card">
      <div className="project-card__header">
        <h2>{project.name}</h2>
        <span className="project-card__category">{project.category}</span>
      </div>

      <button
        className={`status-badge status-${project.status}`}
        onClick={() => onCycleStatus(project.id)}
      >
        {project.status}
      </button>

      <div className="project-card__local-state">
        <div className="session-row">
          <span>Sessions logged: {sessionCount}</span>
          <button className="btn btn-small" onClick={handleLogSession}>
            +1 session
          </button>
        </div>

        <input
          type="text"
          className="notes-input"
          placeholder="Local notes for this card..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="reset-row">
          <button className="btn btn-small" onClick={handleResetCount}>
            Reset count
          </button>
          <button className="btn btn-small btn-remount" onClick={handleForceRemount}>
            Force remount
          </button>
        </div>
      </div>

      <button className="btn btn-remove" onClick={() => onRemove(project.id)}>
        Remove
      </button>
    </div>
  );
}