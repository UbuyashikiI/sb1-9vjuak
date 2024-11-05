import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import ProjectForm from './components/ProjectForm';
import ProjectCard from './components/ProjectCard';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showTopProjects, setShowTopProjects] = useState(false);
  const { user, login, logout } = useAuth();
  const { projects, addProject, deleteProject, voteProject, getTopProjects } = useProjects();

  const displayedProjects = showTopProjects ? getTopProjects() : projects;

  if (!user && !localStorage.getItem('user')) {
    const tempUser = { id: crypto.randomUUID(), isAdmin: false };
    localStorage.setItem('user', JSON.stringify(tempUser));
  }

  return (
    <div className="min-h-screen bg-[#1a202c] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Propositions de Projets</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <span>+</span> Proposer un projet
            </button>
            {user?.isAdmin ? (
              <button
                onClick={logout}
                className="bg-[#2d3748] text-white px-4 py-2 rounded-md hover:bg-[#3a4759] flex items-center gap-2 transition-colors"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-[#2d3748] text-white px-4 py-2 rounded-md hover:bg-[#3a4759] transition-colors"
              >
                Admin
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowTopProjects(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !showTopProjects
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tous les projets
            </button>
            <button
              onClick={() => setShowTopProjects(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                showTopProjects
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Top 10
            </button>
          </div>
        </div>

        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-xl mb-2">Aucun projet proposé pour le moment.</p>
            <p>Soyez le premier à proposer un projet !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={user?.isAdmin ? deleteProject : undefined}
                onVote={(id) => voteProject(id, user?.id || '')}
                currentUser={user}
                rank={showTopProjects ? index + 1 : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSubmit={addProject}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          onLogin={login}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

export default App;