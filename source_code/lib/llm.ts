/**
 * LLM Analysis Service using Groq (llama-3.3-70b-versatile / mixtral-8x7b).
 * Groq provides the fastest inference for large models — ideal for this use case.
 *
 * Two main functions:
 * 1. analyzeArchitecture — generates overall flow + Mermaid architecture diagram
 * 2. analyzeRoutes       — extracts and describes all routes in structured JSON
 */
import Groq from "groq-sdk";
import { truncate } from "./utils";
import type { KeyFile, TechStack, TreeItem, TechStackCategory } from "./github";

function formatTechStack(techStack: TechStack): string {
    let s = "";
    if (techStack.frontend) {
        const fDeps = [...techStack.frontend.dependencies, ...techStack.frontend.devDependencies].slice(0, 40).join(", ");
        s += `Frontend (${techStack.frontend.source}): ${fDeps}\n`;
    }
    if (techStack.backend) {
        const bDeps = [...techStack.backend.dependencies, ...techStack.backend.devDependencies].slice(0, 40).join(", ");
        s += `Backend (${techStack.backend.source}): ${bDeps}\n`;
    }
    return s.trim() || "None detected";
}

// ─── Groq Client Pool ────────────────────────────────────────────────────────
// Three separate clients to distribute TPM load across 3 API keys:
//   groqMain  → GROQ_API_KEY   : all architecture analysis + deep route analysis
//   groq1     → GROQ_API_KEY_1 : file-identification for even-indexed routes (0,2,4…)
//   groq2     → GROQ_API_KEY_2 : file-identification for odd-indexed routes  (1,3,5…)
const groqMain = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groq1 = new Groq({ apiKey: process.env.GROQ_API_KEY_1 });
const groq2 = new Groq({ apiKey: process.env.GROQ_API_KEY_2 });

/** Pick groq1 or groq2 based on route index (round-robin). */
function pickSecondaryClient(routeIndex: number): Groq {
    return routeIndex % 2 === 0 ? groq1 : groq2;
}

// Model to use — llama-3.3-70b-versatile is the best available on Groq's free tier
const MODEL = "llama-3.3-70b-versatile";
// Max tokens Groq will return
const MAX_TOKENS = 8192;

/**
 * Extracts JSON from an LLM response that may be wrapped in markdown code blocks.
 */
function extractJSON<T>(text: string): T {
    // Try ```json ... ``` or ``` ... ``` block first
    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = blockMatch ? blockMatch[1].trim() : text.trim();
    return JSON.parse(jsonStr) as T;
}

// ─── 1. Architecture Analysis ─────────────────────────────────────────────────

export interface ArchNode {
    id: string;
    label: string;
    type: "frontend" | "backend" | "service" | "database" | "external" | "infrastructure";
}

export interface ArchEdge {
    from: string;
    to: string;
    label?: string;
}

export interface ArchitectureJson {
    nodes: ArchNode[];
    edges: ArchEdge[];
    notes?: string[];
}

export interface ArchitectureAnalysis {
    overallFlow: string;
    architectureJson: ArchitectureJson;
}

