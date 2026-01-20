import React, { useEffect, useRef } from "react";
import katex from "katex";

const renderBlock = (
  latex: string,
  container: HTMLElement,
  displayMode = true
) => {
  try {
    katex.render(latex, container, {
      throwOnError: false,
      displayMode: displayMode
    });
  } catch (err: any) {
    container.innerHTML = `<span style="color:red;">${err.message}</span>`;
  }
};

type LatexRendererProps = {
  latex: string;
  displayMode?: boolean;
};

const LatexRenderer: React.FC<LatexRendererProps> = ({
  latex,
  displayMode = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !latex) return;
    const blocks = latex
      .split(/\n\s*\n/)
      .map(b => b.trim())
      .filter(b => b);

    containerRef.current.innerHTML = "";

    blocks.forEach(block => {
      const el = document.createElement("div");
      containerRef.current!.appendChild(el);

      const isMathBlock =
        block.startsWith("\\[") ||
        block.startsWith("\\(") ||
        block.startsWith("\\begin") ||
        block.includes("&=") ||
        block.includes("^") ||
        displayMode;

      const cleanBlock = block.replace(/^\\\[|\\\]$/g, "");
      renderBlock(cleanBlock, el, isMathBlock);
    });
  }, [latex, displayMode]);

  return <div ref={containerRef} />;
};

export { LatexRenderer };
export type { LatexRendererProps };
