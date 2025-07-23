'use client'

import { RefObject, useEffect, useRef, useState } from "react";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, Dot, StaveTie, BarlineType } from "vexflow";
import { NoteFragmentData } from "./noteFragment";

type Props = {
  width?: number,
  height?: number,
  scale?: number,
  fragment_count: number,
  clef: string,
  time: string,
};

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

export default function NoteAnswer(props: Props) {
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [fragments, setFragments] = useState<NoteFragmentData[]>([
    fragment1,
    fragment2,
    // fragment3,
    // fragment4,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const width = props.width ? props.width : 500;
    const height = props.height ? props.height : 200;
    const scale = props.scale ? props.scale : 1.0;
    const clef_time_width = 80;
    const measure_width = fragments ? (width - clef_time_width - 5) / props.fragment_count : width - clef_time_width - 5;

    const context = renderer.getContext();

    var x_pos = 0;

    renderer.resize(width, height);
    context.scale(scale, scale);

    var stave = new Stave(x_pos, 0, clef_time_width);
    stave.addClef(props.clef);
    stave.addTimeSignature(props.time);
    stave.setEndBarType(BarlineType.NONE);
    stave.setContext(context).draw();
    x_pos = clef_time_width;

    stave = new Stave(x_pos, 0, measure_width);
    stave.setBegBarType(BarlineType.NONE);
    x_pos += measure_width;

    for (const fragment of fragments) {
      stave.setContext(context).draw();

      const staveNotes = Array.from(fragment.notes, (note) => {
        var sn = new StaveNote({
          keys: [note.key],
          duration: note.duration,
        });
        if (note.accidental) { sn.addModifier(new Accidental(note.accidental)) }
        return sn;
      })

      const beams = Beam.generateBeams(staveNotes, { flatBeams: true });
      Formatter.FormatAndDraw(context, stave, staveNotes);

      beams.forEach((b) => {
        b.setContext(context).draw();
      });

      stave = new Stave(x_pos, 0, measure_width);
      stave.setBegBarType(BarlineType.NONE);
      x_pos += measure_width;
    }
    for (var i = 0; i < props.fragment_count - fragments.length; i++) {
      stave.setContext(context).draw();
      stave = new Stave(x_pos, 0, measure_width);
      stave.setBegBarType(BarlineType.NONE);
      x_pos += measure_width;
    }

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
