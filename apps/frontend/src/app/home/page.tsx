import { Box } from "@mui/material";
import type { Metadata } from "next";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import InteractiveDemo from "@/components/home/InteractiveDemo";
import LearnMermaidSyntax from "@/components/home/LearnMermaidSyntax";
import OpenSourceBanner from "@/components/home/OpenSourceBanner";

export const metadata: Metadata = {
	title: "Home",
	openGraph: {
		title: "Home",
	},
};

export default function HomePage() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				color: "text.primary",
			}}
		>
			<Hero />
			<HowItWorks />
			<InteractiveDemo />
			<Features />
			<LearnMermaidSyntax />
			<FAQ />
			<OpenSourceBanner />
			<Footer />
		</Box>
	);
}
