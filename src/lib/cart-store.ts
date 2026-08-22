"use client";

import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId: string;
  categorySlug: string;
  categoryName: string;
  serviceSlug: string;
  serviceName: string;
  image: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
};

const KEY = "zapiboo_cart_v1";
const listeners = new Set<() => void>();
const readCart = (): CartItem[] => { try { const value = localStorage.getItem(KEY); return value ? JSON.parse(value) as CartItem[] : []; } catch { return []; } };
const writeCart = (items: CartItem[]) => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };
const notify = () => listeners.forEach((listener) => listener());

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { setItems(readCart()); setReady(true); const sync = () => setItems(readCart()); listeners.add(sync); return () => { listeners.delete(sync); }; }, []);
  const commit = (next: CartItem[]) => { setItems(next); writeCart(next); notify(); };
  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const current = readCart(); const existing = current.find((currentItem) => currentItem.id === item.id);
    commit(existing ? current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, quantity: currentItem.quantity + (item.quantity ?? 1) } : currentItem) : [...current, { ...item, quantity: item.quantity ?? 1 }]);
  };
  const removeItem = (id: string) => commit(readCart().filter((item) => item.id !== id));
  const updateQuantity = (id: string, quantity: number) => quantity < 1 ? removeItem(id) : commit(readCart().map((item) => item.id === id ? { ...item, quantity } : item));
  return { items, ready, addItem, removeItem, updateQuantity, clear: () => commit([]), subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
}
