"use client";

/**
 * StructuredFeatureCards
 * ----------------------
 * Reusable renderer for the structured room "Features" section.
 *
 * Each CARD decides its own type via `card.cardType` (card | cardSVG | comparison),
 * falling back to `feature.displayType` for legacy/newer mixed data.
 *
 * - card       -> responsive white card (heading + bullet list)
 * - cardSVG    -> same card, but an SVG image sits on top
 * - comparison -> table with a main heading, LEFT (A) and RIGHT (B) column
 *                 headings, and n points on each side
 *
 * Empty features/cards (no heading, no points, no svg) are skipped entirely so
 * unfilled builder rows never render on the public page.
 */

function hasCardContent(card) {
  return (
    (card.heading && String(card.heading).trim()) ||
    (card.svgUrl && String(card.svgUrl).trim()) ||
    (card.description && String(card.description).trim()) ||
    (Array.isArray(card.points) && card.points.some((p) => p && String(p.text).trim())) ||
    (Array.isArray(card.pointsRight) &&
      card.pointsRight.some((p) => p && String(p.text).trim())) ||
    (Array.isArray(card.columns) &&
      card.columns.some((c) => c && String(c.name).trim())) ||
    (Array.isArray(card.rows) &&
      card.rows.some(
        (r) =>
          (r && String(r.label || "").trim()) ||
          (Array.isArray(r?.values) && r.values.some((v) => v && String(v).trim()))
      ))
  );
}

// Render plain text with clickable links.
// Supports:
//   1. Markdown-style links:  [Click here](https://example.com)  -> "Click here" link
//   2. Bare URLs auto-detected: https://example.com / www.example.com -> the URL as link
function LinkifiedText({ text, className = "" }) {
  if (!text) return null;
  const str = String(text);
  const urlRe = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/g;

  const parts = [];
  let lastIndex = 0;
  let m;
  mdLinkRe.lastIndex = 0;
  while ((m = mdLinkRe.exec(str)) !== null) {
    if (m.index > lastIndex) parts.push({ type: "text", value: str.slice(lastIndex, m.index) });
    parts.push({ type: "md", label: m[1], href: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < str.length) parts.push({ type: "text", value: str.slice(lastIndex) });

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === "md") {
          return (
            <a
              key={i}
              href={/^www\./i.test(part.href) ? `https://${part.href}` : part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {part.label}
            </a>
          );
        }
        // text segment: split out bare URLs
        const segs = part.value.split(urlRe);
        return segs.map((seg, j) =>
          urlRe.test(seg) ? (
            <a
              key={`${i}-${j}`}
              href={/^www\./i.test(seg) ? `https://${seg}` : seg}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {seg}
            </a>
          ) : (
            <span key={`${i}-${j}`}>{seg}</span>
          )
        );
      })}
    </span>
  );
}

// Render a card's description content. Supports legacy HTML (stored by the old
// Jodit editor) and plain text — so old data renders inside the new cards too.
function CardDescription({ description }) {
  if (!description) return null;
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(description);
  if (hasHtml) {
    return (
      <div
        className="card-description mt-3 text-sm text-gray-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }
  return (
    <div className="mt-3 text-sm text-gray-600">
      <LinkifiedText text={description} />
    </div>
  );
}

function CardPoints({ points, accent = false }) {
  const list = (Array.isArray(points) ? points : []).filter(
    (p) => p && String(p.text).trim()
  );
  if (list.length === 0) return null;
  return (
    <ul className="mt-3 space-y-1.5">
      {list.map((p, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
          <span
            className={`mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
              accent ? "bg-orange-500" : "bg-gray-400"
            }`}
            aria-hidden="true"
          />
          <LinkifiedText text={p.text} />
        </li>
      ))}
    </ul>
  );
}

function StructuredCard({ card }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {card.heading && (
        <h4 className="text-base font-semibold text-gray-900">{card.heading}</h4>
      )}
      <CardPoints points={card.points} />
      <CardDescription description={card.description} />
    </div>
  );
}

function StructuredSvgCard({ card }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {card.svgUrl && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.svgUrl}
            alt={card.heading || "Feature icon"}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      {card.heading && (
        <h4 className="text-base font-semibold text-gray-900">{card.heading}</h4>
      )}
      <CardPoints points={card.points} accent />
      <CardDescription description={card.description} />
    </div>
  );
}

