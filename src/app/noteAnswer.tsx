'use client'

import { DragEvent, MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, BarlineType, Dot } from "vexflow";
import { NoteFragmentData } from "./noteFragment";

type Props = {
  width?: number,
  height?: number,
  scale?: number,
  fragment_count: number,
  clef: string,
  time: string,
};
export default function NoteAnswer(props: Props) {
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [fragments, setFragments] = useState<(NoteFragmentData | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const width = props.width ? props.width : 500;
  const height = props.height ? props.height : 200;
  const scale = props.scale ? props.scale : 1.0;
  const clef_time_width = 80;
  const measure_width = fragments ? (width - clef_time_width - 5) / props.fragment_count : width - clef_time_width - 5;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;

    const index = Math.floor((offsetX - clef_time_width * scale) / measure_width / scale);
    if (index >= 0 && index <= props.fragment_count) {
      const newFragments = [...fragments];
      newFragments[index] = null;
      setFragments(newFragments);
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const dataJson = event.dataTransfer.getData("application/NoteFragmentData");
    if (!dataJson) {
      console.error("Could not drop, as there was no application/NoteFragmentData");
      return;
    }

    var fragment:  NoteFragmentData;
    try {
      fragment = JSON.parse(dataJson);
    } catch (error) {
      console.error("Could not drop, due to parse error: ", error);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const index = Math.floor((offsetX - clef_time_width * scale) / measure_width / scale);

    if (index >= 0 && index <= props.fragment_count) {
      const newFragments = [...fragments];
      newFragments[index] = fragment;
      setFragments(newFragments);
      console.log("Removed fragment ", index);
    }
  }


  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    if (div.lastElementChild) {
      div.removeChild(div.lastElementChild);
    }

    const renderer = new Renderer(div, Renderer.Backends.SVG);
    const context = renderer.getContext();

    var x_pos = 0;
    var stave = new Stave(x_pos, 0, clef_time_width);

    renderer.resize(width, height);
    context.scale(scale, scale);

    // Draw Clef / Time Signature
    stave.addClef(props.clef);
    stave.addTimeSignature(props.time);
    stave.setEndBarType(BarlineType.NONE);
    stave.setContext(context).draw();
    x_pos = clef_time_width;

    // Setup the first bar to be rendered, each bar gets a separate "stave"
    stave = new Stave(x_pos, 0, measure_width);
    stave.setBegBarType(BarlineType.NONE);
    x_pos += measure_width;

    // Draw filled fragments
    for (const fragment of fragments) {
      stave.setContext(context).draw();

      var staveNotes = [];
      if (fragment) {
        staveNotes = Array.from(fragment.notes, (note) => {
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
      }

      stave = new Stave(x_pos, 0, measure_width);
      stave.setBegBarType(BarlineType.NONE);
      x_pos += measure_width;
    }

    // Resize the svg
    const svg = div.querySelector("svg");
    if (svg != null) {
      svg.setAttribute("width", `${width * scale}`);
      svg.setAttribute("height", `${height * scale}`);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }, [fragments]);

  return (
    <div ref={containerRef} onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver}></div>
  );
}
