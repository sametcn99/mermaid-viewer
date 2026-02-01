"use client";

import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "./index";

export default function StoreProvider({ children }: PropsWithChildren) {
	return <Provider store={store}>{children}</Provider>;
}
