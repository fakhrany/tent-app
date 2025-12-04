'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewDeveloperPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    nameAr: '',
    slug: '',
    country: 'Egypt',
    establishedYear: new Date().getFullYear(),
    verified: false,
    
    // Step 2: Contact & Links
    website: '',
    email: '',
    phone: '',
    
    // Step 3: Description
    description: '',
    descriptionAr: '',
    
    // Step 4: Logo
    logo: '',
  });

  const steps = [
    { id: 1, name: 'Basic Information', description: 'Company name and details' },
    { id: 2, name: 'Contact & Links', description: 'Website and contact information' },
    { id: 3, name: 'Description', description: 'Company description and history' },
    { id: 4, name: 'Logo & Media', description: 'Upload company logo' },
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // TODO: Add tRPC mutation to save developer
    console.log('Saving developer:', formData);
    
    setTimeout(() => {
      setSaving(false);
      router.push('/admin/developers');
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.nameAr && formData.slug;
      case 2:
        return formData.website;
      case 3:
        return formData.description;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/developers"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Add New Developer</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the developer information step by step
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-card border border-border rounded-xl p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the developer's basic information in both English and Arabic
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Company Name (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Emaar Misr"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Company Name (Arabic) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => updateField('nameAr', e.target.value)}
                  placeholder="مثال: إعمار مصر"
                  dir="rtl"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                URL Slug <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="emaar-misr"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in URLs: /developers/{formData.slug || 'slug'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Egypt">Egypt</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Qatar">Qatar</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => updateField('establishedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => updateField('verified', e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
                Mark as verified developer (shows checkmark badge)
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Contact & Links */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact & Links</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add website and contact information for the developer
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Website URL <span className="text-destructive">*</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://www.emaar.com"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="info@developer.com"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+20 123 456 7890"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Description */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Provide detailed information about the developer's history and projects
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (English) <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Enter a detailed description of the developer..."
                rows={6}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Arabic)</label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => updateField('descriptionAr', e.target.value)}
                placeholder="أدخل وصفًا تفصيليًا للمطور..."
                rows={6}
                dir="rtl"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.descriptionAr.length} characters
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Logo & Media */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Logo & Media</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload the developer's logo and brand assets
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Logo</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or SVG (max. 2MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload
                    console.log('File selected:', e.target.files?.[0]);
                  }}
                />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Logo Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Square format (1:1 ratio) works best</li>
                <li>• Minimum resolution: 400x400 pixels</li>
                <li>• Transparent background (PNG) recommended</li>
                <li>• File size should not exceed 2MB</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          Previous
        </button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} strokeWidth={2} />
                Save Developer
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
