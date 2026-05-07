// Shared utility for building RDL XML from a report object
import { XMLBuilder } from "fast-xml-parser";

export function buildRDLXml(reportObj) {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });
  const xmlOutput = builder.build(reportObj);
  return `<?xml version="1.0" encoding="utf-8"?>\n${xmlOutput}`;
}