import { useState, useEffect } from 'react';
import { Project } from '../types';

const MAX_PROJECTS = 1000; // Augmenté à 1000 projets
const MAX_IMAGE_SIZE = 800 * 1024; // 800KB max pour les images

// Fonction pour compresser l'image
const compressImageData = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calcul des nouvelles dimensions en gardant le ratio
      const maxDimension = 800;
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Compression en JPEG avec qualité réduite
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = imageUrl;
  });
};

// Fonction pour stocker en toute sécurité
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('Quota de stockage dépassé, nettoyage des anciennes données...');
    return false;
  }
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erreur lors du chargement des projets:', e);
      return [];
    }
  });

  useEffect(() => {
    const storeProjects = async () => {
      try {
        // Tri par date et limitation du nombre
        const sortedProjects = [...projects]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, MAX_PROJECTS);

        // Stockage des données
        const success = safeSetItem('projects', JSON.stringify(sortedProjects));
        
        if (!success) {
          // Si le stockage échoue, on essaie de réduire
          const reducedProjects = sortedProjects.slice(0, Math.floor(MAX_PROJECTS / 2));
          safeSetItem('projects', JSON.stringify(reducedProjects));
          setProjects(reducedProjects);
        }
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des projets:', e);
      }
    };

    storeProjects();
  }, [projects]);

  const addProject = async (project: Omit<Project, 'id' | 'votes' | 'createdAt'>) => {
    try {
      const compressedImage = await compressImageData(project.imageUrl);
      
      const newProject: Project = {
        ...project,
        id: crypto.randomUUID(),
        votes: [],
        createdAt: Date.now(),
        imageUrl: compressedImage
      };

      setProjects(prev => [newProject, ...prev]);
    } catch (e) {
      console.error('Erreur lors de l\'ajout du projet:', e);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const voteProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const hasVoted = project.votes.includes(userId);
        const votes = hasVoted
          ? project.votes.filter(id => id !== userId)
          : [...project.votes, userId];
        return { ...project, votes };
      }
      return project;
    }));
  };

  const getTopProjects = () => {
    return [...projects]
      .sort((a, b) => b.votes.length - a.votes.length)
      .slice(0, 10);
  };

  return {
    projects,
    addProject,
    deleteProject,
    voteProject,
    getTopProjects
  };
}