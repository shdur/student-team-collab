import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type Project = {
  _id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Active',
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4002/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const createProject = async () => {
    if (!newProject.name || !newProject.description) return;

    try {
      const res = await fetch('http://localhost:4002/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        const added = await res.json();
        setProjects([...projects, added]);
        setShowModal(false);
        setNewProject({ name: '', description: '', status: 'Active' });
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4002/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const updateProject = async () => {
    if (!editingProject?.name || !editingProject?.description) return;

    try {
      const res = await fetch(`http://localhost:4002/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map(p => p._id === updated._id ? updated : p));
        setEditingProject(null);
      }
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Project Management</h2>
        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0369a1' : 'transparent',
            color: isActive ? '#fff' : '#cbd5e1',
          })}>Dashboard</NavLink>
          <NavLink to="/projects" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0369a1' : 'transparent',
            color: isActive ? '#fff' : '#cbd5e1',
          })}>Projects</NavLink>
          <NavLink to="/teams" style={({ isActive }) => ({
          ...styles.link,
          backgroundColor: isActive ? '#0369a1' : 'transparent',
          color: isActive ? '#fff' : '#cbd5e1',
          })}>Teams</NavLink>
          <NavLink to="/task" style={({ isActive }) => ({
          ...styles.link,
          backgroundColor: isActive ? '#0369a1' : 'transparent',
          color: isActive ? '#fff' : '#cbd5e1',
          })}>Tasks</NavLink>
 
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Projects</h2>
          <button style={styles.newButton} onClick={() => setShowModal(true)}>+ New Project</button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td style={styles.td}>{project.name}</td>
                <td style={styles.td}>{project.description}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.status,
                    backgroundColor: project.status === 'Active' ? '#22c55e' : '#9ca3af'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }} className="dropdown-container">
                    <span
                      style={{ cursor: 'pointer', fontSize: 18 }}
                      onClick={() => setDropdownOpen(dropdownOpen === project._id ? null : project._id)}
                    >
                      ⋮
                    </span>
                    {dropdownOpen === project._id && (
                      <div style={styles.dropdown}>
                        <button style={styles.dropdownButton} onClick={() => {
                          setEditingProject(project);
                          setDropdownOpen(null);
                        }}>Update</button>
                        <button style={{ ...styles.dropdownButton, color: '#ef4444' }} onClick={() => {
                          deleteProject(project._id);
                          setDropdownOpen(null);
                        }}>Delete</button>
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
              <h3 style={{ marginBottom: 12 }}>New Project</h3>
              <input
                placeholder="Name"
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                style={styles.input}
              />
              <select
                value={newProject.status}
                onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                style={styles.input}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div style={styles.modalButtons}>
                <button style={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={styles.createButton} onClick={createProject}>Create</button>
              </div>
            </div>
          </div>
        )}

        {editingProject && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={{ marginBottom: 12 }}>Update Project</h3>
              <input
                value={editingProject.name}
                onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                style={styles.input}
              />
              <input
                value={editingProject.description}
                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                style={styles.input}
              />
              <select
                value={editingProject.status}
                onChange={e => setEditingProject({ ...editingProject, status: e.target.value as 'Active' | 'Inactive' })}
                style={styles.input}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div style={styles.modalButtons}>
                <button style={styles.cancelButton} onClick={() => setEditingProject(null)}>Cancel</button>
                <button style={styles.createButton} onClick={updateProject}>Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', height: '100vh', fontFamily: 'sans-serif' },
  sidebar: { width: 240, background: '#0c4a6e', color: '#fff', padding: '24px 16px' },
  logo: { fontSize: 20, marginBottom: 24 },
  nav: { display: 'flex', flexDirection: 'column', gap: 12 },
  link: {
    textDecoration: 'none', padding: '8px 12px', borderRadius: 8,
    fontWeight: 500, transition: 'background 0.2s',
  },
  main: { flex: 1, padding: 24, background: '#f8fafc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  newButton: {
    backgroundColor: '#3b82f6', color: '#fff', padding: '8px 16px',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
  },
  table: {
    width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8,
    overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  th: {
    padding: 12, backgroundColor: '#f1f5f9', textAlign: 'left',
    fontWeight: 600, borderBottom: '1px solid #e2e8f0'
  },
  td: { padding: 12, borderBottom: '1px solid #e2e8f0' },
  status: {
    color: '#fff', padding: '4px 10px', borderRadius: '999px',
    fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', padding: 24, borderRadius: 12, width: 320,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
  },
  input: {
    marginBottom: 12, padding: '8px 12px', border: '1px solid #ccc',
    borderRadius: 6, fontSize: 14
  },
  modalButtons: { display: 'flex', justifyContent: 'space-between', marginTop: 8 },
  cancelButton: {
    padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none',
    borderRadius: 6, cursor: 'pointer'
  },
  createButton: {
    padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
  },
  dropdown: {
    position: 'absolute', top: 24, right: 0, background: '#fff',
    border: '1px solid #ddd', borderRadius: 6,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 10,
    display: 'flex', flexDirection: 'column', minWidth: 100, overflow: 'hidden'
  },
  dropdownButton: {
    padding: '10px 14px', background: 'white', border: 'none',
    borderBottom: '1px solid #f1f5f9', textAlign: 'left', cursor: 'pointer',
    fontSize: 14, transition: 'background 0.2s', color: '#0f172a'
  }
};
