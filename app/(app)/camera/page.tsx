import { CameraClient } from "./CameraClient";

export default function CameraPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#E1E0CC]">Image Practice</h1>
        <p className="text-sm" style={{ color: "rgba(225,224,204,0.55)" }}>
          Take or upload a photo. Gemma AI labels everything in your target language and writes level-appropriate sentences.
        </p>
      </div>
      <CameraClient />
    </section>
  );
}
