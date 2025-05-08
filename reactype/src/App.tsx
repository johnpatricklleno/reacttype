import './output.css'
import ProjectList from './components/ProjectList'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto py-6 px-4">
      <ProjectList />
      </main>
    </div>
  );
}

export default App;
