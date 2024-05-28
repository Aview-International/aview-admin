export const pasteFromClipboard = async () => {
  const text = await navigator.clipboard.readText();
  setPastedText(text);
};
