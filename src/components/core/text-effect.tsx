"use client";

import React, { useMemo } from "react";
import {
  motion,
  type Variants,
  type TargetAndTransition,
  type UseInViewOptions,
} from "framer-motion";

export type PresetType = "blur" | "slide" | "fade" | "scale";
export type PerType = "word" | "char" | "line";

export type TextEffectVariants = {
  container?: Variants;
  item?: Variants;
};

export interface TextEffectProps {
  children: string | string[];
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements | React.ElementType;
  preset?: PresetType | string;
  delay?: number;
  variants?: TextEffectVariants;
  className?: string;
  style?: React.CSSProperties;
  segmentWrapperClassName?: string;
  viewport?: UseInViewOptions;
  onAnimationComplete?: () => void;
  trigger?: boolean;
}

const defaultItemVariants: Record<string, Variants> = {
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  },
};

export function TextEffect({
  children,
  per = "word",
  as = "p",
  preset = "slide",
  delay = 0,
  variants,
  className,
  style,
  segmentWrapperClassName,
  viewport = { once: true },
  onAnimationComplete,
  trigger,
}: TextEffectProps) {
  const MotionTag = useMemo(() => {
    if (typeof as === "string" && as in motion) {
      return (motion as unknown as Record<string, React.ElementType>)[as];
    }
    return motion.create(as as React.ComponentType);
  }, [as]);

  const staggerTime = per === "char" ? 0.03 : per === "word" ? 0.05 : 0.1;

  const containerVariants: Variants = useMemo(() => {
    if (variants?.container) {
      return variants.container;
    }

    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerTime,
          delayChildren: delay,
        },
      },
    };
  }, [variants?.container, staggerTime, delay]);

  const itemVariants: Variants = useMemo(() => {
    if (variants?.item) {
      return variants.item;
    }
    return defaultItemVariants[preset] || defaultItemVariants.slide;
  }, [variants?.item, preset]);

  const text = Array.isArray(children) ? children.join("") : children;

  if (!text || typeof text !== "string") {
    return null;
  }

  const lines = text.split("\n");

  const renderContent = () => {
    if (per === "line") {
      return lines.map((line, index) => (
        <motion.span
          key={`line-${index}`}
          variants={itemVariants}
          className={`block ${segmentWrapperClassName || ""}`.trim()}
        >
          {line}
        </motion.span>
      ));
    }

    if (per === "char") {
      return lines.map((line, lineIndex) => (
        <span
          key={`line-${lineIndex}`}
          className={lines.length > 1 ? "block" : "inline"}
        >
          {line.split(" ").map((word, wordIndex, wordsArray) => (
            <span
              key={`word-${wordIndex}`}
              className={`inline-block whitespace-nowrap ${segmentWrapperClassName || ""}`.trim()}
            >
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={`char-${charIndex}`}
                  variants={itemVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < wordsArray.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          ))}
        </span>
      ));
    }

    // Default per === "word"
    return lines.map((line, lineIndex) => (
      <span
        key={`line-${lineIndex}`}
        className={lines.length > 1 ? "block" : "inline"}
      >
        {line.split(" ").map((word, wordIndex, wordsArray) => (
          <span
            key={`word-${wordIndex}`}
            className={`inline-block whitespace-nowrap ${segmentWrapperClassName || ""}`.trim()}
          >
            <motion.span variants={itemVariants} className="inline-block">
              {word}
            </motion.span>
            {wordIndex < wordsArray.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    ));
  };

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      {...(trigger !== undefined
        ? { animate: trigger ? "visible" : "hidden" }
        : { whileInView: "visible", viewport })}
      variants={containerVariants}
      onAnimationComplete={onAnimationComplete}
    >
      {renderContent()}
    </MotionTag>
  );
}

export default TextEffect;
