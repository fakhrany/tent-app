'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Building2, ExternalLink, CheckCircle } from 'lucide-react';

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with actual tRPC query
  const developers = [
    { 
      id: 1, 
      name: 'Emaar Misr', 
      nameAr: 'إعمار مصر',
      country: 'Egypt',
      establishedYear: 2012,
      verified: true,
      projectsCount: 3,
      logo: '🏢'
    },
    { 
      id: 2, 
      name: 'Sodic', 
      nameAr: 'سوديك',
      country: 'Egypt',
      establishedYear: 1996,
      verified: true,
      projectsCount: 2,
      logo: '🏛️'
    },
    { 
      id: 3, 
      name: 'Hyde Park', 
      nameAr: 'هايد بارك',
      country: 'Egypt',
      establishedYear: 2007,
      verified: true,
      projectsCount: 1,
      logo: '🌳'
    },
  ];

  const filteredDevelopers = developers.filter(dev =>
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.nameAr.includes(searchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Developers</h1>
          <p className="text-sm text-muted-foreground">
            Manage real estate developers and their information
          </p>
        </div>
        <Link
          href="/admin/developers/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={20} strokeWidth={2} />
          Add Developer
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
        <Search size={20} className="text-muted-foreground" strokeWidth={2} />
        <input
          type="text"
          placeholder="Search developers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevelopers.map((developer) => (
          <div
            key={developer.id}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                  {developer.logo}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {developer.name}
                    {developer.verified && (
                      <CheckCircle size={16} className="text-primary" strokeWidth={2} />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{developer.nameAr}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Country:</span>
                <span className="font-medium">{developer.country}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Established:</span>
                <span className="font-medium">{developer.establishedYear}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects:</span>
                <span className="font-medium">{developer.projectsCount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/admin/developers/${developer.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit size={16} strokeWidth={2} />
                Edit
              </Link>
              <button className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors">
                <Trash2 size={16} strokeWidth={2} />
              </button>
              <Link
                href={`/admin/developers/${developer.id}`}
                className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <ExternalLink size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDevelopers.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium mb-2">No developers found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Get started by adding your first developer'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/developers/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Plus size={18} strokeWidth={2} />
              Add Developer
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