function StructuredComparisonTable({ feature, card }) {
  const mainHeading = card.heading || feature.name;

  // NEW format: columns[] (option names) + rows[] ({ label, values[] })
  const columns = (card.columns || []).filter((c) => c && String(c.name).trim());
  const rows = (card.rows || []).filter(
    (r) =>
      r &&
      (String(r.label || "").trim() ||
        (Array.isArray(r.values) && r.values.some((v) => v && String(v).trim())))
  );

  // LEGACY fallback: paired points (left = row label, right = A/B value)
  const hasNewFormat = columns.length > 0 || rows.length > 0;

  if (hasNewFormat) {
    const colCount = Math.max(columns.length, 1);
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700">
                {mainHeading}
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-900"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount + 1}
                  className="border border-gray-200 px-5 py-6 text-center text-gray-400"
                >
                  No comparison rows added yet.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-50/60" : "bg-white"}>
                  <td className="border border-gray-200 px-5 py-3 font-semibold text-gray-800">
                    <LinkifiedText text={row.label || "\u2014"} />
                  </td>
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className="border border-gray-200 px-5 py-3 text-gray-600"
                    >
                      <LinkifiedText text={row.values?.[cIdx] || "\u2014"} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Legacy paired-points table (A vs B)
  const left = (card.points || []).filter((p) => p && String(p.text).trim());
  const right = (card.pointsRight || []).filter((p) => p && String(p.text).trim());
  const rowCount = Math.max(left.length, right.length);
  const legacyRows = [];
  for (let i = 0; i < rowCount; i++) {
    legacyRows.push({
      left: left[i]?.text || "",
      right: right[i]?.text || "",
    });
  }
  const leftLabel = card.leftHeading || "A";
  const rightLabel = card.rightHeading || "B";

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700">
              {mainHeading}
            </th>
            <th className="border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-900">
              {leftLabel}
            </th>
            <th className="border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-900">
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {legacyRows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50/60" : "bg-white"}>
              <td className="border border-gray-200 px-5 py-3 font-semibold text-gray-800">
                <LinkifiedText text={row.left || row.right || "\u2014"} />
              </td>
              <td className="border border-gray-200 px-5 py-3 text-gray-600">
                <LinkifiedText text={row.left || "\u2014"} />
              </td>
              <td className="border border-gray-200 px-5 py-3 text-gray-600">
                <LinkifiedText text={row.right || "\u2014"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StructuredFeatureCards({ features, showHeading = false }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-14">
      {showHeading && (
        <h2 className="text-2xl font-semibold">Features</h2>
      )}

      {features.map((feature, fi) => {
          const cards = (Array.isArray(feature.cards) ? feature.cards : []).filter(
            hasCardContent
          );

          return (
            <article key={fi}>
              {/* Feature heading + sub-heading */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  <LinkifiedText text={feature.name} />
                </h3>
                {feature.subHeading ? (
                  <p className="mt-1 text-sm text-gray-500">
                    <LinkifiedText text={feature.subHeading} />
                  </p>
                ) : (
                  // Legacy data: feature.description may hold HTML (e.g. <ol><li>)
                  feature.description && (
                    <div
                      className="mt-1 text-sm text-gray-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: feature.description }}
                    />
                  )
                )}
              </div>

              {cards.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card, ci) => {
                    const cardType = card.cardType || feature.displayType || "card";
                    if (cardType === "comparison") {
                      // Comparison renders full-width (spans the grid)
                      return (
                        <div key={ci} className="sm:col-span-2 lg:col-span-3">
                          <StructuredComparisonTable feature={feature} card={card} />
                        </div>
                      );
                    }
                    if (cardType === "cardSVG") {
                      return <StructuredSvgCard key={ci} card={card} />;
                    }
                    return <StructuredCard key={ci} card={card} />;
                  })}
                </div>
              )}

              {feature.tip && (
                <div className="bg-green-200 text-[12px] text-green-700 w-full mt-10 p-4">
                  <span className="font-bold">{feature.name || feature.title} Tip :</span>{" "}
                  <LinkifiedText text={feature.tip} />
                </div>
              )}
            </article>
          );
        })}
    </div>
  );
}

export default StructuredFeatureCards;
