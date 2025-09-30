import React, { useEffect, useState } from 'react';
import api from '../api';

type Idea = {
  id: number;
  title: string;
  description?: string;
  votes: number;
  voted: boolean;
};

export default function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get<Idea[]>('/ideas');
      setIdeas(resp.data);
    } catch (e: any) {
      setError('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const onVote = async (id: number) => {
    setVotingId(id);
    setError(null);
    try {
      await api.post(`/ideas/${id}/vote`);
      // оптимистично обновим UI: увеличим голос и пометим voted
      setIdeas(prev => prev.map(item => item.id === id ? { ...item, votes: item.votes + 1, voted: true } : item));
    } catch (e: any) {
      if (e?.response?.status === 409) {
        setError(e.response.data?.error || 'Conflict: cannot vote');
      } else {
        setError('Vote failed');
      }
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <div>Loading ideas...</div>;
  if (error && ideas.length === 0) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {ideas.map(i => (
          <div key={i.id} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{i.title}</h5>
                <p className="card-text text-muted">{i.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{i.votes}</strong> {i.votes === 1 ? 'vote' : 'votes'}
                  </div>
                  <button
                    className="btn btn-primary"
                    disabled={i.voted || votingId === i.id}
                    onClick={() => onVote(i.id)}
                  >
                    {i.voted ? 'Voted' : (votingId === i.id ? 'Voting...' : 'Vote')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
