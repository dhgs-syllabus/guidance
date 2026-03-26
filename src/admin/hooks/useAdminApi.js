import { useState, useCallback } from 'react';

export function useAdminApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/data/${name}`);
      if (!res.ok) throw new Error(`Failed to fetch ${name}`);
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback(async (name, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/data/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to save ${name}`);
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('Failed to fetch config');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save config');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSyllabi = useCallback(async () => {
    try {
      const res = await fetch('/api/syllabi');
      if (!res.ok) throw new Error('Failed to fetch syllabi');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, []);

  const syncSyllabus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sync-syllabus', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const runValidation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/validate');
      if (!res.ok) throw new Error('Validation failed');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSyllabi = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/syllabi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save syllabi');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGitStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/git-status');
      if (!res.ok) throw new Error('Failed to get git status');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const gitPush = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/git-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Push failed');
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, fetchData, saveData, fetchConfig, saveConfig, fetchSyllabi, saveSyllabi, syncSyllabus, runValidation, fetchGitStatus, gitPush };
}
