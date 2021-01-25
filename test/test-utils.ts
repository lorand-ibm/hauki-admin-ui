// eslint-disable-next-line import/prefer-default-export
export function getElementOrThrow(
  container: Element | null,
  selector: string
): Element {
  if (container === null) {
    throw new Error('container was null');
  }
  const element = container.querySelector(selector);

  if (!element) {
    throw new Error(`Element with selector ${selector} not found`);
  }

  return element;
}
