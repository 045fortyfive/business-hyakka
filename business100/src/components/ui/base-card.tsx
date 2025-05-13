import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  containerClassName?: string;
}

interface CardBadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

interface CardLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function BaseCard({ children, className, gradientBorder = true }: BaseCardProps & { gradientBorder?: boolean }) {
  return (
    <div className="p-[2px] rounded-xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className={cn("bg-white rounded-lg overflow-hidden h-full", className)}>
        {children}
      </div>
    </div>
  );
}

export function CardImageContainer({ children, className }: BaseCardProps) {
  return (
    <div className={cn("relative w-full aspect-[444/200]", className)}>
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  containerClassName,
  className,
  children,
  priority = false,
  ...props
}: CardImageProps & {
  children?: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <CardImageContainer className={containerClassName}>
      <Image
        src={src}
        alt={alt || ""}
        fill
        priority={priority}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
      {children}
    </CardImageContainer>
  );
}

export function CardContent({ children, className }: BaseCardProps) {
  return (
    <div className={cn("p-4 relative bg-gradient-to-br from-white to-gray-50", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 opacity-70"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardFooter({ children, className }: BaseCardProps) {
  return (
    <div className={cn("px-4 py-3 border-t border-gray-100", className)}>
      {children}
    </div>
  );
}

export function CardBadge({ children, className, color = "bg-gray-800" }: CardBadgeProps) {
  return (
    <div className={cn("absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg flex items-center", color, className)}>
      {children}
    </div>
  );
}

export function CardLink({ href, children, className }: CardLinkProps) {
  return (
    <Link href={href} className={cn("flex flex-col h-full", className)}>
      {children}
    </Link>
  );
}

export function CardTitle({ children, className }: BaseCardProps) {
  return (
    <h3 className={cn("text-xl font-semibold mb-2 line-clamp-2", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: BaseCardProps) {
  return (
    <p className={cn("text-sm text-gray-600 line-clamp-2 mb-2", className)}>
      {children}
    </p>
  );
}
