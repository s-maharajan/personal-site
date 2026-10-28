// Offline font generation: HarfBuzz subsets the committed TTFs; WOFF2 stores
// their untransformed tables in a Brotli stream (no outline transform needed).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { brotliCompressSync, constants } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { instance: { exports: hb } } = await WebAssembly.instantiate(
  readFileSync(require.resolve("harfbuzzjs/hb-subset.wasm")),
);
const output = new URL("../src/assets/", import.meta.url);
mkdirSync(output, { recursive: true });

function base128(value) {
  const bytes = [value & 127];
  while ((value = Math.floor(value / 128))) bytes.unshift((value & 127) | 128);
  return Buffer.from(bytes);
}

function woff2(ttf) {
  const count = ttf.readUInt16BE(4);
  const directory = [];
  const tables = [];
  let sfntSize = 12 + count * 16;
  for (let i = 0; i < count; i++) {
    const offset = 12 + i * 16;
    const tag = ttf.subarray(offset, offset + 4);
    const length = ttf.readUInt32BE(offset + 12);
    // Literal tag (index 63), with null transform version 3 for glyf/loca.
    const flags = ["glyf", "loca"].includes(tag.toString()) ? 255 : 63;
    directory.push(Buffer.from([flags]), tag, base128(length));
    tables.push(ttf.subarray(ttf.readUInt32BE(offset + 8), ttf.readUInt32BE(offset + 8) + length));
    sfntSize += Math.ceil(length / 4) * 4;
  }
  const compressed = brotliCompressSync(Buffer.concat(tables), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  });
  const entries = Buffer.concat(directory);
  // The final compressed block is padded to a four-byte boundary.
  const padding = Buffer.alloc((4 - (48 + entries.length + compressed.length) % 4) % 4);
  const header = Buffer.alloc(48);
  header.write("wOF2");
  ttf.copy(header, 4, 0, 4);
  header.writeUInt32BE(48 + entries.length + compressed.length + padding.length, 8);
  header.writeUInt16BE(count, 12);
  header.writeUInt32BE(sfntSize, 16);
  header.writeUInt32BE(compressed.length, 20);
  header.writeUInt16BE(1, 24);
  return Buffer.concat([header, entries, compressed, padding]);
}

for (const [source, style] of [["Regular", "normal"], ["Italic", "italic"]]) {
  const font = readFileSync(new URL(`../fonts/Fraunces-${source}.ttf`, import.meta.url));
  const pointer = hb.malloc(font.length);
  new Uint8Array(hb.memory.buffer).set(font, pointer);
  const blob = hb.hb_blob_create(pointer, font.length, 2, 0, 0);
  const face = hb.hb_face_create(blob, 0);
  const input = hb.hb_subset_input_create_or_fail();
  const unicode = hb.hb_subset_input_unicode_set(input);
  for (const [start, end] of [[0x20, 0x7e], [0xa0, 0x17f], [0x2000, 0x206f], [0x20ac, 0x20ac], [0x2122, 0x2122], [0x2190, 0x21ff]]) {
    for (let code = start; code <= end; code++) hb.hb_set_add(unicode, code);
  }
  const subset = hb.hb_subset_or_fail(face, input);
  if (!subset) throw new Error(`Could not subset ${source}`);
  const result = hb.hb_face_reference_blob(subset);
  const data = hb.hb_blob_get_data(result, 0);
  const length = hb.hb_blob_get_length(result);
  const ttf = Buffer.from(new Uint8Array(hb.memory.buffer, data, length));
  writeFileSync(new URL(`fraunces-latin-${style}.woff2`, output), woff2(ttf));
  hb.hb_blob_destroy(result);
  hb.hb_face_destroy(subset);
  hb.hb_subset_input_destroy(input);
  hb.hb_face_destroy(face);
  hb.hb_blob_destroy(blob);
  hb.free(pointer);
}
