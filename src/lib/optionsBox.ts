/**
 * Tag option-list tables (A/B/C/D … lists) with the `options-box` class so
 * global CSS can float them to the left and let question content flow parallel
 * on the right. Also splits multi-option cells into per-letter spans and tags
 * flow-chart containers.
 *
 * Heuristic: scan the first cell of the first few rows for a lone uppercase
 * letter (optionally followed by whitespace / punctuation). This handles
 * tables whose first row is a `<th colspan="N">` header like "Comments".
 */
export function applyOptionsBoxStyling(root: HTMLElement): void {
  root.querySelectorAll<HTMLTableElement>("table").forEach((t) => {
    const rows = Array.from(
      t.querySelectorAll<HTMLTableRowElement>(":scope > tbody > tr, :scope > tr"),
    );
    let looksLikeOption = false;
    for (let i = 0; i < Math.min(rows.length, 3); i++) {
      const firstCell = rows[i].querySelector(":scope > td, :scope > th");
      const firstText = (firstCell?.textContent || "").trim();
      if (/^[A-Z](\s|$|[^A-Za-z0-9])/.test(firstText)) {
        looksLikeOption = true;
        break;
      }
    }
    if (!looksLikeOption) return;

    t.classList.add("options-box");

    t.querySelectorAll("td, th").forEach((cell) => {
      const strongs = cell.querySelectorAll(":scope > strong");
      if (strongs.length > 1) {
        const groups: Node[][] = [];
        let current: Node[] | null = null;
        Array.from(cell.childNodes).forEach((n) => {
          if (n.nodeType === 1 && (n as Element).tagName === "STRONG") {
            if (current) groups.push(current);
            current = [n];
          } else if (current) {
            current.push(n);
          }
        });
        if (current) groups.push(current);

        cell.innerHTML = "";
        groups.forEach((nodes) => {
          const span = document.createElement("span");
          span.className = "option-line";
          nodes.forEach((n) => {
            if (n.nodeType === 3 && n.textContent) {
              n.textContent = n.textContent.replace(/ /g, " ").trim();
              if (!n.textContent) return;
              span.appendChild(document.createTextNode(" "));
              span.appendChild(document.createTextNode(n.textContent));
            } else {
              span.appendChild(n);
            }
          });
          cell.appendChild(span);
        });
      } else {
        cell.childNodes.forEach((n) => {
          if (n.nodeType === 3 && n.textContent) {
            n.textContent = n.textContent.replace(/ /g, " ");
          }
        });
      }
    });
  });

  root.querySelectorAll<HTMLDivElement>("div").forEach((d) => {
    if (
      Array.from(d.children).some(
        (c) => c.tagName === "P" && /⬇|↓/.test(c.textContent || ""),
      )
    ) {
      d.classList.add("flow-chart");
    }
  });
}
