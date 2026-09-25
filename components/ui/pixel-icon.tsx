import type { ReactNode, SVGProps } from "react";

/**
 * Pixel-art icons (paths from pixelarticons, MIT). Same export names as the
 * lucide icons they replace, so call sites only swap the import.
 */
type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const PATHS = {
  ArrowRight: ["M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2z", "M14 15V7h2v8zm-2 2V5h2v12z"],
  ArrowLeft: ["M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2z", "M10 15V7H8v8zm2 2V5h-2v12z"],
  ArrowUpRight: ["M11 5H5v2h6V5ZM5 7H3v12h2V7Zm12 12H5v2h12v-2Zm2-6h-2v6h2v-6Zm-8 0H9v2h2v-2Zm2-2h-2v2h2v-2Zm2-2h-2v2h2V9Zm2-2h-2v2h2V7Zm2-2h-2v2h2V5Zm2-2h-2v8h2V3Z", "M21 3h-8v2h8V3Z"],
  Phone: ["M4 1h5v2H4zm5 2h2v4H9zM7 7h2v4H7zm-3 5h2v2H4zM2 3h2v9H2zm7 8h2v2H9zm2 2h2v2h-2zm2 2h4v2h-4zm4-2h4v2h-4zm4 2h2v5h-2zM6 14h2v2H6zm2 2h2v2H8zm2 2h2v2h-2zm2 2h9v2h-9z"],
  PhoneCall: ["M4 1h5v2H4zm5 2h2v4H9zM7 7h2v4H7zm-3 5h2v2H4zM2 3h2v9H2zm7 8h2v2H9zm2 2h2v2h-2zm2 2h4v2h-4zm4-2h4v2h-4zm4 2h2v5h-2zM6 14h2v2H6zm2 2h2v2H8zm2 2h2v2h-2zm2 2h9v2h-9zm1-18h5v2h-5zm7 4h2v5h-2zm-2-2h2v2h-2zm-5 2h3v2h-3zm3 2h2v3h-2z"],
  Check: ["M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z"],
  RotateCcw: ["M16 4h2v6h-2zm-2-2h2v2h-2zm0 2h2v8h-2zM4 8H2v5h2z", "M4 6h16v2H4zm4 14H6v-6h2zm2 2H8v-2h2zm0-2H8v-8h2zm10-4h2v-5h-2z", "M20 18H4v-2h16z"],
  Plus: ["M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2v7Z"],
  Menu: ["M20 18H4v-2h16v2Zm0-5H4v-2h16v2Zm0-5H4V6h16v2Z"],
  Mail: ["M6 8h2v2H6zm2 2h2v2H8zm10-2h-2v2h2zm-2 2h-2v2h2zm-6 2h4v2h-4zM2 6h2v12H2zm18 0h2v12h-2zM4 4h16v2H4zm0 14h16v2H4z"],
  X: ["M7 19H5V17H7V19ZM19 19H17V17H19V19ZM9 15V17H7V15H9ZM17 17H15V15H17V17ZM11 15H9V13H11V15ZM15 15H13V13H15V15ZM13 13H11V11H13V13ZM11 11H9V9H11V11ZM15 11H13V9H15V11ZM9 9H7V7H9V9ZM17 9H15V7H17V9ZM7 7H5V5H7V7ZM19 7H17V5H19V7Z"],
  MapPin: ["M7 2h10v2H7zM5 4h2v2H5zm14 0h-2v2h2zM7 17h2v2H7zm2 2h2v2H9zm6-2h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm-6-7h2v3H5zm12 0h2v3h-2zM3 6h2v8H3zm18 0h-2v8h2zM10 6h4v2h-4zM8 8h2v4H8zm2 4h4v2h-4zm4-4h2v4h-2z"],
  Linkedin: ["M7 22H1V8h6v14Zm12-12h-8v10h2v-8h4v2h-2v8H9V8h10v2Zm4 12h-6v-8h2v6h2v-8h2v10ZM3 20h2V10H3v10Zm18-8h-2v-2h2v2ZM5 7H3V5h2v2ZM3 5H1V3h2v2Zm4 0H5V3h2v2ZM5 3H3V1h2v2Z"],
  ChevronDown: ["M13 16h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 10H5V8h2v2Zm12 0h-2V8h2v2Z"],
  Clock: ["M6 2h12v2H6zM2 6h2v12H2zm18 0h2v12h-2zm-2-2h2v2h-2zM4 4h2v2H4zm2 18h12v-2H6zm12-2h2v-2h-2zM4 20h2v-2H4zm7-14h2v7h-2zm2 7h2v2h-2zm2 2h2v2h-2z"],
  Zap: ["M4 13h8v6h2v2h-2v2h-2v-8H2v-4h2v2Zm12 6h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2v-2h2v2Zm-6-6h8v4h-2v-2h-8V5h-2V3h2V1h2v8Zm-8 2H4V9h2v2Zm2-2H6V7h2v2Zm2-2H8V5h2v2Z"],
  Shield: ["M4 2h16v2H4zM2 4h2v10H2zm18 0h2v10h-2zM4 14h2v2H4zm2 2h2v2H6zm4 4h4v2h-4zm10-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm-6 0H8v2h2z"],
  Lightbulb: ["M9 4h6v2H9zM7 6h2v2H7zm8 0h2v2h-2zm4-2h2v2h-2zm2-2h2v2h-2zM0 10h3v2H0zm21 0h3v2h-3zM3 4h2v2H3zM1 2h2v2H1zm6 12h2v2H7zm8 0h2v2h-2zM5 8h2v6H5zm12 0h2v6h-2zm-8 8h6v2H9zm0 4h6v2H9zm0-2h2v2H9zm4 0h2v2h-2zM11 0h2v3h-2z"],
  CornerDownLeft: ["M20 4h-2v10h2V4zm-4 12v-2h2v2h-2zm-2 2v-2h2v2h-2zm-2 2v-2h2v2h-2zm-2-2h2v2h-2v-2zm-2-2h2v2H8v-2zm-2-2h2v2H6v-2zm14 0h-4v2h4v-2zm-8 0H10v2h2v-2z"],
} as const;

export type PixelIconName = keyof typeof PATHS;

function make(name: PixelIconName) {
  const Icon = ({ className = "", ...rest }: IconProps): ReactNode => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={`inline-block ${className}`}
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const ArrowRight = make("ArrowRight");
export const ArrowLeft = make("ArrowLeft");
export const ArrowUpRight = make("ArrowUpRight");
export const Phone = make("Phone");
export const PhoneCall = make("PhoneCall");
export const Check = make("Check");
export const RotateCcw = make("RotateCcw");
export const Plus = make("Plus");
export const Menu = make("Menu");
export const Mail = make("Mail");
export const X = make("X");
export const MapPin = make("MapPin");
export const Linkedin = make("Linkedin");
export const ChevronDown = make("ChevronDown");
export const Clock = make("Clock");
export const Zap = make("Zap");
export const Shield = make("Shield");
export const Lightbulb = make("Lightbulb");
export const CornerDownLeft = make("CornerDownLeft");
