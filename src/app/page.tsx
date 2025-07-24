import NoteFragment from "@/app/noteFragment";
import NoteAnswer from "./noteAnswer";
import { promises as fs } from "node:fs";
import { parsePart1 } from "./mxmlParse";

const ex1006Mxml = await fs.readFile(process.cwd() + '/src/app/res/1006.musicxml');

export default function Home() {
  const fragments = parsePart1(ex1006Mxml);
  return (
    <>
      <div style={{display: 'flex'}}>
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragments[0]} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragments[1]} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragments[2]} />
        <NoteFragment width={300} height={100} scale={0.7} fragment={fragments[3]} />
      </div>
      <div>
        <NoteAnswer width={1300} height={100} scale={0.7} clef="treble" time="4/4" fragment_count={4} />
      </div>
    </>
  );
}
