'use client';

import React, { useState } from 'react';
import { X, Upload, Link2, Users, FileText, Share2, Palette, FileCheck, Award, Image } from 'lucide-react';

type BrandPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BrandPanel: React.FC<BrandPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('logo');

  if (!isOpen) return null;

  const tabs = [
    { id: 'logo', name: 'Logo', icon: Image },
    { id: 'photos', name: 'Photo Library', icon: Upload },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'about', name: 'About', icon: FileText },
    { id: 'social', name: 'Social Media', icon: Share2 },
    { id: 'colors', name: 'Brand Colors', icon: Palette },
    { id: 'guidelines', name: 'Guidelines', icon: FileCheck },
    { id: 'mission', name: 'Mission & Values', icon: Award },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Campaign Brand Management</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'logo' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Campaign Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-red-400 transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Upload your campaign logo</p>
                  <p className="text-sm text-gray-500">PNG, JPG, SVG up to 10MB</p>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Photo Library</h3>
                <p className="text-gray-600 mb-4">Manage campaign photos, rally images, and event pictures</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-red-400 transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Upload campaign photos</p>
                  <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Campaign Team</h3>
                <p className="text-gray-600 mb-4">Add photos and bios for your campaign team</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  + Add Team Member
                </button>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About the Candidate</h3>
                <textarea
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Write about the candidate's background, experience, and why they're running..."
                />
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="space-y-3">
                  <input type="url" placeholder="Facebook URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
                  <input type="url" placeholder="Twitter/X URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
                  <input type="url" placeholder="Instagram URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
                  <input type="url" placeholder="YouTube URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
                  <input type="url" placeholder="LinkedIn URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" />
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Campaign Brand Colors</h3>
                <p className="text-gray-600 mb-4">Define your campaign's color palette</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color (Red)</label>
                    <input type="color" defaultValue="#DC2626" className="w-full h-12 rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color (Blue)</label>
                    <input type="color" defaultValue="#1D4ED8" className="w-full h-12 rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <input type="color" defaultValue="#F59E0B" className="w-full h-12 rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                    <input type="color" defaultValue="#1F2937" className="w-full h-12 rounded-lg border border-gray-300" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guidelines' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Brand Guidelines</h3>
                <p className="text-gray-600 mb-4">Document your campaign's visual identity standards</p>
                <textarea
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Define logo usage, typography, color applications, photography style, and other brand standards..."
                />
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mission & Values</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Mission</label>
                    <textarea
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="What is your campaign's mission?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Core Values</label>
                    <textarea
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="List your campaign's core values (e.g., Freedom, Security, Prosperity)"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
