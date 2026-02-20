"use client";

import { useState, useRef, useEffect, useId } from "react";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );
  const id = useId();
  const headingId = `accordion-heading-${id}`;
  const panelId = `accordion-panel-${id}`;

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        setHeight(el.scrollHeight);
        const timer = setTimeout(() => setHeight(undefined), 250);
        return () => clearTimeout(timer);
      }
    } else {
      const el = contentRef.current;
      if (el) {
        setHeight(el.scrollHeight);
        requestAnimationFrame(() => {
          setHeight(0);
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-200">
      <h3>
        <button
          id={headingId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-5 px-1 text-left text-lg font-semibold text-navy-900 hover:text-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2"
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        ref={contentRef}
        style={{
          height: height !== undefined ? `${height}px` : "auto",
          overflow: "hidden",
          transition: "height 250ms ease-in-out",
        }}
      >
        <div className="pb-6 px-1 text-gray-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
