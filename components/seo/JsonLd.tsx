import { memo } from "react";

interface JsonLdProps {
  data: object | object[];
  id?: string;
}

/**
 * Shared JSON-LD render helper.
 * Standardizes structured-data output across all schema components:
 * - Always emits a <script type="application/ld+json">
 * - Serializes compactly (valid JSON, no trailing whitespace)
 * - Optional `id` attribute for multiple blocks on the same page
 */
function JsonLd({ data, id }: JsonLdProps) {
  // Escape characters that can terminate a script tag when CMS content is
  // serialized into JSON-LD. JSON parsers decode these escapes normally.
  const payload = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

export default memo(JsonLd);
