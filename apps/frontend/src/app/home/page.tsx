import type { Metadata } from "next";
import { Box } from "@mui/material";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";
import InteractiveDemo from "@/components/home/InteractiveDemo";
import SupportSection from "@/components/home/SupportSection";
import LearnMermaidSyntax from "@/components/home/LearnMermaidSyntax";
import HowItWorks from "@/components/home/HowItWorks";
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
			<SupportSection />
			<Footer />
		</Box>
	);
}
