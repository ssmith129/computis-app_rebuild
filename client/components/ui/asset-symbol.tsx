import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AssetSymbol
 *
 * Single source of truth for rendering a crypto asset glyph/ticker
 * (e.g. "₿", "Ξ", "BTC"). Encapsulates the monospace face and the
 * tokenized asset color (`--asset-symbol`) so the styling never
 * re-accrues as inline `font-mono text-orange-500` literals.
 */
export interface AssetSymbolProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** The glyph or ticker to render. */
  symbol: React.ReactNode;
}

const AssetSymbol = React.forwardRef<HTMLSpanElement, AssetSymbolProps>(
  ({ symbol, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-mono text-asset", className)}
        {...props}
      >
        {symbol}
      </span>
    );
  },
);
AssetSymbol.displayName = "AssetSymbol";

export { AssetSymbol };
