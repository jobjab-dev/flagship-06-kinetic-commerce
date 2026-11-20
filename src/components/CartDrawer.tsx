"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import type { KineticProduct, ProductFinish } from "@/data/products";

export interface CartItem {
  product: KineticProduct;
  finish: ProductFinish;
  quantity: number;
}

export interface CheckoutReceipt {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  customerName: string;
  email: string;
  city: string;
  issuedAt: string;
  lineItems: Array<{
    sku: string;
    name: string;
    finish: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, finish: ProductFinish, delta: number) => void;
  onRemoveItem: (productId: string, finish: ProductFinish) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("Elena Vermeulen");
  const [email, setEmail] = useState("elena@atelier-studio.be");
  const [city, setCity] = useState("Antwerp, BE");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeCourierGap = Math.max(0, 600 - subtotal);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          city,
          items: items.map((i) => ({
            productId: i.product.id,
            finish: i.finish,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        receipt?: CheckoutReceipt;
      };
      if (!res.ok || !data.ok || !data.receipt) {
        setErrorMsg(data.message ?? "Checkout could not be completed.");
      } else {
        setReceipt(data.receipt);
        onClearCart();
      }
    } catch {
      setErrorMsg("Network failure reaching /api/checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/45 backdrop-blur-[2px]"
          />

          {/* Spring-Physics Slide-Over Cart Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 330, damping: 32 }}
            aria-label="Shopping bag drawer"
            className="relative z-10 flex h-full w-full max-w-[440px] flex-col border-l border-hairline bg-chalk text-obsidian shadow-[-16px_0_48px_rgba(18,17,16,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-oxblood" />
                <span className="font-display text-lg font-bold uppercase tracking-tight">
                  {receipt ? "Dispatch Receipt" : "Gallery Bag"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onClose();
                }}
                aria-label="Close bag drawer"
                className="p-1.5 text-pewter hover:text-obsidian"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {receipt ? (
              <div
                data-testid="checkout-receipt"
                className="flex flex-1 flex-col justify-between overflow-y-auto p-5"
              >
                <div>
                  <div className="border border-oxblood bg-oxblood/8 p-4">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-oxblood">
                      <CheckCircle2 className="h-4 w-4" />
                      ORDER CONFIRMED · {receipt.orderId}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-oxblood/20 pt-2.5 font-mono text-xs">
                      <span className="text-pewter">TRACKING CODE</span>
                      <strong className="text-obsidian">
                        {receipt.trackingNumber}
                      </strong>
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono text-xs">
                      <span className="text-pewter">FREIGHT</span>
                      <span>{receipt.carrier}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono text-xs">
                      <span className="text-pewter">EST. ARRIVAL</span>
                      <span>{receipt.estimatedDelivery}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-pewter">
                      Ship To: {receipt.customerName} ({receipt.city})
                    </div>
                    <ul className="mt-3 divide-y divide-hairline border border-hairline bg-stone/50">
                      {receipt.lineItems.map((line) => (
                        <li
                          key={`${line.sku}-${line.finish}`}
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-obsidian">
                              {line.name}
                            </div>
                            <div className="font-mono text-[10px] text-pewter">
                              {line.finish} · QTY {line.quantity}
                            </div>
                          </div>
                          <span className="font-mono font-semibold tabular-nums">
                            €{line.lineTotal.toLocaleString("en-US")}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-4 space-y-1.5 border-t border-hairline pt-3 font-mono text-xs">
                      <div className="flex justify-between text-pewter">
                        <dt>Subtotal</dt>
                        <dd className="tabular-nums">
                          €{receipt.subtotal.toLocaleString("en-US")}
                        </dd>
                      </div>
                      <div className="flex justify-between text-pewter">
                        <dt>Architectural Freight</dt>
                        <dd className="tabular-nums">
                          {receipt.shipping === 0
                            ? "COMPLIMENTARY"
                            : `€${receipt.shipping}`}
                        </dd>
                      </div>
                      <div className="flex justify-between text-pewter">
                        <dt>VAT / Duties (8%)</dt>
                        <dd className="tabular-nums">€{receipt.tax}</dd>
                      </div>
                      <div className="flex justify-between border-t border-hairline pt-2 text-sm font-semibold text-obsidian">
                        <dt>Total Paid</dt>
                        <dd className="tabular-nums">
                          €{receipt.total.toLocaleString("en-US")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    onClose();
                  }}
                  className="mt-6 w-full border border-obsidian bg-obsidian py-3 font-mono text-xs font-semibold uppercase tracking-wider text-chalk hover:bg-oxblood hover:border-oxblood transition-colors"
                >
                  Return to Gallery
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <Package className="h-8 w-8 text-pewter" />
                <p className="mt-3 font-display text-lg font-bold uppercase">
                  Your Gallery Bag Is Empty
                </p>
                <p className="mt-1.5 text-sm text-pewter max-w-[30ch]">
                  Select any industrial object from the exhibition grid to add it to your freight shipment.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-hairline bg-stone/60 px-5 py-2.5 font-mono text-[11px]">
                  {freeCourierGap === 0
                    ? "Complimentary DHL Architectural Freight unlocked."
                    : `Add €${freeCourierGap} more for complimentary DHL freight.`}
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-hairline px-5">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.finish}`}
                      className="flex gap-3.5 py-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-20 w-24 shrink-0 border border-hairline object-cover bg-stone"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-snug text-obsidian">
                              {item.product.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveItem(item.product.id, item.finish)
                              }
                              aria-label={`Remove ${item.product.name}`}
                              className="text-pewter hover:text-oxblood"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="mt-0.5 font-mono text-[11px] text-pewter">
                            {item.finish} · {item.product.sku}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center border border-hairline bg-stone/40">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQty(item.product.id, item.finish, -1)
                              }
                              aria-label="Decrease quantity"
                              className="p-1.5 hover:bg-stone"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 font-mono text-xs tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQty(item.product.id, item.finish, 1)
                              }
                              aria-label="Increase quantity"
                              className="p-1.5 hover:bg-stone"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-semibold tabular-nums">
                            €{(item.product.price * item.quantity).toLocaleString("en-US")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Streamlined Dispatch Form */}
                <form
                  onSubmit={handleCheckout}
                  className="border-t border-hairline bg-stone/55 p-5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full name"
                      aria-label="Recipient name"
                      className="border border-hairline bg-chalk px-2.5 py-2 text-xs focus:border-oxblood focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / Country"
                      aria-label="Destination city"
                      className="border border-hairline bg-chalk px-2.5 py-2 text-xs focus:border-oxblood focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Dispatch email"
                      aria-label="Dispatch email"
                      className="col-span-2 border border-hairline bg-chalk px-2.5 py-2 text-xs focus:border-oxblood focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="mt-2 font-mono text-xs text-oxblood">
                      {errorMsg}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between font-mono text-sm">
                    <span className="text-pewter">Subtotal</span>
                    <strong className="tabular-nums text-obsidian">
                      €{subtotal.toLocaleString("en-US")}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 w-full border border-oxblood bg-oxblood py-3 font-mono text-xs font-semibold uppercase tracking-wider text-chalk hover:bg-oxblood-deep transition-colors disabled:opacity-60"
                  >
                    {submitting
                      ? "Generating Dispatch Receipt..."
                      : "Complete Demo Checkout →"}
                  </button>
                </form>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
