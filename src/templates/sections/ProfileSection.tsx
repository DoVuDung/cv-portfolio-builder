import React from 'react'
import type { Profile, Contact } from '../../types/cv.types'

interface ProfileSectionProps {
  data: Profile
}

export const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ data }) => {
  if (!data) return null

  return (
    <section className="profile-section">
      <div className="profile-header">
        <h1 className="profile-name">{data.name}</h1>
        <p className="profile-title">{data.title}</p>
      </div>

      {data.summary && (
        <div className="profile-summary">
          <p>{data.summary}</p>
        </div>
      )}

      <div className="profile-contact">
        {data.location && <span className="contact-item location">{data.location}</span>}

        {data.contact.email && (
          <a href={`mailto:${data.contact.email}`} className="contact-item email">
            {data.contact.email}
          </a>
        )}

        {data.contact.phone && (
          <a href={`tel:${data.contact.phone}`} className="contact-item phone">
            {data.contact.phone}
          </a>
        )}

        {data.contact.github && (
          <a
            href={
              data.contact.github.startsWith('http')
                ? data.contact.github
                : `https://github.com/${data.contact.github}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item github"
          >
            {data.contact.github}
          </a>
        )}

        {data.contact.linkedin && (
          <a
            href={
              data.contact.linkedin.startsWith('http')
                ? data.contact.linkedin
                : `https://linkedin.com/in/${data.contact.linkedin}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item linkedin"
          >
            {data.contact.linkedin}
          </a>
        )}

        {data.contact.portfolio && (
          <a
            href={
              data.contact.portfolio.startsWith('http')
                ? data.contact.portfolio
                : `https://${data.contact.portfolio}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item portfolio"
          >
            {data.contact.portfolio}
          </a>
        )}
      </div>
    </section>
  )
})

ProfileSection.displayName = 'ProfileSection'
