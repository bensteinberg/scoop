import { Mischief } from "../Mischief.js";
import { WARCRecord, WARCSerializer } from "../node_modules/warcio/dist/warcio.mjs";

import crypto from "crypto"; // warcio needs the crypto utils suite but does not import them.
global.crypto = crypto;

/**
 * Mischief to WARC converter.
 * 
 * Note:
 * - Logs are added to capture object via `Mischief.addToLogs()`. 
 * 
 * @param {Mischief} capture
 * @param {Boolean} [gzip=false] 
 * @returns {Promise<ArrayBuffer>}
 */
export async function warc(capture, gzip=false) {
  const warcVersion = "WARC/1.1";
  gzip = Boolean(gzip);
  let serializedInfo = null;
  let serializedRecords = [];
  let filename = `archive${gzip ? ".warc.gz" : ".warc"}`;

  if (!capture instanceof Mischief || !capture.success) {
    throw new Error("`capture` must be a complete Mischief object.");
  }

  //
  // Prepare WARC info section
  //
  const info = await WARCRecord.createWARCInfo(
    { filename, warcVersion },
    { software: "LIL Mischief DEV" }
  );
  serializedInfo = await WARCSerializer.serialize(info, {gzip});
  
  //
  // Prepare WARC records section
  //
  for (let exchange of capture.exchanges) {
    try {
      async function* content() {
        yield new Uint8Array(exchange.body);
      }

      const record = WARCRecord.create({
        url: exchange.url,
        date: exchange.date.toISOString(), 
        type: exchange.type, 
        warcVersion: warcVersion,
        // warcio expects the method to be prepended to the statusLine
        // Reference:
        // - https://github.com/webrecorder/pywb/pull/636#issue-869181282
        // - https://github.com/webrecorder/warcio.js/blob/d5dcaec38ffb0a905fd7151273302c5f478fe5d9/src/statusandheaders.js#L69-L74
        // - https://github.com/webrecorder/warcio.js/blob/fdb68450e2e011df24129bac19691073ab6b2417/test/testSerializer.js#L212
        statusline: `${exchange.method} ${exchange.statusLine}`,
        httpHeaders: exchange.headers,
        keepHeadersCase: false
      }, content());

      serializedRecords.push(await WARCSerializer.serialize(record, {gzip}));
    }
    catch(err) {
      capture.addToLogs(`${exchange.url} could not be added to warc.`, true, err);
    }
  }

  //
  // Combine output and return as ArrayBuffer
  //
  return new Blob([serializedInfo, ...serializedRecords]).arrayBuffer();
}