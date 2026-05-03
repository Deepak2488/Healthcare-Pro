import { Grid2X2, List } from "lucide-react";

export type ViewMode = "grid" | "list";

type ToggleProps = {
  view: ViewMode;
  setView: (view: ViewMode) => void;
};

export default function Toggle({ view, setView }: ToggleProps) {
  return (
    <div className="segmented-control" aria-label="Patient view">
      <button
        className={view === "grid" ? "active" : ""}
        type="button"
        onClick={() => setView("grid")}
      >
        <Grid2X2 />
        Grid
      </button>
      <button
        className={view === "list" ? "active" : ""}
        type="button"
        onClick={() => setView("list")}
      >
        <List />
        List
      </button>
    </div>
  );
}
