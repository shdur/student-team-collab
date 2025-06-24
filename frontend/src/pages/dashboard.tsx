import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

// Types
type Project = { _id: string; name: string; description: string; status: 'Active' | 'Inactive' };
type Team = { _id: string; name: string; status: 'Active' | 'Inactive' };
type Task = { _id: string; title: string; projectId: string; teamId: string; dueDate?: string; status: 'Pending' | 'In Progress' | 'Completed' };

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('http://localhost:4002/projects').then(res => res.json()).then(data => {
      console.log('📦 Projects:', data);
      setProjects(Array.isArray(data) ? data : []);
    });

    fetch('http://localhost:4004/teams').then(res => res.json()).then(data => {
      console.log('👥 Teams:', data);
      setTeams(Array.isArray(data) ? data : []);
    });

    fetch('http://localhost:4003/tasks').then(res => res.json()).then(data => {
      console.log('✅ Tasks:', data);
      setTasks(Array.isArray(data) ? data : []);
    });
  }, []);

  const getProjectName = (id: string) =>
    Array.isArray(projects) ? projects.find(p => p._id === id)?.name || '—' : '—';

  const getTeamName = (id: string) =>
    Array.isArray(teams) ? teams.find(t => t._id === id)?.name || '—' : '—';

  const taskStatusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
  ];

  const COLORS = ['#9ca3af', '#facc15', '#22c55e'];

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Student Team Collab</h2>
        <nav style={styles.nav}>
          {['dashboard', 'projects', 'teams', 'task'].map(path => (
            <NavLink
              key={path}
              to={`/${path}`}
              style={({ isActive }) => ({
                ...styles.link,
                backgroundColor: isActive ? '#0ea5e9' : 'transparent'
              })}
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={styles.main}>
        <h2 style={styles.title}>Overview</h2>
        <div style={styles.metrics}>
          <div style={styles.metricCardFull}><strong>Total Projects:</strong><br />{projects.length}</div>
          <div style={styles.metricCardFull}><strong>Active Teams:</strong><br />{teams.filter(t => t.status === 'Active').length}</div>
          <div style={styles.metricCardFull}><strong>All Tasks:</strong><br />{tasks.length}</div>
          <div style={styles.metricCardFull}><strong>Completed Tasks:</strong><br />{tasks.filter(t => t.status === 'Completed').length}</div>
        </div>

        <div style={styles.chartsWrapper}>
          <div style={styles.chartBox}>
            <h4 style={{ textAlign: 'center', marginBottom: 12 }}>Task Status (Bar Chart)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskStatusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartBox}>
            <h4 style={{ textAlign: 'center', marginBottom: 12 }}>Task Distribution (Pie Chart)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <h3 style={styles.title}>Latest Tasks</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Project</th>
              <th style={styles.th}>Team</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 5).map(task => (
              <tr key={task._id}>
                <td style={styles.td}>{task.title}</td>
                <td style={styles.td}>{getProjectName(task.projectId)}</td>
                <td style={styles.td}>{getTeamName(task.teamId)}</td>
                <td style={styles.td}>{task.dueDate?.split('T')[0]}</td>
                <td style={styles.td}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#fff',
                    backgroundColor:
                      task.status === 'Completed' ? '#22c55e' :
                      task.status === 'In Progress' ? '#facc15' : '#9ca3af',
                    textTransform: 'uppercase',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {task.status}
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
  container: { display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6' },
  sidebar: { width: 240, background: '#075985', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: 20, marginBottom: 24 },
  nav: { display: 'flex', flexDirection: 'column', gap: 8 },
  link: { padding: '10px 16px', borderRadius: 8, color: '#fff', textDecoration: 'none', fontWeight: 500, transition: 'background 0.2s', display: 'block' },
  main: { flex: 1, padding: 24, overflowY: 'auto' },
  title: { margin: '16px 0 8px' },
  metrics: { display: 'flex', gap: 16, marginBottom: 24, width: '100%' },
  metricCardFull: { background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center', minWidth: 0 },
  chartsWrapper: { display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' },
  chartBox: { background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, minWidth: 320, height: 320 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: 12, borderBottom: '1px solid #ddd', textAlign: 'left', background: '#f1f5f9' },
  td: { padding: 12, borderBottom: '1px solid #eee' },
};
