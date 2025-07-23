import VexFlow from "vexflow";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, Dot, StaveTie } from "vexflow";

import NoteFragment, { NoteFragmentData } from "@/app/noteFragment";
import NoteAnswer from "./noteAnswer";

const fragment1: NoteFragmentData = {
  clef: null,
  time: null,
  notes: [
    { key: "c/4", duration: "4", accidental: null },
    { key: "d/4", duration: "4", accidental: null },
    { key: "e/4", duration: "4", accidental: null },
    { key: "f/4", duration: "4", accidental: null },
  ],
}

const fragment2: NoteFragmentData = {
  clef: null,
  time: null,
  notes: [
    { key: "g/4", duration: "h", accidental: null },
    { key: "g/4", duration: "h", accidental: null },
  ],
}

const fragment3: NoteFragmentData = {
  clef: null,
  time: null,
  notes: [
    { key: "a/4", duration: "q", accidental: null },
    { key: "a/4", duration: "q", accidental: null },
    { key: "a/4", duration: "q", accidental: null },
    { key: "a/4", duration: "q", accidental: null },
  ],
}

const fragment4: NoteFragmentData = {
  clef: null,
  time: null,
  notes: [
    { key: "g/4", duration: "w", accidental: null },
  ],
}

export default function Home() {
  return (
    <>
      <div style={{display: 'flex'}}>
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragment1} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragment2} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragment3} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragment4} />
      </div>
      <div>
        <NoteAnswer width={1300} height={100} scale={0.7} clef="treble" time="4/4" fragment_count={4} />
      </div>
    </>
  );
}