export async function analyzeArchitecture(
    fileTree: TreeItem[],
    techStack: TechStack,
    keyFiles: KeyFile[]
): Promise<ArchitectureAnalysis> {
    const fileTreeStr = fileTree
        .map((f) => `${f.type === "tree" ? "📁" : "📄"} ${f.path}`)
        .join("\n");

    const keyFilesStr = keyFiles
        .map((f) => `\n\n=== FILE: ${f.path} ===\n${f.content}`)
        .join("");

    const systemPrompt = `You are a senior software architect specializing in production-level system design. Your job is to analyze a GitHub project and return a DETAILED, PRODUCTION-READY architecture diagram as a strict JSON object.
Return ONLY valid JSON — no markdown, no commentary, no explanation outside the JSON.`;

    const userPrompt = `Analyze this project and return a JSON object with EXACTLY these two keys:

1. "overallFlow": A comprehensive paragraph (200-300 words) explaining:
   - What this project does (its purpose and business value)
   - Complete data flow: User → Frontend → API → Services → Database → Response
   - Authentication and authorization flow
   - All technologies and how they integrate
   - External services and APIs
   - Caching strategy (if any)
   - Async processing (if any)

2. "architectureJson": A DETAILED, PRODUCTION-LEVEL architecture diagram as JSON.

   CRITICAL REQUIREMENTS - Include ALL these layers if detected:
   
   🔹 Layer 1: Client & Authentication
   - User/Browser node
   - Frontend framework (React, Next.js, Vue, etc.)
   - OAuth/Auth provider (GitHub, Google, Auth0, etc.)
   - Session management
   
   🔹 Layer 2: API Gateway & Rate Limiting
   - API Routes/Controllers
   - Auth middleware
   - Input validation
   - Rate limiter (Redis-backed if detected)
   
   🔹 Layer 3: Async Processing (CRITICAL if detected)
   - Job Queue (BullMQ, RabbitMQ, SQS, Celery, etc.)
   - Worker Service (separate from API)
   - Background jobs
   
   🔹 Layer 4: External Integrations
   - GitHub API (with rate limit boundary)
   - Third-party APIs (Stripe, SendGrid, etc.)
   - AI/ML services (OpenAI, Groq, etc.)
   
   🔹 Layer 5: Business Logic & Services
   - Core services
   - Data processing
   - Business rules
   
   🔹 Layer 6: Caching Layer
   - Redis/Memcached
   - Cache strategy
   - Session storage
   
   🔹 Layer 7: Storage Layer
   - Primary database (PostgreSQL, MongoDB, MySQL, etc.)
   - Secondary databases
   - File storage (S3, etc.)

   Node Requirements:
   - Each node MUST have:
       "id"    : unique snake_case string, no spaces
       "label" : clear, descriptive name with technology (e.g., "Next.js API Routes", "Redis Cache", "MongoDB Database")
       "type"  : one of: frontend | backend | service | database | external | infrastructure
   - Include 10-20 nodes for a complete picture
   - Group related components logically
   - Show ALL critical infrastructure

   Edge Requirements:
   - Each edge MUST have:
       "from"  : source node id
       "to"    : target node id
       "label" : specific action/data (e.g., "POST /api/analyze", "OAuth token", "Enqueue job", "Fetch repo data")
   - Show complete request/response flow
   - Include async flows (job queues)
   - Show data flow directions clearly
   - NO self-loops (from === to is forbidden)

   Notes Requirements:
   - Include 4-8 architectural observations
   - Mention authentication strategy
   - Mention async processing if present
   - Mention caching strategy
   - Mention rate limiting
   - Mention scalability considerations

   Example structure (expand this significantly):
   {
     "nodes": [
       { "id": "user", "label": "User Browser", "type": "frontend" },
       { "id": "frontend", "label": "Next.js Frontend", "type": "frontend" },
       { "id": "auth", "label": "GitHub OAuth", "type": "external" },
       { "id": "api", "label": "Next.js API Routes", "type": "backend" },
       { "id": "auth_middleware", "label": "Auth Middleware", "type": "service" },
       { "id": "rate_limiter", "label": "Redis Rate Limiter", "type": "infrastructure" },
       { "id": "job_queue", "label": "BullMQ Job Queue", "type": "infrastructure" },
       { "id": "worker", "label": "Worker Service", "type": "service" },
       { "id": "github_api", "label": "GitHub API", "type": "external" },
       { "id": "cache", "label": "Redis Cache", "type": "database" },
       { "id": "db", "label": "MongoDB", "type": "database" }
     ],
     "edges": [
       { "from": "user", "to": "frontend", "label": "HTTPS request" },
       { "from": "frontend", "to": "auth", "label": "OAuth flow" },
       { "from": "frontend", "to": "api", "label": "API calls" },
       { "from": "api", "to": "auth_middleware", "label": "Validate token" },
       { "from": "api", "to": "rate_limiter", "label": "Check limits" },
       { "from": "api", "to": "job_queue", "label": "Enqueue analysis" },
       { "from": "job_queue", "to": "worker", "label": "Process job" },
       { "from": "worker", "to": "github_api", "label": "Fetch repo data" },
       { "from": "worker", "to": "cache", "label": "Cache results" },
       { "from": "worker", "to": "db", "label": "Save analysis" }
     ],
     "notes": [
       "GitHub OAuth for authentication",
       "Redis-backed rate limiting (100 req/min)",
       "Async job processing with BullMQ",
       "GitHub API rate limit: 5000 req/hr",
       "MongoDB for persistent storage",
       "Redis for caching and sessions"
     ]
   }

## Project File Tree
\`\`\`
${truncate(fileTreeStr, 4000)}
\`\`\`

## Tech Stack
${formatTechStack(techStack)}

## Key File Contents
${truncate(keyFilesStr, 18000)}

Return ONLY the JSON object.`;

    const response = await groqMain.chat.completions.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    try {
        return extractJSON<ArchitectureAnalysis>(text);
    } catch {
        return {
            overallFlow: text.replace(/```[\s\S]*?```/g, "").slice(0, 600),
            architectureJson: {
                nodes: [{ id: "error", label: "Could not generate diagram", type: "infrastructure" }],
                edges: [],
                notes: ["LLM response could not be parsed as JSON."],
            },
        };
    }
}

