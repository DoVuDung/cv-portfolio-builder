import React from 'react'
import type { Profile } from '@/agent/schemas/cv.schema'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface ProfileSectionProps {
  data: Profile
  onChange: (data: Profile) => void
}

export function ProfileSection({ data, onChange }: ProfileSectionProps) {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="title">Professional Title *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Senior Software Engineer"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary *</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Experienced professional with..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="San Francisco, CA"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.contact.email}
            onChange={(e) => onChange({ ...data, contact: { ...data.contact, email: e.target.value } })}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.contact.phone || ''}
            onChange={(e) => onChange({ ...data, contact: { ...data.contact, phone: e.target.value } })}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={data.contact.github || ''}
            onChange={(e) => onChange({ ...data, contact: { ...data.contact, github: e.target.value } })}
            placeholder="johndoe"
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={data.contact.linkedin || ''}
            onChange={(e) => onChange({ ...data, contact: { ...data.contact, linkedin: e.target.value } })}
            placeholder="johndoe"
          />
        </div>

        <div>
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input
            id="portfolio"
            value={data.contact.portfolio || ''}
            onChange={(e) => onChange({ ...data, contact: { ...data.contact, portfolio: e.target.value } })}
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </div>
  )
}
