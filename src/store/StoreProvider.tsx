"use client";

import { Provider } from "react-redux";
import type { PropsWithChildren } from "react";
import { store } from "./index";

export default function StoreProvider({ children }: PropsWithChildren) {
	return <Provider store={store}>{children}</Provider>;
}
