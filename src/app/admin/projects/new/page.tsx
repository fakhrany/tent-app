'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Upload, CheckCircle, MapPin, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    nameAr: '',
    slug: '',
    developerId: '',
    
    // Step 2: Location
    city: '',
    cityAr: '',
    district: '',
    districtAr: '',
    lat: '',
    lng: '',
    
    // Step 3: Project Details
    deliveryDate: '',
    completionStatus: 'planning' as 'planning' | 'construction' | 'ready' | 'completed',
    totalUnits: 0,
    featured: false,
    
    // Step 4: Amenities
    amenities: [] as string[],
    amenitiesAr: [] as string[],
    
    // Step 5: Description & Media
    description: '',
    descriptionAr: '',
    masterPlan: '',
    images: [] as string[],
    videoUrl: '',
  });

  // Sample developers - replace with actual tRPC query
  const developers = [
    { id: '1', name: 'Emaar Misr' },
    { id: '2', name: 'Sodic' },
    { id: '3', name: 'Hyde Park' },
  ];

  const predefinedAmenities = [
    { en: 'Swimming Pool', ar: 'حمام سباحة' },
    { en: 'Gym', ar: 'صالة رياضية' },
    { en: 'Kids Area', ar: 'منطقة أطفال' },
    { en: 'Security', ar: 'أمن' },
    { en: 'Parking', ar: 'موقف سيارات' },
    { en: 'Garden', ar: 'حديقة' },
    { en: 'Club House', ar: 'نادي' },
    { en: 'Retail Area', ar: 'منطقة تجارية' },
    { en: 'Mosque', ar: 'مسجد' },
    { en: 'Medical Center', ar: 'مركز طبي' },
    { en: 'School', ar: 'مدرسة' },
    { en: 'Sports Courts', ar: 'ملاعب رياضية' },
  ];

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Project name and developer' },
    { id: 2, name: 'Location', description: 'City, district, and coordinates' },
    { id: 3, name: 'Project Details', description: 'Delivery and completion status' },
    { id: 4, name: 'Amenities', description: 'Project amenities and features' },
    { id: 5, name: 'Description & Media', description: 'Details and images' },
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const toggleAmenity = (amenity: { en: string; ar: string }) => {
    const hasAmenity = formData.amenities.includes(amenity.en);
    
    if (hasAmenity) {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== amenity.en),
        amenitiesAr: prev.amenitiesAr.filter(a => a !== amenity.ar),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity.en],
        amenitiesAr: [...prev.amenitiesAr, amenity.ar],
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    console.log('Saving project:', formData);
    
    setTimeout(() => {
      setSaving(false);
      router.push('/admin/projects');
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.nameAr && formData.developerId;
      case 2:
        return formData.city && formData.district;
      case 3:
        return formData.deliveryDate && formData.totalUnits > 0;
      case 4:
        return formData.amenities.length > 0;
      case 5:
        return formData.description;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Add New Project</h1>
          <p className="text-sm text-muted-foreground">
            Create a new development project or compound
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1 min-w-[120px]">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.id ? 'bg-primary text-primary-foreground' :
                    currentStep === step.id ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium whitespace-nowrap ${currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.name}
                  </p>
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
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the project's basic details and select the developer
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Developer <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.developerId}
                onChange={(e) => updateField('developerId', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Choose a developer...</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Name (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Uptown Cairo"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Name (Arabic) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => updateField('nameAr', e.target.value)}
                  placeholder="مثال: أب تاون القاهرة"
                  dir="rtl"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="uptown-cairo"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Location Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Specify the project location and coordinates for map display
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  City (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g., New Cairo"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">City (Arabic)</label>
                <input
                  type="text"
                  value={formData.cityAr}
                  onChange={(e) => updateField('cityAr', e.target.value)}
                  placeholder="القاهرة الجديدة"
                  dir="rtl"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  District (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g., Fifth Settlement"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">District (Arabic)</label>
                <input
                  type="text"
                  value={formData.districtAr}
                  onChange={(e) => updateField('districtAr', e.target.value)}
                  placeholder="التجمع الخامس"
                  dir="rtl"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1">Map Coordinates</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Enter the latitude and longitude for precise map location. You can get these from Google Maps.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Latitude</label>
                      <input
                        type="text"
                        value={formData.lat}
                        onChange={(e) => updateField('lat', e.target.value)}
                        placeholder="30.0131"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Longitude</label>
                      <input
                        type="text"
                        value={formData.lng}
                        onChange={(e) => updateField('lng', e.target.value)}
                        placeholder="31.4748"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Project Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Specify delivery timeline and project status
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Delivery Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => updateField('deliveryDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Total Units <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={formData.totalUnits || ''}
                  onChange={(e) => updateField('totalUnits', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 500"
                  min="1"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Completion Status</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'planning', label: 'Planning', emoji: '📋' },
                  { value: 'construction', label: 'Construction', emoji: '🏗️' },
                  { value: 'ready', label: 'Ready', emoji: '✅' },
                  { value: 'completed', label: 'Completed', emoji: '🎉' },
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => updateField('completionStatus', status.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.completionStatus === status.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{status.emoji}</div>
                    <div className="text-sm font-medium">{status.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                Mark as featured project (appears first in search results)
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Amenities */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Project Amenities</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select all amenities and facilities available in the project
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedAmenities.map((amenity, idx) => {
                const isSelected = formData.amenities.includes(amenity.en);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{amenity.en}</span>
                      {isSelected && <CheckCircle size={16} className="text-primary" strokeWidth={2} />}
                    </div>
                    <div className="text-xs text-muted-foreground">{amenity.ar}</div>
                  </button>
                );
              })}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Selected Amenities ({formData.amenities.length})</p>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
                {formData.amenities.length === 0 && (
                  <span className="text-sm text-muted-foreground">No amenities selected yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Description & Media */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Description & Media</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add project description and upload images
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (English) <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Enter a detailed description..."
                rows={6}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Arabic)</label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => updateField('descriptionAr', e.target.value)}
                placeholder="أدخل وصفًا تفصيليًا..."
                rows={6}
                dir="rtl"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Images</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium mb-1">Upload project images</p>
                <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB each)</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (optional)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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
            disabled={saving || !canProceed()}
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
                Save Project
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
