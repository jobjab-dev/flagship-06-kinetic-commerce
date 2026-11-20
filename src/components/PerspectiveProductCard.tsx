"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { KineticProduct } from "@/data/products";

interface PerspectiveProductCardProps {
  product: KineticProduct;
  onOpenDetail: (product: KineticProduct) => void;
  onQuickAdd: (product: KineticProduct) => void;
}

export function PerspectiveProductCard({
  product,
  onOpenDetail,
  onQuickAdd,
}: PerspectiveProductCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 24 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const sheenX = useTransform(smoothX, [-0.5, 0.5], ["20%", "80%"]);
  const sheenY = useTransform(smoothY, [-0.5, 0.5], ["20%", "80%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.article
        layoutId={`card-shell-${product.slug}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-product-slug={product.slug}
        className="group relative flex h-full flex-col justify-between border border-hairline bg-chalk p-4 transition-colors hover:border-oxblood"
      >
        {/* Subtle 3D Specular Sheen Layer */}
        <motion.div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.45), transparent 60%)`,
          }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div>
          <button
            type="button"
            onClick={() => onOpenDetail(product)}
            className="block w-full text-left"
          >
            <motion.div
              layoutId={`card-img-${product.slug}`}
              className="aspect-[4/3] w-full overflow-hidden border border-hairline bg-stone"
            >
              <img
                src={product.image}
                alt={product.imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>

            <div className="mt-4 flex items-baseline justify-between gap-2 font-mono text-[11px] text-pewter">
              <span>{product.sku}</span>
              <span className="uppercase">{product.category}</span>
            </div>

            <motion.h2
              layoutId={`card-title-${product.slug}`}
              className="mt-1.5 font-display text-xl font-bold leading-snug tracking-tight text-obsidian group-hover:text-oxblood transition-colors"
            >
              {product.name}
            </motion.h2>
          </button>

          <p className="mt-2 text-sm leading-relaxed text-pewter line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-hairline pt-3.5">
          <span className="font-mono text-base font-semibold tabular-nums text-obsidian">
            €{product.price.toLocaleString("en-US")}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="inline-flex items-center gap-1 border border-hairline px-2.5 py-1.5 font-mono text-[11px] text-obsidian hover:border-obsidian transition-colors"
            >
              Inspect
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              className="border border-oxblood bg-oxblood px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-chalk hover:bg-oxblood-deep transition-colors"
            >
              Add +
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
