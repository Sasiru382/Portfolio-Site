import { notFound } from 'next/navigation';
import { projects } from '../../../content/projects';
import { CaseStudy } from '../../../components/case-study';
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  if (!project) notFound();
  return <CaseStudy project={project}/>;
}
