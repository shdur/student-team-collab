import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type Project = {
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('http://localhost:4002/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Gabim në marrjen e projekteve:', err));
  }, []);

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Student Team Collab</h2>
        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0ea5e9' : 'transparent'
          })}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0ea5e9' : 'transparent'
          })}>
            Projects
          </NavLink>
          <NavLink to="/teams" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0ea5e9' : 'transparent'
          })}>
            Teams
          </NavLink>
          <NavLink to="/task" style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? '#0ea5e9' : 'transparent'
          })}>
            Tasks
          </NavLink>
        </nav>
      </aside>

      <main style={styles.main}>
        <h2 style={styles.title}>Overview</h2>
        <div style={styles.metrics}>
          <div style={styles.metricCardFull}>
            <strong>Total Projects:</strong><br />{projects.length}
          </div>
          <div style={styles.metricCardFull}>
            <strong>Active Projects:</strong><br />{projects.filter(p => p.status === 'Active').length}
          </div>
          <div style={styles.metricCardFull}>
            <strong>Inactive Projects:</strong><br />{projects.filter(p => p.status === 'Inactive').length}
          </div>
        </div>

        <h3 style={styles.title}>Projects</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{project.name}</td>
                <td style={styles.td}>{project.description}</td>
                <td style={styles.td}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#fff',
                    backgroundColor: project.status === 'Active' ? '#22c55e' : '#9ca3af',
                    textTransform: 'uppercase',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

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
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    fontSize: 20,
    marginBottom: 24,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  link: {
    padding: '10px 16px',
    borderRadius: 8,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'background 0.2s',
    display: 'block',
  },
  main: {
    flex: 1,
    padding: 24,
    overflowY: 'auto',
  },
  title: {
    margin: '16px 0 8px',
  },
  metrics: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    width: '100%',
  },
  metricCardFull: {
    background: '#fff',
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: 1,
    textAlign: 'center',
    minWidth: 0,
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
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    background: '#f1f5f9',
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #eee',
  },
};
