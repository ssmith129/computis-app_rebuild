import { ClassificationInsights } from "@/components/transactions/classification-insights";

/**
 * Isolated render route for exporting the ClassificationInsights component
 * as a presentation asset. NOT linked from the app nav.
 *
 * Specs (from task):
 *  - Frame: 720px wide, auto height, 32px padding, 12px radius, subtle shadow
 *  - Background: transparent page, white card frame
 *  - Component renders in isolation with its real hardcoded data
 */
export default function RenderClassificationInsights() {
  return (
    <div
      id="render-root"
      className="min-h-screen w-full flex items-center justify-center bg-transparent font-sans"
      style={{ padding: 0 }}
    >
      <div
        id="render-frame"
        className="bg-card text-card-foreground"
        style={{
          width: 720,
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          background: "#FFFFFF",
        }}
      >
        <ClassificationInsights />
      </div>
    </div>
  );
}
