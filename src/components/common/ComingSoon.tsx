import { getTranslations } from "next-intl/server";
import GhostButton from "@/components/common/GhostButton";

export default async function ComingSoon() {
  const t = await getTranslations("comingSoon");

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold text-brand-dark">{t("title")}</h1>
      <p className="mt-4 max-w-md text-lg text-text-muted">{t("description")}</p>
      <div className="mt-8">
        <GhostButton href="/" variant="black" size="md">
          {t("backHome")}
        </GhostButton>
      </div>
    </section>
  );
}
