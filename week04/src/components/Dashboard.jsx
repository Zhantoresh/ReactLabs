import { useState } from 'react';
import ProjectCard from './ProjectCard';

const STATUSES = ['planned', 'in-progress', 'done'];

const initialProjects = [
  { id: crypto.randomUUID(), name: 'QazRoute', category: 'PjM 101', status: 'in-progress' },
  { id: crypto.randomUUID(), name: 'QazTil', category: 'PjM 101', status: 'planned' },
  { id: crypto.randomUUID(), name: 'BookSpot', category: 'TSIS', status: 'in-progress' },
  { id: crypto.randomUUID(), name: 'Abaitanu Magazine', category: 'Abaitanu', status: 'done' },
];

export default function Dashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  // Tracks how many times each project's card has been force-remounted.
  // Bumping a project's number changes the `key` we pass to its
  // ProjectCard below, which is what actually triggers the remount.
  const [remountVersions, setRemountVersions] = useState({});

  // Filtering/reordering never touch `projects` itself — they only
  // change how we DERIVE what to render from it. `projects` stays the
  // single source of truth; nothing here mutates it.
  const [statusFilter, setStatusFilter] = useState('all');
  const [isReversed, setIsReversed] = useState(false);

  // Used during the defense to show exactly when Dashboard itself re-renders
  // (e.g. on add/remove/status change) vs. when only a child re-renders.
  console.log('Dashboard rendering, project count:', projects.length);

  function handleAddProject(event) {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    const newProject = {
      id: crypto.randomUUID(),
      name: trimmedName,
      category: categoryInput.trim() || 'Uncategorized',
      status: 'planned',
    };

    setProjects((prev) => [...prev, newProject]);
    setNameInput('');
    setCategoryInput('');
  }

  function handleRemoveProject(id) {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }

  function handleCycleStatus(id) {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== id) return project;
        const currentIndex = STATUSES.indexOf(project.status);
        const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length];
        return { ...project, status: nextStatus };
      })
    );
  }

  function handleForceRemount(id) {
    setRemountVersions((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  }

  // Derived, not stored: recomputed fresh on every render from `projects`.
  // Filtering with .filter() and reversing with [...].reverse() both
  // return NEW arrays — `projects` itself is never mutated or reordered.
  const filteredProjects =
    statusFilter === 'all'
      ? projects
      : projects.filter((project) => project.status === statusFilter);

  const visibleProjects = isReversed
    ? [...filteredProjects].reverse()
    : filteredProjects;

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Project Tracker</h1>
        <p>Track your active coursework and side projects.</p>
      </header>

      <form className="add-form" onSubmit={handleAddProject}>
        <input
          type="text"
          placeholder="Project name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <button type="submit">Add Project</button>
      </form>

      <div className="controls-bar">
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          {['all', ...STATUSES].map((statusOption) => (
            <button
              key={statusOption}
              className={`filter-btn ${statusFilter === statusOption ? 'filter-btn--active' : ''}`}
              onClick={() => setStatusFilter(statusOption)}
            >
              {statusOption}
            </button>
          ))}
        </div>

        <button
          className="btn btn-reverse"
          onClick={() => setIsReversed((prev) => !prev)}
        >
          {isReversed ? 'Un-reverse order' : 'Reverse order'}
        </button>
      </div>

      {visibleProjects.length === 0 ? (
        <p className="empty-state">
          {projects.length === 0
            ? 'No projects yet — add one above.'
            : 'No projects match this filter.'}
        </p>
      ) : (
        <div className="project-list">
          {visibleProjects.map((project) => (
            <ProjectCard
              // The version suffix is what makes this key CHANGE when
              // handleForceRemount runs for this project — a different
              // key tells React "this is a new element", not the same
              // one being updated, forcing a real unmount + mount.
              //
              // Note it's still keyed by project.id first: filtering or
              // reversing visibleProjects never changes a card's key, so
              // React matches each ProjectCard to the SAME component
              // instance regardless of its new position in the array —
              // that's what preserves sessionCount/notes correctly.
              key={`${project.id}-v${remountVersions[project.id] ?? 0}`}
              project={project}
              onRemove={handleRemoveProject}
              onCycleStatus={handleCycleStatus}
              onForceRemount={handleForceRemount}
            />
          ))}
        </div>
      )}
    </div>
  );
}