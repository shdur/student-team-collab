import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Fjalëkalimet nuk përputhen.');
    }

    try {
      const res = await fetch("http://localhost:4001/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Regjistrimi dështoi.');
      }

      // Përdoruesi u regjistrua me sukses
      navigate('/');
    } catch (err) {
      setError('Gabim gjatë regjistrimit.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.heading}>Sign Up</h2>
        <input
          type="text"
          placeholder="Emri"
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
          required
        />
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
          placeholder="Fjalëkalimi"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Konfirmo Fjalëkalimin"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Regjistrohu</button>
        <p style={styles.linkText}>
          Ke llogari? <a href="/">Kyçu</a>
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
    width: 320,
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
