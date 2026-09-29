export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export const SITH = ['s', 'i', 't', 'h'];

function isEditable(t?: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable === true;
}

export function createSequenceMatcher(target: string[]) {
  let i = 0;
  return (key: string, el?: EventTarget | null): boolean => {
    if (isEditable(el)) { i = 0; return false; }
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (k === target[i]) {
      i += 1;
      if (i === target.length) { i = 0; return true; }
    } else {
      i = k === target[0] ? 1 : 0;
    }
    return false;
  };
}
