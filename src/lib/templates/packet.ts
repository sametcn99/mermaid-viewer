import type { DiagramTemplate } from "./types";

export const packetTemplates: DiagramTemplate[] = [
	{
		id: "packet-basic",
		name: "Basic Packet Diagram",
		category: "Packet",
		description: "Simple packet structure visualization",
		tags: ["packet", "basic", "structure", "network"],
		code: `packet-beta
  title TCP Packet Structure
  0-15: "Source Port"
  16-31: "Destination Port"
  32-63: "Sequence Number"
  64-95: "Acknowledgment Number"
  96-99: "Data Offset"
  100-105: "Reserved"
  106-111: "Flags"
  112-127: "Window"
  128-143: "Checksum"
  144-159: "Urgent Pointer"
  160-191: "Options"
  192-255: "Data"`,
	},
	{
		id: "packet-ipv4",
		name: "IPv4 Header",
		category: "Packet",
		description: "IPv4 packet header structure",
		tags: ["packet", "ipv4", "header", "protocol"],
		code: `packet-beta
  title IPv4 Header
  0-3: "Version"
  4-7: "IHL"
  8-15: "Type of Service"
  16-31: "Total Length"
  32-47: "Identification"
  48-50: "Flags"
  51-63: "Fragment Offset"
  64-71: "Time to Live"
  72-79: "Protocol"
  80-95: "Header Checksum"
  96-127: "Source Address"
  128-159: "Destination Address"
  160-191: "Options"
  192-223: "Padding"`,
	},
	{
		id: "packet-ethernet",
		name: "Ethernet Frame",
		category: "Packet",
		description: "Ethernet frame structure visualization",
		tags: ["packet", "ethernet", "frame", "layer2"],
		code: `packet-beta
  title Ethernet Frame
  0-47: "Destination MAC"
  48-95: "Source MAC"
  96-111: "EtherType"
  112-351: "Payload"
  352-383: "Frame Check Sequence"`,
	},
];
