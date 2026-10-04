import { notFound } from "next/navigation";
import { pageMetadata } from "../../../content/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  if (!project) notFound();
  return pageMetadata(project.title, project.summary, `/work/${project.slug}/`);
}
import { projects } from "../../../content/projects";
import { CaseStudy } from "../../../components/case-study";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}
