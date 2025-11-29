const hieroglyphs = ["𓂀", "𓏏", "𓎛", "𓆑", "𓅓", "𓋴", "𓂻", "𓉔", "𓊪", "𓄿"];

const applyHieroglyphEffect = () => {
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  elements.forEach((el) => {
    // Check if hieroglyph already applied by checking for data attribute
    if (el.getAttribute('data-hieroglyph-applied') === 'true') {
      return;
    }

    // Get current text content
    const currentText = el.textContent || '';

    // Check if text already starts with a hieroglyph
    const startsWithHieroglyph = hieroglyphs.some(h => currentText.startsWith(h));

    if (!startsWithHieroglyph && currentText.trim()) {
      const randomHieroglyph = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
      el.textContent = `${randomHieroglyph} ${currentText}`;
      // Mark as processed
      el.setAttribute('data-hieroglyph-applied', 'true');
    }
  });
};

export default applyHieroglyphEffect;
