import { XMLParser } from "fast-xml-parser";
import { Note, NoteFragmentData } from "./noteFragment";

const accidentalMap = new Map();
accidentalMap.set("flat-flat", "bb");
accidentalMap.set("flat", "b");
accidentalMap.set("neutral", "n");
accidentalMap.set("sharp", "#");
accidentalMap.set("sharp-sharp", "##");
accidentalMap.set("double-sharp", "##");

const noteMap = new Map();
noteMap.set("whole", "1");
noteMap.set("half", "2");
noteMap.set("quarter", "4");
noteMap.set("eighth", "8");
noteMap.set("16th", "16");
noteMap.set("32nd", "32");

export function parsePart1(scoreXml: Buffer<ArrayBufferLike>): NoteFragmentData[] {
  const parser = new XMLParser();
  const score = parser.parse(scoreXml);
  const part1 = score["score-partwise"]["part"][0];

  const fragments: NoteFragmentData[] = [];

  for (var i = 0; i < 4; i++) {
    const measure = part1.measure[i];
    const fragment: NoteFragmentData = {
      clef: null,
      time: null,
      notes: []
    };
    for (const note of measure.note) {
      const key = note.pitch ? `${note.pitch.step}/${note.pitch.octave}` : "b/4";
      const duration = noteMap.get(note.type) + (note.pitch ? "" : "r");
      const accidental = accidentalMap.get(note.accidental);
      const nfNote: Note = {key: key, duration: duration, accidental: accidental ? accidental : null};
      if (Array.isArray(note.dot)) {
        nfNote.dots = note.dot.length;
      } else {
        nfNote.dots = note.dot == undefined ? 0 : 1;
      }
      fragment.notes.push(nfNote);
    }
    fragments.push(fragment);
  }
  return fragments;
}

