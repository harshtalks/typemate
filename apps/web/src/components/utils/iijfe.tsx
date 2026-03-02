// Immediately Invoked JSX Function Expression

import type { ReactNode } from "react";

export function IIJFE(props: { children: () => ReactNode }) {
  return props.children();
}
