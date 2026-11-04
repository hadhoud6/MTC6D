"use client";

import { memo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import type { Locale } from "@/types/content";
import { localized } from "@/types/content";
import CatalogueImageCarousel from "@/components/home/CatalogueImageCarousel";
import FadeInSection from "@/components/common/FadeInSection";

const ProjectCard = memo(function ProjectCard({
  project,
  locale,
  expanded,
  onToggle,
}: {
  project: Project;
  locale: Locale;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const title = localized(project.title, locale);
  const category = localized(project.category, locale);
  const description = localized(project.description, locale);
  const location = project.location ? localized(project.location, locale) : null;
  const handleToggle = useCallback(() => onToggle(project.id), [onToggle, project.id]);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ${expanded ? "md:col-span-2 lg:col-span-2" : "cursor-pointer"}`}
      onClick={() => {
        if (!expanded) handleToggle();
      }}
    >
      <CatalogueImageCarousel
        images={project.images}
        alt={title}
        expanded={expanded}
        onToggle={handleToggle}
      />
      <div className="p-4 md:p-5">
        <div className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-0.5 font-serif text-xs text-white">
          {category}
        </div>
        <h3 className="mb-1 font-display text-base font-bold text-brand-dark md:text-lg">
          {title}
        </h3>
        {location ? (
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-text-muted">
            {location}
          </p>
        ) : null}
        <p className="font-serif text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </article>
  );
});

export default function ProjectsPageContent({ locale }: { locale: Locale }) {
  const t = useTranslations("projets");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((previous) => (previous === id ? null : id));
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:px-8">
      <FadeInSection>
        <header className="mb-8 text-center md:mb-10">
          <h1 className="font-display text-3xl font-bold text-brand-dark sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl font-serif text-base leading-relaxed text-text-muted md:text-lg">
            {t("description")}
          </p>
        </header>
      </FadeInSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            expanded={expandedId === project.id}
            onToggle={toggleExpanded}
          />
        ))}
      </div>
    </div>
  );
}
