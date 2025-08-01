'use client'

import { RefObject, useEffect, useRef } from "react";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, Dot } from "vexflow";

export type Note = {
  key: string,
  duration: string,
  accidental: "##" | "#" | "n" | "b" | "bb" | null,
  dots?: number,
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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/NoteFragmentData", JSON.stringify(props.fragment))
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    const renderer = new Renderer(div, Renderer.Backends.SVG);
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
      if (note.dots) {
        for (var i = 0; i < note.dots; i++) {
          Dot.buildAndAttach([sn]);
        }
      }
      return sn;
    })

    const beams = Beam.generateBeams(staveNotes, { flatBeams: true });
    Formatter.FormatAndDraw(context, stave, staveNotes);

    beams.forEach((b) => {
      b.setContext(context).draw();
    });

    const svg = div.querySelector("svg");
    if (svg != null) {
      svg.setAttribute("width", `${width * scale}`);
      svg.setAttribute("height", `${height * scale}`);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }, []);

  return (
    <div ref={containerRef} draggable="true" onDragStart={handleDragStart}></div>
  );
}
