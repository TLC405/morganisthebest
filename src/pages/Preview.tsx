import { BrandedSplash } from "@/components/BrandedSplash";
import { APP_VERSION, getBuildTimestamp } from "@/lib/version";

const Preview = () => {
  const timestamp = getBuildTimestamp();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BrandedSplash />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border bg-card/80 px-4 py-2 text-sm shadow-md backdrop-blur">
        <span className="font-mono">Preview build {APP_VERSION}</span>
        {timestamp && <span className="ml-2 text-muted-foreground text-xs">{timestamp}</span>}
      </div>
    </div>
  );
};

export default Preview;
