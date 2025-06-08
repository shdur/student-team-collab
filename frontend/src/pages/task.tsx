import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTask, setFormTask] = useState<Task>({
    title: '',
    description: '',
    status: 'Pending',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:4003/tasks')
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  const openCreateModal = () => {
    setFormTask({
      title: '',
      description: '',
      status: 'Pending',
      assignedTo: '',
      priority: 'Medium',
      dueDate: '',
    });
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setFormTask(task);
    setEditingTask(task);
    setShowModal(true);
    setDropdownOpen(null);
  };

  const handleSubmit = async () => {
    if (!formTask.title) return;

    const method = editingTask ? 'PUT' : 'POST';
    const url = editingTask ? `http://localhost:4003/tasks/${editingTask._id}` : 'http://localhost:4003/tasks';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formTask),
      });

      if (res.ok) {
        fetchTasks();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:4003/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Task Manager</h2>
        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
          <NavLink to="/projects" style={navLinkStyle}>Projects</NavLink>
          <NavLink to="/teams" style={navLinkStyle}>Teams</NavLink>
          <NavLink to="/task" style={navLinkStyle}>Tasks</NavLink>
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Tasks</h2>
          <button style={styles.button} onClick={openCreateModal}>+ New Task</button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td style={styles.td}>{task.title}</td>
                <td style={styles.td}>{task.description}</td>
                <td style={styles.td}>{task.assignedTo}</td>
                <td style={styles.td}>{task.priority}</td>
                <td style={styles.td}>{task.dueDate?.split('T')[0]}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    backgroundColor: task.status === 'Completed' ? '#22c55e' : '#9ca3af',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>{task.status}</span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        const id = task._id ?? null;
                        setDropdownOpen(dropdownOpen === id ? null : id);
                      }}
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
                    {dropdownOpen === task._id && (
                      <div style={styles.dropdown}>
                        <button
                          onClick={() => openEditModal(task)}
                          style={{ ...styles.dropdownItem, color: '#6b7280' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          style={{ ...styles.dropdownItem, color: '#dc2626' }}
                        >
                          Delete
                        </button>
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
              <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <input
                placeholder="Task Title"
                value={formTask.title}
                onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Description"
                value={formTask.description}
                onChange={(e) => setFormTask({ ...formTask, description: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Assigned To"
                value={formTask.assignedTo}
                onChange={(e) => setFormTask({ ...formTask, assignedTo: e.target.value })}
                style={styles.input}
              />
              <select
                value={formTask.priority}
                onChange={(e) => setFormTask({ ...formTask, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                style={styles.input}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                value={formTask.dueDate}
                onChange={(e) => setFormTask({ ...formTask, dueDate: e.target.value })}
                style={styles.input}
              />
              <select
                value={formTask.status}
                onChange={(e) => setFormTask({ ...formTask, status: e.target.value as 'Pending' | 'Completed' })}
                style={styles.input}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <div style={styles.modalButtons}>
                <button style={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={styles.createButton} onClick={handleSubmit}>
                  {editingTask ? 'Update' : 'Create'}
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
  dropdown: {
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
};
