import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type Team = {
  _id: string;
  name: string;
};

type Project = {
  _id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  teamId?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formProject, setFormProject] = useState({
    _id: '',
    name: '',
    description: '',
    status: 'Active',
    teamId: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4002/projects')
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error('Gabim në marrjen e projekteve:', err));

    fetch('http://localhost:4004/teams')
      .then((res) => res.json())
      .then(setTeams)
      .catch((err) => console.error('Gabim në marrjen e ekipeve:', err));
  }, []);

  const openCreateModal = () => {
    setFormProject({ _id: '', name: '', description: '', status: 'Active', teamId: '' });
    setEditingProject(null);
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setFormProject({ ...project, teamId: project.teamId || '' });
    setEditingProject(project);
    setShowModal(true);
    setDropdownOpen(null);
  };

  const handleSubmit = async () => {
    if (!formProject.name || !formProject.description) return;

    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject
      ? `http://localhost:4002/projects/${editingProject._id}`
      : 'http://localhost:4002/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formProject),
      });

      if (res.ok) {
        fetch('http://localhost:4002/projects')
          .then((res) => res.json())
          .then(setProjects);
        setShowModal(false);
      }
    } catch (err) {
      console.error('Gabim gjatë ruajtjes:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('A je i sigurt që do ta fshish këtë projekt?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:4002/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Gabim gjatë fshirjes:', err);
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Student Team Collab</h2>
        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
          <NavLink to="/projects" style={navLinkStyle}>Projects</NavLink>
          <NavLink to="/teams" style={navLinkStyle}>Teams</NavLink>
          <NavLink to="/task" style={navLinkStyle}>Tasks</NavLink>
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Projects</h2>
          <button style={styles.button} onClick={openCreateModal}>+ New Project</button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Team</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td style={styles.td}>{project.name}</td>
                <td style={styles.td}>{project.description}</td>
                <td style={styles.td}>{teams.find((t) => t._id === project.teamId)?.name || 'Unassigned'}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    backgroundColor: project.status === 'Active' ? '#22c55e' : '#9ca3af',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === project._id ? null : project._id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: 20,
                        cursor: 'pointer',
                        transform: 'rotate(90deg)',
                        padding: 4,
                      }}
                    >
                      ⋯
                    </button>
                    {dropdownOpen === project._id && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 28,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 100,
                        alignItems: 'flex-start',
                      }}>
                        <button onClick={() => openEditModal(project)} style={{ ...styles.dropdownItem, color: '#6b7280' }}>Edit</button>
                        <button onClick={() => handleDelete(project._id)} style={{ ...styles.dropdownItem, color: '#dc2626' }}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <input
                placeholder="Name"
                value={formProject.name}
                onChange={(e) => setFormProject({ ...formProject, name: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Description"
                value={formProject.description}
                onChange={(e) => setFormProject({ ...formProject, description: e.target.value })}
                style={styles.input}
              />
              <select
                value={formProject.teamId}
                onChange={(e) => setFormProject({ ...formProject, teamId: e.target.value })}
                style={styles.input}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
              <select
                value={formProject.status}
                onChange={(e) => setFormProject({ ...formProject, status: e.target.value as 'Active' | 'Inactive' })}
                style={styles.input}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div style={styles.modalButtons}>
                <button style={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={styles.createButton} onClick={handleSubmit}>
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: '10px 16px',
  borderRadius: 8,
  color: '#fff',
  backgroundColor: isActive ? '#0284c7' : 'transparent',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'background 0.2s',
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    width: 240,
    background: '#075985',
    color: '#fff',
    padding: '24px 16px',
  },
  logo: {
    fontSize: 20,
    marginBottom: 24,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  main: {
    flex: 1,
    padding: 24,
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    padding: 12,
    backgroundColor: '#f1f5f9',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #e2e8f0',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    width: 320,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: 12,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  createButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 14,
  },
};
