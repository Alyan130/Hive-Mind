'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Spinner from '@/components/ui/Spinner';
import { createProject } from '@/api/projects';
import type { Project } from '@/types';

export default function CreateProjectModal({
  onClose, onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Project) => void;
}) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!name.trim()) { setError('Project name is required.'); return; }
    setLoading(true);
    try {
      const project = await createProject({ name: name.trim(), description: desc.trim() || undefined });
      onCreated(project);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || 'Failed to create project.');
      setLoading(false);
    }
  }

  return (
    <Modal title="New Project" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Input
          label="Project name"
          value={name}
          autoFocus
          onChange={e => { setName(e.target.value); setError(''); }}
          placeholder="e.g. Sprint Planning AI"
          error={error}
        />
        <Textarea
          label="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What is this project about?"
          rows={3}
        />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} disabled={loading}>
            {loading ? <Spinner color="#fff" /> : 'Create Project'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
