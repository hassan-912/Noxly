import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { DemoId } from "@/content/types";
import type { DemoProps } from "./kit";

export type { DemoProps };

/**
 * Every coded demo by id. Each one is `React.lazy`, so it ships as its own chunk and loads only
 * when something renders it (inside a `<Suspense>` boundary).
 */
export const demoRegistry: Record<DemoId, LazyExoticComponent<ComponentType<DemoProps>>> = {
  review: lazy(() => import("./ReviewDemo")),
  calculator: lazy(() => import("./CalculatorDemo")),
  consultation: lazy(() => import("./ConsultationDemo")),
  "crew-mg": lazy(() => import("./CrewDemo")),
  "mg-mobile": lazy(() => import("./MobileScreens")),
};

export const demoIds = Object.keys(demoRegistry) as DemoId[];
