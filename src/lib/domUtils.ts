
/**
 * Applies highlights to an HTML string based on character offsets in textContent.
 * @param html Original HTML string
 * @param highlights Array of ranges to highlight
 */
export function applyHighlightsToHtml(
    html: string,
    highlights: Array<{ start: number; end: number; color: string }>
): string {
    if (!html || highlights.length === 0) return html;

    // 1. Create a container in JSDOM (or browser)
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body = doc.body;

    // 2. Sort highlights by start offset (descending to avoid index shift if we modified as we go, 
    // but here we are working on nodes, so ascending is fine if we are careful)
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    let currentTextOffset = 0;

    function traverse(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            const nodeLength = text.length;
            const nodeEnd = currentTextOffset + nodeLength;

            // Find highlights that overlap with this text node
            const overlapping = sortedHighlights.filter(h =>
                h.start < nodeEnd && h.end > currentTextOffset
            );

            if (overlapping.length > 0) {
                const parent = node.parentNode;
                if (parent) {
                    const fragments: Node[] = [];
                    let lastNodeOffset = 0;

                    // Note: This logic assumes non-overlapping highlights within the same node
                    // or at least handles them in order.
                    overlapping.forEach(h => {
                        const startInNode = Math.max(0, h.start - currentTextOffset);
                        const endInNode = Math.min(nodeLength, h.end - currentTextOffset);

                        // Text before highlight
                        if (startInNode > lastNodeOffset) {
                            fragments.push(doc.createTextNode(text.slice(lastNodeOffset, startInNode)));
                        }

                        // Highlighted mark
                        const mark = doc.createElement('mark');
                        const cls = h.color === "blue" ? "hl-blue" : h.color === "green" ? "hl-green" : h.color === "pink" ? "hl-pink" : "hl-yellow";
                        mark.className = cls;
                        mark.textContent = text.slice(startInNode, endInNode);
                        fragments.push(mark);

                        lastNodeOffset = endInNode;
                    });

                    // Remaining text after last highlight
                    if (lastNodeOffset < nodeLength) {
                        fragments.push(doc.createTextNode(text.slice(lastNodeOffset)));
                    }

                    // Replace the original node with fragments
                    fragments.forEach(f => parent.insertBefore(f, node));
                    parent.removeChild(node);
                }
            }

            currentTextOffset = nodeEnd;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            children.forEach(traverse);
        }
    }

    traverse(body);
    return body.innerHTML;
}

/**
 * Gets the character offset of a selection relative to a container's textContent.
 */
export function getSelectionCharacterOffset(container: HTMLElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    return {
        start,
        end: start + range.toString().length,
        text: range.toString()
    };
}
