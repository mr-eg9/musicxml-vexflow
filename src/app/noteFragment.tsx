'use client'

import { RefObject, useEffect, useRef } from "react";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam } from "vexflow";

export type Note = {
  key: string,
  duration: string,
  accidental: "##" | "#" | "n" | "b" | "bb" | null,
}

export type NoteFragmentData = {
  clef: null | "treble" | "bass",
  time: null | "4/4" | "3/4",
  notes: Note[],
};

type Props = {
  width?: number,
  height?: number,
  scale?: number,
  fragment: NoteFragmentData,
};

export default function NoteFragment(props: Props) {
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);
  // const [notes, setNotes] = useState(fragment1);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const scale = props.scale ? props.scale : 1.0;
    const width = props.width ? props.width : 500;
    const height = props.height ? props.height : 200;
    const notes = props.fragment;

    renderer.resize(width, height);

    const context = renderer.getContext();
    context.scale(scale, scale);


    const stave = new Stave(0, 0, width - 5);
    if (notes.clef) { stave.addClef(notes.clef) }
    if (notes.time) { stave.addTimeSignature(notes.time) }

    stave.setContext(context).draw();

    const staveNotes = Array.from(notes.notes, (note) => {
      var sn = new StaveNote({
        keys: [note.key],
        duration: note.duration,
      });
      if (note.accidental) { sn.addModifier(new Accidental(note.accidental)) }
      return sn;
    })

    const beams = Beam.generateBeams(staveNotes, {flatBeams: true});
    Formatter.FormatAndDraw(context, stave, staveNotes);

    beams.forEach((b) => {
      b.setContext(context).draw();
    });

    const svg = containerRef.current.querySelector("svg");
    if (svg != null) {
      svg.setAttribute("width", `${width * scale}`);
      svg.setAttribute("height", `${height * scale}`);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }, []);

  return (
    <div ref={containerRef} draggable="true"></div>
  );
}
