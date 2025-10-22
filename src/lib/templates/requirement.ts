import type { DiagramTemplate } from "./types";

export const requirementTemplates: DiagramTemplate[] = [
	{
		id: "requirement-basic",
		name: "Basic Requirements",
		category: "Requirement",
		description: "Simple requirement diagram showing relationships",
		tags: ["requirement", "basic", "relationships"],
		code: `requirementDiagram

    requirement test_req {
        id: 1
        text: the test text.
        risk: high
        verifymethod: test
    }

    functionalRequirement test_req2 {
        id: 1.1
        text: the second test text.
        risk: low
        verifymethod: inspection
    }

    performanceRequirement test_req3 {
        id: 1.2
        text: the third test text.
        risk: medium
        verifymethod: demonstration
    }

    interfaceRequirement test_req4 {
        id: 1.2.1
        text: the fourth test text.
        risk: medium
        verifymethod: analysis
    }

    physicalRequirement test_req5 {
        id: 1.2.2
        text: the fifth test text.
        risk: low
        verifymethod: analysis
    }

    designConstraint test_req6 {
        id: 1.2.3
        text: the sixth test text.
        risk: high
        verifymethod: test
    }

    element test_entity {
        type: simulation
    }

    element test_entity2 {
        type: word doc
        docRef: reqs/test_entity
    }

    element test_entity3 {
        type: "test suite"
        docRef: github.com/all_the_tests
    }


    test_req - satisfies -> test_entity2
    test_req - verifies -> test_entity3
    test_req - refines -> test_req2
    test_req2 - traces -> test_req3
    test_req3 - contains -> test_req4
    test_req4 - derives -> test_req5
    test_req5 - satisfies -> test_entity`,
	},
	{
		id: "requirement-software",
		name: "Software Requirements",
		category: "Requirement",
		description: "Software system requirements with verification methods",
		tags: ["requirement", "software", "verification"],
		code: `requirementDiagram

    functionalRequirement user_login {
        id: FR_001
        text: User must be able to log in with username and password
        risk: high
        verifymethod: test
    }

    functionalRequirement password_reset {
        id: FR_002
        text: User must be able to reset forgotten password
        risk: medium
        verifymethod: test
    }

    performanceRequirement response_time {
        id: PR_001
        text: System must respond within 2 seconds
        risk: high
        verifymethod: test
    }

    interfaceRequirement api_endpoint {
        id: IR_001
        text: REST API must support JSON format
        risk: medium
        verifymethod: inspection
    }

    designConstraint database_type {
        id: DC_001
        text: Must use PostgreSQL database
        risk: low
        verifymethod: analysis
    }

    element login_module {
        type: "component"
        docRef: "src/auth/login.js"
    }

    element test_suite {
        type: "test"
        docRef: "tests/auth.test.js"
    }

    element api_spec {
        type: "specification"
        docRef: "docs/api.md"
    }

    user_login - satisfies -> login_module
    user_login - verifies -> test_suite
    password_reset - refines -> user_login
    response_time - traces -> api_endpoint
    api_endpoint - satisfies -> api_spec`,
	},
];
