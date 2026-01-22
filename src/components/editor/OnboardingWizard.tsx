'use client';

import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Eye, Briefcase, User, Heart, Flag } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { pageTemplates, PageTemplate, SiteType, getTemplatesBySiteType } from '@/lib/templates';
import { Canvas } from './Canvas';

type OnboardingWizardProps = {
  isOpen: boolean;
  onComplete: () => void;
};

type FormData = {
  siteType: SiteType | null;
  brandName: string;
  tagline: string;
  candidateName: string;
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    siteType: null,
    brandName: '',
    tagline: '',
    candidateName: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const { loadPage: loadPageToStore, setPageName } = useEditorStore();

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template: PageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleComplete = async () => {
    if (selectedTemplate) {
      // Apply form data to selected template
      const customizedTemplate = {
        ...selectedTemplate,
        name: formData.brandName || selectedTemplate.name,
        components: selectedTemplate.components.map(comp => {
          if (comp.type === 'hero' && comp.props.title) {
            return {
              ...comp,
              props: {
                ...comp.props,
                title: formData.tagline || comp.props.title,
                subtitle: formData.siteType === 'political' && formData.candidateName
                  ? `${formData.candidateName} for America`
                  : comp.props.subtitle,
              }
            };
          }
          return comp;
        }),
      };

      try {
        // Save to database first
        const { savePage } = await import('@/lib/page-service');
        const savedPage = await savePage({
          name: formData.brandName || 'My Site',
          components: customizedTemplate.components,
          theme: customizedTemplate.theme,
        });

        // Then load into store
        loadPageToStore(savedPage);
        setPageName(savedPage.name);
      } catch (error) {
        console.error('Failed to create site:', error);
        alert('Failed to create site. Please try again.');
        return;
      }
    }
    onComplete();
  };

  const canProceed = () => {
    if (currentStep === 0) return formData.siteType !== null;
    if (currentStep === 1) return selectedTemplate !== null;
    if (currentStep === 2) return formData.brandName.trim() !== '';
    if (formData.siteType === 'political') {
      if (currentStep === 3) return formData.candidateName.trim() !== '';
      if (currentStep === 4) return formData.tagline.trim() !== '';
    } else {
      if (currentStep === 3) return formData.tagline.trim() !== '';
    }
    return true;
  };

  const getTotalSteps = () => {
    return formData.siteType === 'political' ? 5 : 4; // Political has extra candidate name step
  };

  const filteredTemplates = formData.siteType ? getTemplatesBySiteType(formData.siteType) : pageTemplates;

  if (!isOpen) return null;

  const totalSteps = getTotalSteps();
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Progress Bar */}
        <div className="px-8 pt-6">
          <div className="flex gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-red-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Step 0: Site Type Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of site are you building?</h2>
                <p className="text-gray-600">Choose the category that best fits your needs.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateFormData('siteType', 'political')}
                  className={`p-6 border-2 rounded-lg transition-all text-left ${
                    formData.siteType === 'political'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <Flag className={`w-8 h-8 mb-3 ${formData.siteType === 'political' ? 'text-red-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg mb-1">For Political Use</h3>
                  <p className="text-sm text-gray-600">Campaigns, candidates, PACs</p>
                </button>
                <button
                  onClick={() => updateFormData('siteType', 'business')}
                  className={`p-6 border-2 rounded-lg transition-all text-left ${
                    formData.siteType === 'business'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Briefcase className={`w-8 h-8 mb-3 ${formData.siteType === 'business' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg mb-1">For My Business</h3>
                  <p className="text-sm text-gray-600">Companies, services, products</p>
                </button>
                <button
                  onClick={() => updateFormData('siteType', 'personal')}
                  className={`p-6 border-2 rounded-lg transition-all text-left ${
                    formData.siteType === 'personal'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <User className={`w-8 h-8 mb-3 ${formData.siteType === 'personal' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg mb-1">For Personal/Portfolio</h3>
                  <p className="text-sm text-gray-600">Personal brand, portfolio, blog</p>
                </button>
                <button
                  onClick={() => updateFormData('siteType', 'nonprofit')}
                  className={`p-6 border-2 rounded-lg transition-all text-left ${
                    formData.siteType === 'nonprofit'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Heart className={`w-8 h-8 mb-3 ${formData.siteType === 'nonprofit' ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg mb-1">For Nonprofit/Organization</h3>
                  <p className="text-sm text-gray-600">Charities, causes, communities</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your template</h2>
                <p className="text-gray-600">Select a design that best fits your style.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left"
                    >
                      <div
                        className="aspect-video bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${template.thumbnail})`
                        }}
                      />
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                        {selectedTemplate?.id === template.id && (
                          <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-medium">
                            <CheckCircle size={16} />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Brand Name */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.siteType === 'political' ? "What's your campaign name?" : "What's your brand name?"}
                </h2>
                <p className="text-gray-600">This will be the title of your website.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.siteType === 'political' ? 'Campaign Name' : 'Brand Name'}
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => updateFormData('brandName', e.target.value)}
                  placeholder={formData.siteType === 'political' ? 'e.g., Smith for Senate 2024' : 'e.g., My Company'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 3: Candidate Name (Political Only) */}
          {currentStep === 3 && formData.siteType === 'political' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Who's the candidate?</h2>
                <p className="text-gray-600">The name of the person running for office.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => updateFormData('candidateName', e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 3 OR 4: Tagline (depends on site type) */}
          {((currentStep === 3 && formData.siteType !== 'political') || (currentStep === 4 && formData.siteType === 'political')) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.siteType === 'political' ? "What's your campaign tagline?" : "What's your tagline?"}
                </h2>
                <p className="text-gray-600">A short, memorable phrase that captures your message.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateFormData('tagline', e.target.value)}
                  placeholder={formData.siteType === 'political' ? 'e.g., Fighting for American Values' : 'e.g., Your Success, Our Mission'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Back
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceed()
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastStep ? (
                <>
                  Create Website
                  <CheckCircle size={18} />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{previewTemplate.name}</h2>
                <p className="text-sm text-gray-600">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <TemplatePreview template={previewTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Template Preview Component
const TemplatePreview: React.FC<{ template: PageTemplate }> = ({ template }) => {
  const { loadPage: loadPageToStore } = useEditorStore();

  // Temporarily load the template for preview
  React.useEffect(() => {
    const currentState = useEditorStore.getState();
    const restoreState = {
      components: currentState.components,
      theme: currentState.theme,
      pageName: currentState.pageName,
    };

    loadPageToStore({
      id: 'preview',
      name: template.name,
      components: template.components,
      theme: template.theme,
    });

    return () => {
      loadPageToStore({
        id: 'preview',
        name: restoreState.pageName,
        components: restoreState.components,
        theme: restoreState.theme,
      });
    };
  }, [template, loadPageToStore]);

  return (
    <div className="bg-gray-100 min-h-full">
      <Canvas />
    </div>
  );
};
