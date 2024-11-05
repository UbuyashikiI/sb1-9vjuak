import React from 'react';
import { Trash2, ThumbsUp, Trophy, ExternalLink, AlertTriangle } from 'lucide-react';
import { Project, User } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onVote?: (id: string) => void;
  currentUser: User | null;
  rank?: number;
}

export default function ProjectCard({ project, onDelete, onVote, currentUser, rank }: ProjectCardProps) {
  const hasVoted = currentUser && project.votes.includes(currentUser.id);
  const genres = project.genre.split(',').map(g => g.trim()).filter(Boolean);

  const getRankBadge = () => {
    if (!rank) return null;
    
    if (rank <= 3) {
      const badges = {
        1: { color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: '1er', shadow: 'shadow-yellow-500/50', border: 'border-yellow-300', trophy: 'text-yellow-800' },
        2: { color: 'bg-gradient-to-r from-gray-300 to-gray-500', text: '2ème', shadow: 'shadow-gray-400/50', border: 'border-gray-200', trophy: 'text-gray-800' },
        3: { color: 'bg-gradient-to-r from-amber-500 to-amber-700', text: '3ème', shadow: 'shadow-amber-600/50', border: 'border-amber-400', trophy: 'text-amber-800' }
      };
      
      const badge = badges[rank as keyof typeof badges];
      return (
        <div className={`absolute top-4 left-4 ${badge.color} text-black px-6 py-2.5 rounded-full flex items-center gap-2.5 shadow-lg ${badge.shadow} transform -rotate-12 backdrop-blur-md border-2 ${badge.border} font-extrabold`}>
          <Trophy size={20} className={`${badge.trophy} fill-current`} />
          <span className="text-lg tracking-wide">{badge.text}</span>
        </div>
      );
    } else {
      return (
        <div className="absolute bottom-4 left-4 bg-gray-700/80 text-white px-3 py-1 rounded-lg backdrop-blur-sm">
          #{rank}
        </div>
      );
    }
  };

  return (
    <div className="bg-[#1e2530] rounded-lg p-6 space-y-4 shadow-lg">
      <div className="aspect-video relative overflow-hidden rounded-lg group">
        <img
          src={project.imageUrl}
          alt={project.title}
          loading="lazy"
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-95"
        />
        {getRankBadge()}
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="text-gray-400">par {project.author}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {currentUser?.isAdmin && onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          
          {onVote && (
            <button
              onClick={() => onVote(project.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-all duration-300 ${
                hasVoted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-[#2a3441] text-gray-300 hover:bg-[#343e4d]'
              }`}
            >
              <ThumbsUp size={16} className={hasVoted ? 'transform scale-110' : ''} />
              <span>{project.votes.length}</span>
            </button>
          )}
        </div>
      </div>

      {project.isLicensed && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 p-3 rounded-lg">
          <AlertTriangle size={20} />
          <span>Œuvre licenciée</span>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {genres.map((genre, index) => (
          <span
            key={index}
            className="bg-purple-600 bg-opacity-20 text-purple-400 px-2 py-1 rounded-full text-sm transition-colors hover:bg-opacity-30"
          >
            {genre}
          </span>
        ))}
      </div>

      <p className="text-gray-300">{project.description}</p>
      
      {project.seriesUrl && (
        <a
          href={project.seriesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={16} />
          Lien vers la série
        </a>
      )}
      
      <div className="flex gap-2 flex-wrap">
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-600 bg-opacity-20 text-blue-400 px-2 py-1 rounded-full text-sm transition-colors hover:bg-opacity-30"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}