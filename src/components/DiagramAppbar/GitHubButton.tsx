import appConfig from "@/lib/config";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import type React from "react";
import { siGithub } from "simple-icons/icons";

const GitHubButton: React.FC = () => (
	<Link
		href={appConfig.publisher.repository}
		target="_blank"
		rel="noopener noreferrer"
		passHref
	>
		<Tooltip title="View on GitHub">
			<IconButton component="span" aria-label="View on GitHub">
				<svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					height="24"
					width="24"
				>
					<title>{siGithub.title}</title>
					<path d={siGithub.path} />
				</svg>
			</IconButton>
		</Tooltip>
	</Link>
);

export default GitHubButton;
