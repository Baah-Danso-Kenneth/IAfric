import ExperiencePage from '@/components/views/experience-page'
import { PageProps } from '@/types/regular.dt';
import React from 'react'

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const country = slug;

  return {
    title: `${country.charAt(0).toUpperCase() + country.slice(1)}`,
    description: `Explore exciting experiences in ${country}`
  };
}

export default async function Experience({ params }: PageProps) {
  const { slug } = await params;
  return <ExperiencePage slug={slug} />
}