// ─── 2. Route Analysis ────────────────────────────────────────────────────────

export interface RouteDetail {
    path: string;
    method: string;
    functionality: string;
    contribution: string;
    lifecycleRole: string;
}

export async function analyzeRoutes(
    keyFiles: KeyFile[],
    fileTree: TreeItem[],
    techStack: TechStack
): Promise<RouteDetail[]> {
    // Step A: Try README files first
    const readmeFiles = keyFiles.filter((f) =>
        f.path.toLowerCase().includes("readme")
    );

    // Step B: Fallback to routing files
    const routingFiles = keyFiles.filter((f) => {
        const p = f.path.toLowerCase();
        return (
            p.includes("route") || p.includes("router") || p.includes("urls.py") ||
            p.includes("server") || p.includes("app.js") || p.includes("app.ts") ||
            p.includes("main.py") || p.includes("index.js") || p.includes("index.ts") ||
            p.includes("/api/") || p.includes("pages/") || p.includes("app/")
        );
    });

    const sourceFiles = readmeFiles.length > 0
        ? [...readmeFiles, ...routingFiles].slice(0, 8)
        : routingFiles.slice(0, 8);

    const sourceStr = sourceFiles
        .map((f) => `\n\n=== ${f.path} ===\n${f.content}`)
        .join("");

    // App directory structure for inference
    const appDirFiles = fileTree
        .filter((f) => {
            const p = f.path ?? "";
            return (
                p.startsWith("app/") || p.startsWith("pages/") ||
                p.startsWith("src/app/") || p.startsWith("src/pages/")
            );
        })
        .map((f) => f.path)
        .slice(0, 60)
        .join("\n");

    const systemPrompt = `You are an expert API documentation engineer. 
Return ONLY a valid JSON array. No markdown, no explanation outside the JSON array.`;

    const userPrompt = `Analyze these project files and return a JSON ARRAY of ALL routes, pages, and endpoints.

## Tech Stack
${formatTechStack(techStack)}

## Source Files (README + routing files)
${truncate(sourceStr, 20000)}

## App Directory Structure (for inference)
\`\`\`
${truncate(appDirFiles, 2000)}
\`\`\`

Each array item MUST have these exact keys:
- "path": URL path (e.g., "/api/users", "/dashboard")
- "method": HTTP method ("GET", "POST", "PUT", "PATCH", "DELETE") or "PAGE" for UI routes
- "functionality": Plain English explanation of what this route does (2-3 sentences)
- "contribution": How this route contributes to the overall project (1-2 sentences)  
- "lifecycleRole": ONE of: "Authentication", "Data Fetching", "CRUD Operation", "UI Rendering", "File Processing", "Third-party Integration", "Real-time", "Navigation", "Background Processing"

Rules:
- Include BOTH frontend pages AND backend API endpoints
- For Next.js app/ directory: app/dashboard/page.tsx → path "/dashboard", method "PAGE"
- For Express: router.get('/api/users') → path "/api/users", method "GET"
- Include at minimum 5 routes
- Be specific about each route's purpose

Return ONLY the JSON array.`;

    const response = await groqMain.chat.completions.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const text = response.choices[0]?.message?.content ?? "[]";

    try {
        return extractJSON<RouteDetail[]>(text);
    } catch {
        // Minimal fallback
        return [
            {
                path: "/",
                method: "PAGE",
                functionality: "Main entry point of the application.",
                contribution: "Serves as the landing page for all users.",
                lifecycleRole: "UI Rendering",
            },
        ];
    }
}

// ─── 3. Specific Route Analysis ──────────────────────────────────────────────

export interface RouteAnalysisResult {
    flowVisualization: string;
    executionTrace: string | string[];
}

export async function identifyRelevantFilesForRoute(
    targetRoute: string,
    filePaths: string[],
    routeIndex: number = 0   // 0-based index in the route list → selects key1 or key2
): Promise<string[]> {
    const systemPrompt = `You are a Senior Software Engineer AI. Your task is to identify which files in a repository are most likely to handle a particular route. 
Return ONLY a JSON array of strings containing up to a maximum of 10 file paths. Choose the entrypoint (e.g. main.py, app.js), the specific router/controller file, and the core service/database logic files related to the route. No markdown, purely a JSON array.`;

    const userPrompt = `### 🎯 TARGET_ROUTE
${targetRoute}

### 📂 REPOSITORY FILE PATHS
${filePaths.join("\n")}

Return a JSON array of up to 10 strings representing the exact file paths.`;

    // Use key1 / key2 alternately to distribute TPM load away from the main key
    const client = pickSecondaryClient(routeIndex);

    const response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    try {
        let text = response.choices[0]?.message?.content ?? "[]";
        text = text.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
            return parsed.filter(p => typeof p === "string");
        }
        return [];
    } catch (e) {
        console.error("Failed to parse identified files JSON:", e);
        return [];
    }
}

