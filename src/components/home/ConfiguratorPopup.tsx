"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/routing";
import GhostButton from "@/components/common/GhostButton";
import ModalPortal from "@/components/common/ModalPortal";
import {
  configuratorPopupCopy,
  configuratorRooms,
  type ConfiguratorRoom,
  type ConfiguratorRoomId,
} from "@/data/configuratorRooms";
import type { Locale } from "@/types/content";
import { localized } from "@/types/content";

const POPUP_TRANSITION = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const };
const POPUP_OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const POPUP_PANEL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 12 },
};

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RoomCard({
  room,
  locale,
  visualizeLabel,
  onSelect,
}: {
  room: ConfiguratorRoom;
  locale: Locale;
  visualizeLabel: string;
  onSelect: (id: ConfiguratorRoomId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const name = localized(room.name, locale);
  const description = localized(room.description, locale);

  const handleSelect = () => onSelect(room.id);

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        scale: hovered ? 1.03 : 1,
        boxShadow: hovered
          ? "0 24px 48px rgba(0, 0, 0, 0.45)"
          : "0 8px 24px rgba(0, 0, 0, 0.25)",
      }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-[#262626] text-left"
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
          aria-hidden
        />
        <h3 className="pointer-events-none absolute bottom-4 left-4 right-4 font-display text-2xl font-bold text-white drop-shadow-md md:text-3xl">
          {name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5 md:px-5 md:pb-5 md:pt-6">
        <p className="text-sm leading-snug text-white/80 md:text-[0.95rem]">
          {description}
        </p>
        <ul className="mt-4 space-y-2">
          {room.bullets.map((bullet) => (
            <li
              key={localized(bullet, locale)}
              className="flex items-start gap-2.5 text-sm text-white/70"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ef5d36]"
                aria-hidden
              />
              {localized(bullet, locale)}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <GhostButton
            variant="orange"
            size="md"
            rounded="xl"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            {visualizeLabel}
          </GhostButton>
        </div>
      </div>
    </motion.article>
  );
}

export default function ConfiguratorPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("configurator.popup");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<ConfiguratorRoomId | null>(
    null,
  );

  // The kitchen has a working 3D scene; the other rooms are still to come.
  const handleSelect = useCallback(
    (id: ConfiguratorRoomId) => {
      if (id === "kitchen") {
        router.push("/configurateur-3d");
        return;
      }
      setSelectedRoom(id);
    },
    [router],
  );

  const handleClose = useCallback(() => {
    setSelectedRoom(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setSelectedRoom(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  const selectedRoomData = selectedRoom
    ? configuratorRooms.find((r) => r.id === selectedRoom)
    : null;
  const selectedRoomLabel = selectedRoomData
    ? localized(selectedRoomData.name, locale)
    : "";

  const popupTitle = localized(configuratorPopupCopy.title, locale);
  const popupSubtitle = localized(configuratorPopupCopy.subtitle, locale);
  const visualizeLabel = localized(configuratorPopupCopy.visualizeCta, locale);

  return (
    <ModalPortal>
      <AnimatePresence>
        {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="configurator-popup-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-4 md:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={POPUP_OVERLAY_VARIANTS}
          transition={POPUP_TRANSITION}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl md:rounded-3xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={POPUP_PANEL_VARIANTS}
            transition={POPUP_TRANSITION}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="relative shrink-0 px-5 pb-2 pt-8 text-center md:px-10 md:pt-10">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:border-brand-orange hover:bg-brand-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/60 md:right-6 md:top-6"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
              <h2
                id="configurator-popup-title"
                className="font-display text-3xl font-bold text-white md:text-4xl lg:text-[2.75rem]"
              >
                {popupTitle}
              </h2>
              <p className="mt-3 font-serif text-base text-white/75 md:text-lg">
                {popupSubtitle}
              </p>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:px-10">
              <AnimatePresence mode="wait">
                {selectedRoom === null ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5 lg:gap-6 xl:grid-cols-4 xl:gap-5"
                  >
                    {configuratorRooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        locale={locale}
                        visualizeLabel={visualizeLabel}
                        onSelect={handleSelect}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto flex max-w-lg flex-col items-center py-8 text-center md:py-12"
                  >
                    <p className="font-serif text-lg leading-relaxed text-white/90 md:text-xl">
                      {t("selectedMessage", { room: selectedRoomLabel })}
                    </p>
                    <div className="mt-10">
                      <GhostButton
                        variant="orange"
                        size="lg"
                        onClick={() => setSelectedRoom(null)}
                      >
                        {t("back")}
                      </GhostButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  );
}
