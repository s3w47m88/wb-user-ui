"use client";

import React, { useState } from "react";
import { CheckCircle, Eye, Globe, Link2, ChevronRight } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { pageTemplates, PageTemplate } from "@/lib/templates";
import { Canvas } from "./Canvas";

type OnboardingWizardProps = {
  isOpen: boolean;
  onComplete: () => void;
};

type FormData = {
  siteName: string;
  domain: string;
  useTemporaryDomain: boolean;
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    siteName: "",
    domain: "",
    useTemporaryDomain: true,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(
    null,
  );
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(
    null,
  );
  const { loadPage: loadPageToStore } = useEditorStore();

  const updateFormData = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template: PageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleComplete = async () => {
    if (selectedTemplate) {
      const siteName = formData.siteName.trim() || selectedTemplate.name;
      const siteDomain = formData.useTemporaryDomain
        ? null
        : formData.domain.trim();

      // Apply form data to selected template
      const customizedTemplate = {
        ...selectedTemplate,
        name: siteName,
      };

      try {
        // Save to database first
        const { savePage } = await import("@/lib/page-service");
        const savedPage = await savePage({
          name: siteName || "My Site",
          components: customizedTemplate.components,
          theme: customizedTemplate.theme,
          site_domain: siteDomain || undefined,
          use_temporary_domain: formData.useTemporaryDomain,
        });

        // Then load into store
        loadPageToStore(savedPage);
      } catch (error) {
        console.error("Failed to create site:", error);
        alert("Failed to create site. Please try again.");
        return;
      }
    }
    onComplete();
  };

  const canProceed = () => {
    if (currentStep === 0) {
      if (!formData.siteName.trim()) return false;
      if (!formData.useTemporaryDomain && !formData.domain.trim()) return false;
      return true;
    }
    if (currentStep === 1) return selectedTemplate !== null;
    return false;
  };

  const filteredTemplates = pageTemplates.slice(0, 2);

  if (!isOpen) return null;

  const totalSteps = 2;
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
                  index <= currentStep ? "bg-red-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Step 0: Create Site */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your First Site
                </h2>
                <p className="text-gray-600">
                  Give your site a name and choose a domain.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    value={formData.siteName}
                    onChange={(e) => updateFormData("siteName", e.target.value)}
                    placeholder="Example: The Portland Company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="radio"
                      id="temp-domain"
                      checked={formData.useTemporaryDomain}
                      onChange={() =>
                        updateFormData("useTemporaryDomain", true)
                      }
                    />
                    <label htmlFor="temp-domain" className="flex-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          I don&apos;t have one yet
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Create a temporary domain for me.
                      </p>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="radio"
                      id="custom-domain"
                      checked={!formData.useTemporaryDomain}
                      onChange={() =>
                        updateFormData("useTemporaryDomain", false)
                      }
                    />
                    <label htmlFor="custom-domain" className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          I have a domain
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        I want to use my custom domain.
                      </p>
                    </label>
                  </div>
                </div>

                {!formData.useTemporaryDomain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domain
                    </label>
                    <input
                      value={formData.domain}
                      onChange={(e) => updateFormData("domain", e.target.value)}
                      placeholder="yourdomain.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose a Template Theme
                </h2>
                <p className="text-gray-600">
                  Pick from the two available themes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left"
                    >
                      <div
                        className="aspect-video bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${template.thumbnail})`,
                        }}
                      />
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{template.name}</h4>
                        <p className="text-xs text-gray-600">
                          {template.description}
                        </p>
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

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-gray-900"
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
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                <p className="text-sm text-gray-600">
                  {previewTemplate.description}
                </p>
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
const TemplatePreview: React.FC<{ template: PageTemplate }> = ({
  template,
}) => {
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
      id: "preview",
      name: template.name,
      components: template.components,
      theme: template.theme,
    });

    return () => {
      loadPageToStore({
        id: "preview",
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