export async function analyzeSpecificRoute(
    targetRoute: string,
    codebaseFiles: string
): Promise<RouteAnalysisResult> {
    const systemPrompt = `You are an Expert Software Architect and Code Reverser. Your task is to analyze the provided raw codebase and reverse-engineer the exact execution flow for a specific target route.

Analyze the provided files to find exactly where and how TARGET_ROUTE is defined, handled, and executed. Trace its entire lifecycle.

DO NOT OUTPUT JSON. Output your analysis STRICTLY using the exact markdown headers below.

### FLOW_VISUALIZATION
Provide a Mermaid.js flowchart mapping the chronological execution flow.
- Use 'graph TD'.
- Nodes MUST use simple alphanumeric IDs (e.g., A, B, C, N1, N2).
- Node labels MUST be wrapped in double quotes. Limit labels to strictly file names and function names, e.g., A["routes.js"], B["main()"].
- RELATIONS MUST ONLY BE simple arrows (e.g., A --> B). Do NOT use text on arrows (like A -- "calls" --> B) as it frequently causes syntax errors.
- DO NOT use unquoted special characters like parentheses, colons, or dashes inside the node ID or outside the quotes.
- Example of valid mermaid:
  \`\`\`mermaid
  graph TD
    A["main.py"] --> B["auth.py (signup)"]
    B --> C["db.py (save_user)"]
  \`\`\`
- Wrap the strings in standard markdown mermaid backticks \`\`\`mermaid ... \`\`\`.

### EXECUTION_TRACE
Provide a chronological, step-by-step breakdown of the execution flow across the files.
For EVERY step, use EXACTLY this format:

**Step [Number]: [Action Description]**
* **Location:** [File Path] > [Function Name]
* **Code Snippet:**
  <<<FILE:[Exact File Path]:[StartLine]-[EndLine]>>>
* **Explanation:** Write a DETAILED, thorough explanation (minimum 5-7 sentences) covering:
  1. What this specific block of code does and WHY it exists at this point in the flow.
  2. A description of every important variable, parameter, or return value and its purpose.
  3. How this block connects to the previous and next step in the execution chain.
  4. Any side effects, database interactions, API calls, or state mutations that occur here.
  5. Edge cases or error paths handled in this block, if any.
  Do NOT write a single-sentence summary. Every explanation MUST be comprehensive and educational.

CRITICAL: DO NOT WRITE OR SUMMARIZE ANY CODE YOURSELF in the Code Snippet section! You MUST use the exact <<<FILE:path:start-end>>> syntax using the line numbers provided in the reference files. Do NOT use markdown code blocks. Just use the tag.`;

    const userPrompt = `### 🎯 TARGET_ROUTE
${targetRoute}

### 📂 CODEBASE_FILES
${truncate(codebaseFiles, 35000)}

Output exactly the two headers ### FLOW_VISUALIZATION and ### EXECUTION_TRACE followed by their content.`;

    // Always use the main key for the heavy analysis to get the best quality
    const response = await groqMain.chat.completions.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const text = response.choices[0]?.message?.content ?? "";

    try {
        const flowMatch = text.match(/### FLOW_VISUALIZATION\n([\s\S]*?)(?=### EXECUTION_TRACE)/);
        const traceMatch = text.match(/### EXECUTION_TRACE\n([\s\S]*)/);

        let flowVisualization = flowMatch ? flowMatch[1].trim() : "```mermaid\ngraph TD\n  A[\"Failed to extract flowchart\"]\n```";
        let executionTrace = traceMatch ? traceMatch[1].trim() : "Failed to extract trace from LLM response.";

        // Ensure mermaid wrapping exists if missing in flowVisualization
        if (flowVisualization && !flowVisualization.includes("```mermaid") && !flowVisualization.includes("Failed")) {
            flowVisualization = `\`\`\`mermaid\n${flowVisualization}\n\`\`\``;
        }

        return {
            flowVisualization,
            executionTrace
        };
    } catch (e) {
        console.error("Failed to parse specific route markdown:", text);
        return {
            flowVisualization: "```mermaid\ngraph TD\n  A[\"Failed to generate flowchart\"]\n```",
            executionTrace: "Failed to parse execution trace. Please try again."
        };
    }
}
