import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (project: {
    title: string;
    description: string;
    author: string;
    genre: string;
    imageUrl: string;
    tags: string[];
    isLicensed: boolean;
    seriesUrl?: string;
  }) => void;
}

export default function ProjectForm({ onClose, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    genre: '',
    isLicensed: false,
    seriesUrl: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 3 Mo');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Veuillez sélectionner une image');
      return;
    }
    
    onSubmit({
      ...formData,
      imageUrl: imagePreview,
      tags,
      seriesUrl: formData.isLicensed ? undefined : formData.seriesUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1e2530] rounded-lg w-full max-w-md p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-semibold text-white mb-6">
          Proposer un nouveau projet
        </h2>

        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">
            Note importante : Les œuvres licenciées ne seront pas prises en compte dans les propositions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">
              Titre du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Entrez le titre du projet"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Genre(s) <span className="text-red-500">*</span>
              <span className="text-gray-400 text-sm ml-2">(séparez les genres par des virgules)</span>
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Ex: Action, Aventure, RPG"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none h-32"
              placeholder="Décrivez votre projet"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Auteur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.isLicensed}
                onChange={(e) => setFormData({ ...formData, isLicensed: e.target.checked })}
                className="rounded border-gray-600 bg-[#2a3441] text-blue-500 focus:ring-blue-500"
              />
              Est-ce une œuvre licenciée ?
            </label>
            {!formData.isLicensed && (
              <div>
                <label className="block text-gray-300 mb-1">
                  URL de la série
                  <span className="text-gray-400 text-sm ml-2">(optionnel)</span>
                </label>
                <input
                  type="url"
                  value={formData.seriesUrl}
                  onChange={(e) => setFormData({ ...formData, seriesUrl: e.target.value })}
                  className="w-full bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Image du projet (max 3Mo) <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#2a3441] text-gray-300 rounded p-2 border border-gray-600 hover:bg-[#343e4d] flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Choisir une image
            </button>
            {imagePreview && (
              <div className="mt-2 relative aspect-video overflow-auto max-h-48">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded object-contain w-full"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="flex-1 bg-[#2a3441] text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Ajouter un tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Proposer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}