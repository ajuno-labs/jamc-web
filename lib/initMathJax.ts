export async function typeset(latex: string, display: boolean = true): Promise<string> {
  // Only run in browser
  if (typeof window === 'undefined') return '';

  // Dynamic imports to avoid SSR issues
  const { mathjax } = await import('mathjax-full/js/mathjax.js');
  const { TeX } = await import('mathjax-full/js/input/tex.js');
  const { SVG } = await import('mathjax-full/js/output/svg.js');
  const { browserAdaptor } = await import('mathjax-full/js/adaptors/browserAdaptor.js');
  const { RegisterHTMLHandler } = await import('mathjax-full/js/handlers/html.js');

  // Initialize MathJax for this call
  const adaptor = browserAdaptor();
  RegisterHTMLHandler(adaptor);
  const tex = new TeX({ inlineMath: [['$', '$'], ['\\(', '\\)']] });
  const svgOutput = new SVG({ fontCache: 'none' });
  const doc = mathjax.document(document, { InputJax: tex, OutputJax: svgOutput });

  // Convert the LaTeX to an HTML node
  const node = doc.convert(latex, { display });
  const rawSVG = adaptor.innerHTML(node);
  return rawSVG;
} 