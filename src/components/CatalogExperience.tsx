"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ShoppingBag, X, Check } from "lucide-react";
import {
  PRODUCTS,
  type KineticProduct,
  type ProductCategory,
  type ProductFinish,
} from "@/data/products";
import { KineticHero } from "./KineticHero";
import { PerspectiveProductCard } from "./PerspectiveProductCard";
import { CartDrawer, type CartItem } from "./CartDrawer";
import { QaDrawer } from "./QaDrawer";

type CategoryFilter = "all" | ProductCategory;
type SortOption = "featured" | "price-asc" | "price-desc";
type FinishFilter = "all" | ProductFinish;

export function CatalogExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") as CategoryFilter) || "all";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const finishFilter = (searchParams.get("finish") as FinishFilter) || "all";
  const openProductSlug = searchParams.get("product") || null;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailFinish, setDetailFinish] = useState<ProductFinish>("Obsidian");
  const [toast, setToast] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.slug === openProductSlug) ?? null,
    [openProductSlug]
  );

  useEffect(() => {
    if (selectedProduct) {
      setDetailFinish(selectedProduct.defaultFinish);
    }
  }, [selectedProduct]);

  const updateQueryParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (!v || v === "all" || (k === "sort" && v === "featured")) {
          next.delete(k);
        } else {
          next.set(k, v);
        }
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Close product detail sheet on Escape key
  useEffect(() => {
    if (!selectedProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        updateQueryParams({ product: null });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProduct, updateQueryParams]);

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (finishFilter !== "all" && !p.finishes.includes(finishFilter))
        return false;
      return true;
    });

    if (sort === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [category, finishFilter, sort]);

  const addToCart = (product: KineticProduct, finish?: ProductFinish) => {
    const chosenFinish = finish ?? product.defaultFinish;
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.finish === chosenFinish
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.finish === chosenFinish
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, finish: chosenFinish, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQty = (
    productId: string,
    finish: ProductFinish,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.finish === finish
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string, finish: ProductFinish) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.finish === finish)
      )
    );
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone text-obsidian">
      {/* Gallery Header */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-chalk/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
              ATELIER KINETA
            </span>
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-pewter">
              INDUSTRIAL OBJECTS · VOL. 06
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 border border-obsidian bg-obsidian px-4 py-2 font-mono text-xs font-semibold text-chalk hover:bg-oxblood hover:border-oxblood transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>BAG ({totalBagCount})</span>
          </button>
        </div>
      </header>

      {/* Scroll-Linked Hero Motion */}
      <KineticHero />

      {/* URL-Synced Filter & Sort Bar */}
      <section className="border-b border-hairline bg-stone px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Filter objects by category"
            className="flex flex-wrap items-center gap-1.5"
          >
            {(
              [
                { id: "all", label: "All Objects" },
                { id: "lighting", label: "Lighting" },
                { id: "acoustics", label: "Acoustics" },
                { id: "desk", label: "Desk" },
              ] as const
            ).map((opt) => {
              const active = category === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateQueryParams({ category: opt.id })}
                  className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? "border-oxblood bg-oxblood text-chalk font-semibold"
                      : "border-hairline bg-chalk text-obsidian hover:border-obsidian"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={finishFilter}
              onChange={(e) => updateQueryParams({ finish: e.target.value })}
              aria-label="Filter by finish"
              className="border border-hairline bg-chalk px-3 py-1.5 font-mono text-xs text-obsidian focus:border-oxblood focus:outline-none"
            >
              <option value="all">All Finishes</option>
              <option value="Obsidian">Obsidian</option>
              <option value="Raw Stone">Raw Stone</option>
              <option value="Oxblood">Oxblood</option>
            </select>

            <select
              value={sort}
              onChange={(e) => updateQueryParams({ sort: e.target.value })}
              aria-label="Sort objects"
              className="border border-hairline bg-chalk px-3 py-1.5 font-mono text-xs text-obsidian focus:border-oxblood focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Gallery Object Grid with Shared-Element LayoutGroup */}
      <LayoutGroup>
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-8 sm:px-8">
          <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-pewter">
            <span>
              SHOWING {filteredProducts.length} ARCHITECTURAL EDITIONS
            </span>
            <span>URL-SYNCED STATE · HOVER FOR 3D PERSPECTIVE</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="border border-dashed border-hairline bg-chalk p-12 text-center">
              <p className="font-display text-xl font-bold">
                No objects match those filters
              </p>
              <button
                type="button"
                onClick={() =>
                  updateQueryParams({
                    category: null,
                    finish: null,
                    sort: null,
                  })
                }
                className="mt-4 border border-oxblood bg-oxblood px-4 py-2 font-mono text-xs text-chalk"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <PerspectiveProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={(p) => updateQueryParams({ product: p.slug })}
                  onQuickAdd={(p) => addToCart(p)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Framer Motion Shared-Element Product Detail Morph */}
        <AnimatePresence>
          {selectedProduct && (
            <div
              data-testid="product-detail-modal"
              className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => updateQueryParams({ product: null })}
                className="fixed inset-0 bg-obsidian/55 backdrop-blur-[2px]"
              />

              <motion.div
                layoutId={`card-shell-${selectedProduct.slug}`}
                className="relative z-10 grid w-full max-w-[960px] max-h-[90vh] overflow-y-auto grid-cols-1 border border-obsidian bg-chalk shadow-[0_24px_64px_rgba(18,17,16,0.28)] md:grid-cols-12"
              >
                <motion.div
                  layoutId={`card-img-${selectedProduct.slug}`}
                  className="bg-stone md:col-span-6"
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.imageAlt}
                    className="h-full w-full object-cover aspect-[4/3] md:aspect-auto"
                  />
                </motion.div>

                <div className="flex flex-col justify-between p-6 sm:p-7 md:col-span-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-pewter">
                        {selectedProduct.sku} · {selectedProduct.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQueryParams({ product: null })}
                        aria-label="Close product detail"
                        className="border border-hairline p-1.5 text-pewter hover:border-obsidian hover:text-obsidian"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <motion.h2
                      layoutId={`card-title-${selectedProduct.slug}`}
                      className="mt-2 font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-obsidian"
                    >
                      {selectedProduct.name}
                    </motion.h2>

                    <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-oxblood">
                      €{selectedProduct.price.toLocaleString("en-US")}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-pewter">
                      {selectedProduct.description}
                    </p>

                    {/* Finish Selector */}
                    <div className="mt-5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-pewter">
                        Select Edition Finish
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProduct.finishes.map((fin) => {
                          const active = detailFinish === fin;
                          return (
                            <button
                              key={fin}
                              type="button"
                              onClick={() => setDetailFinish(fin)}
                              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
                                active
                                  ? "border-oxblood bg-oxblood text-chalk font-semibold"
                                  : "border-hairline bg-stone/60 text-obsidian hover:border-obsidian"
                              }`}
                            >
                              {active && <Check className="h-3 w-3" />}
                              {fin}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <dl className="mt-6 divide-y divide-hairline border-y border-hairline font-mono text-xs">
                      <div className="flex justify-between py-2">
                        <dt className="text-pewter">DIMENSIONS</dt>
                        <dd>{selectedProduct.dimensions}</dd>
                      </div>
                      <div className="flex justify-between py-2">
                        <dt className="text-pewter">MASS</dt>
                        <dd>{selectedProduct.weight}</dd>
                      </div>
                      <div className="flex justify-between py-2">
                        <dt className="text-pewter">MATERIAL</dt>
                        <dd className="text-right max-w-[26ch]">
                          {selectedProduct.material}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(selectedProduct, detailFinish);
                        updateQueryParams({ product: null });
                      }}
                      className="flex-1 border border-oxblood bg-oxblood py-3 font-mono text-xs font-semibold uppercase tracking-wider text-chalk hover:bg-oxblood-deep transition-colors"
                    >
                      Add {detailFinish} Edition to Bag →
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClearCart={() => setCart([])}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-14 left-4 z-40 border border-oxblood bg-chalk px-3.5 py-2 font-mono text-xs text-oxblood shadow-lg"
        >
          {toast}
        </div>
      )}

      <footer className="border-t border-hairline bg-chalk px-5 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-pewter">
          <span>
            ATELIER KINETA · FRAMER MOTION LAYOUTID + 3D TILT + URL STATE + SPRING CART
          </span>
          <span>
            Crafted by{" "}
            <a
              href="https://github.com/jobjab-dev"
              target="_blank"
              rel="noreferrer"
              className="text-oxblood underline underline-offset-4 hover:text-obsidian"
            >
              jobjab-dev
            </a>
          </span>
        </div>
      </footer>

      <QaDrawer
        onPrefillBag={() => {
          setCart([
            { product: PRODUCTS[0], finish: "Obsidian", quantity: 1 },
            { product: PRODUCTS[1], finish: "Oxblood", quantity: 1 },
            { product: PRODUCTS[4], finish: "Raw Stone", quantity: 1 },
          ]);
          setCartOpen(true);
        }}
        onOpenSampleDetail={() =>
          updateQueryParams({ product: PRODUCTS[1].slug })
        }
        onCopyUrl={() => {
          navigator.clipboard?.writeText(window.location.href).catch(() => {});
          showToast("Copied synced gallery URL to clipboard.");
        }}
        onResetAll={() => {
          setCart([]);
          setCartOpen(false);
          updateQueryParams({
            category: null,
            finish: null,
            sort: null,
            product: null,
          });
        }}
      />
    </div>
  );
}
