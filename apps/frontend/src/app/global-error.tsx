"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body style={{ fontFamily: "'Inter', sans-serif", margin: 0 }}>
				<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
					<h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
					<p className="mb-8 text-sm text-gray-500">
						{error.message || "An unexpected error occurred."}
					</p>
					<button
						className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
						type="button"
						onClick={() => reset()}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
