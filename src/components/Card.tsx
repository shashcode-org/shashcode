import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  bordered?: boolean;
}

const Card = ({
  children,
  className,
  hover = false,
  glass = false,
  bordered = true,
}: CardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow",
        bordered && "border border-border",
        hover && "card-hover",
        glass && "card-glass",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-5 border-b border-border", className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h3 className={cn("text-xl font-bold", className)}>{children}</h3>;
};

export const CardContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-5", className)}>{children}</div>;
};

export const CardFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("p-5 border-t border-border bg-muted/50", className)}>{children}</div>
  );
};

export default Card;
