import VexFlow from "vexflow";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, Dot, StaveTie } from "vexflow";

import NoteFragment from "@/app/noteFragment";

export default function Home() {
  return (
    <div>
      <NoteFragment width="500" height="200" scale="0.5" />
    </div>
  );
}
