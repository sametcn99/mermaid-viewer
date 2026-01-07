"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	selectAuthInitialized,
	selectIsAuthenticated,
	selectIsLocalOnly,
	setLastSyncAt,
} from "@/store/authSlice";
import {
	performFullSync,
	subscribeToSyncRequests,
	type SyncRequest,
} from "@/lib/sync";
import { refreshSavedDiagrams } from "@/store/savedDiagramsSlice";
import { refreshTemplateCollections } from "@/store/templateCollectionsSlice";
import { setCustomAlertMessage } from "@/store/mermaidSlice";

const BACKGROUND_DELAY_MS = 1200;

// Support both DOM (number) and Node typings in mixed TS configs.
type TimeoutId = number | ReturnType<typeof setTimeout> | null;

type SyncState = {
	timerId: TimeoutId;
	inFlight: boolean;
	pendingImmediate: boolean;
	lastReason: string | null;
};

export default function SyncManager() {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const isLocalOnly = useAppSelector(selectIsLocalOnly);
	const authInitialized = useAppSelector(selectAuthInitialized);

	const syncStateRef = useRef<SyncState>({
		timerId: null,
		inFlight: false,
		pendingImmediate: false,
		lastReason: null,
	});
	const initialRequestedRef = useRef(false);

	const canSync = authInitialized && isAuthenticated && !isLocalOnly;

	useEffect(() => {
		if (!canSync) {
			const current = syncStateRef.current;
			if (current.timerId) {
				clearTimeout(current.timerId);
			}
			syncStateRef.current = {
				timerId: null,
				inFlight: false,
				pendingImmediate: false,
				lastReason: null,
			};
			initialRequestedRef.current = false;
			return;
		}

		const runSync = async (reason: string) => {
			const state = syncStateRef.current;

			if (state.inFlight) {
				state.pendingImmediate = true;
				return;
			}

			if (!navigator.onLine) {
				state.pendingImmediate = true;
				return;
			}

			state.inFlight = true;
			state.pendingImmediate = false;
			state.lastReason = reason;

			try {
				const response = await performFullSync();
				dispatch(setLastSyncAt(response.syncedAt));
				await dispatch(refreshSavedDiagrams());
				void dispatch(refreshTemplateCollections());
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Automatic sync failed";
				dispatch(setCustomAlertMessage(message));
			} finally {
				state.inFlight = false;
				if (state.pendingImmediate) {
					state.pendingImmediate = false;
					void runSync("queued-after-pending");
				}
			}
		};

		const scheduleSync = (request: SyncRequest) => {
			const state = syncStateRef.current;
			state.lastReason = request.reason;
			const delay = request.priority === "immediate" ? 0 : BACKGROUND_DELAY_MS;

			if (request.priority === "immediate" && state.timerId) {
				clearTimeout(state.timerId);
				state.timerId = null;
			}

			if (delay === 0) {
				void runSync(request.reason);
				return;
			}

			if (state.timerId) return;

			state.timerId = window.setTimeout(() => {
				state.timerId = null;
				void runSync(request.reason);
			}, delay);
		};

		const unsubscribe = subscribeToSyncRequests(scheduleSync);

		if (!initialRequestedRef.current) {
			initialRequestedRef.current = true;
			scheduleSync({
				reason: "auth-initial-sync",
				priority: "immediate",
				requestedAt: Date.now(),
			});
		}

		const handleVisibility = () => {
			if (document.visibilityState === "visible") {
				scheduleSync({
					reason: "visibility-resume",
					priority: "background",
					requestedAt: Date.now(),
				});
			}
		};

		const handleOnline = () => {
			scheduleSync({
				reason: "network-online",
				priority: "immediate",
				requestedAt: Date.now(),
			});
		};

		window.addEventListener("online", handleOnline);
		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			unsubscribe();
			const state = syncStateRef.current;
			if (state.timerId) {
				clearTimeout(state.timerId);
				state.timerId = null;
			}
			window.removeEventListener("online", handleOnline);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [canSync, dispatch]);

	return null;
}
