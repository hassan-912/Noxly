"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Device } from "./DeviceControls";

/** CSS width of each device's screen. Desktop is a minimum: it grows to fill a wider stage. */
export const deviceWidth: Record<Device, number> = { desktop: 960, tablet: 768, phone: 390 };

/** Frame thickness around the screen, in px. Kept in step with `--bezel` in globals.css. */
const bezel: Record<Device, number> = { desktop: 6, tablet: 10, phone: 9 };

/** Height of the slim window bar on the desktop frame. Kept in step with globals.css. */
const TOP_BAR = 20;

/** The screen's own height for its width: a 3:2 desktop, a portrait tablet, a tall phone. */
const screenBlock = (device: Device, inline: number) =>
  device === "desktop" ? Math.round(inline / 1.5) : device === "tablet" ? 1024 : 780;

export type FrameSize = {
  /** Width available to the frame, in px. */
  inline: number;
  /** The most height the frame may take on screen, in px. */
  block: number;
};

/**
 * A frosted device frame whose screen is exactly the device's CSS width, so whatever is inside
 * (a container-query demo, or an iframe) lays itself out for that device. When the stage is
 * narrower than the device, the whole frame is scaled down to fit and never overflows.
 *
 * With `size` null (before measuring, and on viewports below 768px) the frame is fluid: the
 * phone layout at the available width, as tall as its content, with no inner scrolling.
 */
export function DeviceFrame({
  device,
  size,
  resetKey,
  children,
}: {
  device: Device;
  size: FrameSize | null;
  /** When this changes, the screen scrolls back to the top. */
  resetKey?: string | number;
  children: ReactNode;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  // Transitions start one frame after the first measured layout, so nothing animates on load.
  const [animate, setAnimate] = useState(false);

  const fluid = size === null;
  useEffect(() => {
    if (fluid) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => {
      cancelAnimationFrame(raf);
      setAnimate(false);
    };
  }, [fluid]);

  // A quiet fade at the bottom edge while there is more to scroll to (the scrollbar is hidden so
  // the screen keeps its exact device width).
  const updateMore = useCallback(() => {
    const el = screen.current;
    if (el) setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 8);
  }, []);

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const sizes = new ResizeObserver(updateMore);
    const watch = () => {
      sizes.observe(el);
      for (const child of el.children) sizes.observe(child);
      updateMore();
    };
    const mutations = new MutationObserver(watch);
    mutations.observe(el, { childList: true });
    watch();
    return () => {
      sizes.disconnect();
      mutations.disconnect();
    };
  }, [updateMore]);

  useEffect(() => {
    screen.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  let stageStyle: CSSProperties | undefined;
  let frameStyle: CSSProperties | undefined;
  if (size) {
    const inner =
      device === "desktop"
        ? Math.max(deviceWidth.desktop, Math.floor(size.inline) - 2 * bezel.desktop)
        : deviceWidth[device];
    const outer = inner + 2 * bezel[device];
    const scale = Math.min(1, size.inline / outer);
    // Each device keeps its own proportions, up to the height the stage allows; taller content
    // scrolls inside the screen.
    const natural = screenBlock(device, inner) + 2 * bezel[device] + (device === "desktop" ? TOP_BAR : 0);
    const block = Math.min(size.block, natural * scale);
    stageStyle = { blockSize: block };
    frameStyle = {
      inlineSize: outer,
      blockSize: block / scale,
      transform: `scale(${scale})`,
    };
  }

  return (
    <div className="device-stage" data-animate={animate ? "" : undefined} style={stageStyle}>
      <div
        data-device-frame=""
        data-device={fluid ? "phone" : device}
        data-fluid={fluid ? "" : undefined}
        data-animate={animate ? "" : undefined}
        data-more={more && !fluid ? "" : undefined}
        className="device-frame"
        style={frameStyle}
      >
        <div aria-hidden="true" className="device-frame__top">
          <span />
          <span />
          <span />
        </div>
        <div ref={screen} data-frame-viewport="" onScroll={updateMore} className="device-frame__screen">
          {children}
        </div>
      </div>
    </div>
  );
}
