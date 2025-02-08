const hieroglyphs = ["𓂀", "𓏏", "𓎛", "𓆑", "𓅓", "𓋴", "𓂻", "𓉔", "𓊪", "𓄿"];

const applyHieroglyphEffect = () => {
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  elements.forEach((el) => {
    const randomHieroglyph = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
    el.textContent = `${randomHieroglyph} ${el.textContent}`;
  });
};

export default applyHieroglyphEffect;
