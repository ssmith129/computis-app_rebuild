import { useCallback, useEffect, useRef } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down";

export interface UseSwipeOptions {
  threshold?: number; // px
  onSwipe?: (direction: SwipeDirection, event: PointerEvent) => void;
  onSwipeStart?: (event: PointerEvent) => void;
  onSwipeEnd?: (event: PointerEvent) => void;
}

export function useSwipe(
  target: React.RefObject<HTMLElement>,
  { threshold = 30, onSwipe, onSwipeStart, onSwipeEnd }: UseSwipeOptions = {},
) {
  const startX = useRef(0);
  const startY = useRef(0);
  const active = useRef(false);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!target.current) return;
      active.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      onSwipeStart?.(e);
    },
    [onSwipeStart, target],
  );

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      if (!active.current) return;
      active.current = false;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < threshold && absY < threshold) {
        onSwipeEnd?.(e);
        return;
      }

      let dir: SwipeDirection;
      if (absX > absY) {
        dir = dx > 0 ? "right" : "left";
      } else {
        dir = dy > 0 ? "down" : "up";
      }

      onSwipe?.(dir, e);
      onSwipeEnd?.(e);
    },
    [onSwipe, onSwipeEnd, threshold],
  );

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    // Opt in for touch interaction
    el.style.touchAction = el.style.touchAction || "pan-x pan-y pinch-zoom";

    const down = (e: PointerEvent) => onPointerDown(e);
    const up = (e: PointerEvent) => onPointerUp(e);

    el.addEventListener("pointerdown", down, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("pointerup", up, {
      passive: true,
    } as AddEventListenerOptions);

    return () => {
      el.removeEventListener("pointerdown", down as EventListener);
      window.removeEventListener("pointerup", up as EventListener);
    };
  }, [onPointerDown, onPointerUp, target]);
}

export interface UsePinchOptions {
  onPinchStart?: (
    scale: number,
    center: { x: number; y: number },
    event: PointerEvent,
  ) => void;
  onPinch?: (
    scale: number,
    center: { x: number; y: number },
    event: PointerEvent,
  ) => void;
  onPinchEnd?: (event: PointerEvent) => void;
}

export function usePinch(
  target: React.RefObject<HTMLElement>,
  { onPinchStart, onPinch, onPinchEnd }: UsePinchOptions = {},
) {
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialDistance = useRef<number | null>(null);

  const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  const centerPoint = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    el.style.touchAction = el.style.touchAction || "pan-x pan-y pinch-zoom";

    const onPointerDown = (e: PointerEvent) => {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2) {
        const [p1, p2] = Array.from(pointers.current.values());
        initialDistance.current = distance(p1, p2);
        const center = centerPoint(p1, p2);
        onPinchStart?.(1, center, e);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2 && initialDistance.current) {
        const [p1, p2] = Array.from(pointers.current.values());
        const dist = distance(p1, p2);
        const scale = dist / initialDistance.current;
        const center = centerPoint(p1, p2);
        onPinch?.(scale, center, e);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointers.current.has(e.pointerId)) {
        pointers.current.delete(e.pointerId);
      }
      if (pointers.current.size < 2 && initialDistance.current !== null) {
        initialDistance.current = null;
        onPinchEnd?.(e);
      }
    };

    el.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("pointerup", onPointerUp, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("pointercancel", onPointerUp, {
      passive: true,
    } as AddEventListenerOptions);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown as EventListener);
      window.removeEventListener("pointermove", onPointerMove as EventListener);
      window.removeEventListener("pointerup", onPointerUp as EventListener);
      window.removeEventListener("pointercancel", onPointerUp as EventListener);
    };
  }, [onPinch, onPinchEnd, onPinchStart, target]);
}
