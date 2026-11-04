import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { usineMachines } from "@/data/usine";
import type { Locale } from "@/types/content";
import { localized } from "@/types/content";
import FadeInSection from "@/components/common/FadeInSection";

export default async function UsinePageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "usine" });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:px-8">
      <FadeInSection>
        <header className="mb-10 text-center md:mb-12">
          <h1 className="font-display text-3xl font-bold text-brand-dark sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-3xl font-serif text-base leading-relaxed text-text-muted md:text-lg">
            {t("description")}
          </p>
        </header>
      </FadeInSection>

      <div className="space-y-12 md:space-y-16">
        {usineMachines.map((machine, index) => {
          const title = localized(machine.title, locale);
          const category = localized(machine.category, locale);
          const description = localized(machine.description, locale);
          const [firstImage, ...restImages] = machine.images;

          return (
            <FadeInSection key={machine.id}>
              <section
                aria-labelledby={`usine-${machine.id}`}
                className="grid items-start gap-6 md:grid-cols-2 md:gap-10"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-dark/5 shadow-sm">
                    <Image
                      src={firstImage}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={index === 0 ? undefined : "lazy"}
                      priority={index === 0}
                    />
                  </div>
                  {restImages.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {restImages.map((src) => (
                        <div
                          key={src}
                          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-dark/5"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col justify-center md:pt-4">
                  <div className="mb-3 inline-block self-start rounded-full bg-brand-orange px-3 py-0.5 font-serif text-xs text-white">
                    {category}
                  </div>
                  <h2
                    id={`usine-${machine.id}`}
                    className="font-display text-2xl font-bold text-brand-dark md:text-3xl"
                  >
                    {title}
                  </h2>
                  <p className="mt-3 font-serif text-base leading-relaxed text-text-muted md:text-lg">
                    {description}
                  </p>
                </div>
              </section>
            </FadeInSection>
          );
        })}
      </div>
    </div>
  );
}
