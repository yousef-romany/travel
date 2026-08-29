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
  const payload = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

export default memo(JsonLd);
