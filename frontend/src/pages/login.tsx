import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:4001/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard'); // ose ndonjë faqe tjetër
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Log In</button>
        <p style={styles.linkText}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f3f4f6',
  },
  form: {
    padding: 32,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    width: 300,
  },
  heading: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    marginBottom: 12,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    padding: 10,
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
  linkText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
};
