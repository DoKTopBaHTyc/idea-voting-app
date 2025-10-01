import IdeaList from './components/IdeaList';

function App() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Idea Voting</h1>
      <p className="text-muted">Просмотрите идеи и проголосуйте — максимум 10 разных идей с одного IP.</p>
      <IdeaList />
    </div>
  );
}

export default App;
