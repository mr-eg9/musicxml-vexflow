'use client'

import { useEffect, useRef } from "react";
import VexFlow from "vexflow";
import { Renderer, Formatter, Stave, StaveNote, Accidental, Beam, Dot, StaveTie } from "vexflow";

type Note = {
    key: string,
    duration: string,
    accidental: "##" | "#" | "n" | "b" | "bb",
}

type NoteFragmentData = {
    key: null | "treble" | "bass",
    time: null | "4/4" | "3/4",
    notes: [Note],
};

const example_notes: NoteFragmentData = {
    key: null,
    time: null,
    notes: [
        {key: "", duration: "", accidental: ""}
    ],
}

export default function NoteFragment(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const width = props.width ? props.width : 500;
    const height = props.height ? props.height : 200;
    const scale = props.scale ? props.scale : 1.0;

    // Configure the rendering context.
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.scale(scale, scale);

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(0, 0, props.width-5);

    // Add a clef and time signature.
    // stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    const notes1 = [
      dotted(
        new StaveNote({
          keys: ["e##/5"],
          duration: "8d",
        }).addModifier(new Accidental("##"))
      ),
      new StaveNote({
        keys: ["b/4"],
        duration: "16",
      }).addModifier(new Accidental("b")),
    ];

    const notes2 = [
      new StaveNote({
        keys: ["c/4"],
        duration: "8",
      }),
      new StaveNote({
        keys: ["d/4"],
        duration: "16",
      }),
      new StaveNote({
        keys: ["e/4"],
        duration: "16",
      }).addModifier(new Accidental("b")),
    ];

    const notes3 = [
      new StaveNote({
        keys: ["d/4"],
        duration: "16",
      }),
      new StaveNote({
        keys: ["e/4"],
        duration: "16",
      }).addModifier(new Accidental("#")),
      new StaveNote({
        keys: ["g/4"],
        duration: "32",
      }),
      new StaveNote({
        keys: ["a/4"],
        duration: "32",
      }),
      new StaveNote({
        keys: ["g/4"],
        duration: "16",
      }),
    ];

    const notes4 = [
      new StaveNote({
        keys: ["d/4"],
        duration: "q",
      }),
    ];

    const allNotes = notes1.concat(notes2).concat(notes3).concat(notes4);

    // Create the beams for the first three groups.
    // This hides the normal stems and flags.
    const beams = [new Beam(notes1), new Beam(notes2), new Beam(notes3)];

    const box = Formatter.FormatAndDraw(context, stave, allNotes);

    // Draw the beams and stems.
    beams.forEach((b) => {
      b.setContext(context).draw();
    });

    // Helper function.
    function dotted(staveNote: StaveNote) {
      Dot.buildAndAttach([staveNote]);
      return staveNote;
    }
  }, []);

  return (
    <div ref={containerRef} draggable="true"></div>
  );
}
