// Portfolio JSON Schema System

export type SectionType = 
  | "hero" 
  | "about" 
  | "skills" 
  | "projects" 
  | "experience" 
  | "contact"
  | "stats"
  | "testimonials"

export interface PortfolioSection {
  id: string
  type: SectionType
  order: number
  visible: boolean
  data: Record<string, any>
}

export interface PortfolioSchema {
  id: string
  userId: string
  templateId: string
  theme: string
  sections: PortfolioSection[]
  metadata: {
    title: string
    description: string
    favicon?: string
    ogImage?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Default section data generators
export const createDefaultSection = (type: SectionType, order: number): PortfolioSection => {
  const baseSection = {
    id: `${type}-${Date.now()}`,
    type,
    order,
    visible: true,
  }

  switch (type) {
    case "hero":
      return {
        ...baseSection,
        data: {
          title: "Full Stack Developer",
          subtitle: "Building amazing web experiences",
          description: "Passionate about creating elegant solutions to complex problems",
          ctaText: "View My Work",
          ctaLink: "#projects",
          backgroundImage: "",
          showAvatar: true,
        },
      }
    case "about":
      return {
        ...baseSection,
        data: {
          heading: "About Me",
          content: "I'm a passionate developer with experience in building modern web applications.",
          image: "",
          highlights: [
            "5+ years of experience",
            "Open source contributor",
            "Problem solver",
          ],
        },
      }
    case "skills":
      return {
        ...baseSection,
        data: {
          heading: "Skills & Technologies",
          layout: "grid", // grid, list, tags
          skills: [],
        },
      }
    case "projects":
      return {
        ...baseSection,
        data: {
          heading: "Featured Projects",
          layout: "grid", // grid, list, masonry
          projects: [],
        },
      }
    case "experience":
      return {
        ...baseSection,
        data: {
          heading: "Experience",
          layout: "timeline", // timeline, list
          items: [],
        },
      }
    case "contact":
      return {
        ...baseSection,
        data: {
          heading: "Get In Touch",
          description: "Feel free to reach out for collaborations or just a friendly hello",
          email: "",
          social: [],
          showForm: false,
        },
      }
    case "stats":
      return {
        ...baseSection,
        data: {
          heading: "GitHub Stats",
          stats: [],
        },
      }
    default:
      return {
        ...baseSection,
        data: {},
      }
  }
}

// Template configurations with default sections
export const templateConfigs = {
  minimal: {
    id: "minimal",
    name: "Minimal Developer",
    description: "Clean typography-focused design for developers who let their work speak",
    defaultSections: ["hero", "about", "skills", "projects", "contact"] as SectionType[],
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      headingWeight: "300",
      bodyWeight: "400",
      headingSize: "clamp(2rem, 5vw, 3rem)",
      bodySize: "1rem",
      lineHeight: "1.8",
    },
    spacing: {
      section: "6rem",
      element: "2rem",
      compact: "1rem",
    },
  },
  creative: {
    id: "creative",
    name: "Creative Designer",
    description: "Bold and artistic with asymmetric layouts and vibrant colors",
    defaultSections: ["hero", "projects", "skills", "about", "contact"] as SectionType[],
    typography: {
      fontFamily: "'Inter', sans-serif",
      headingWeight: "800",
      bodyWeight: "500",
      headingSize: "clamp(2.5rem, 6vw, 4rem)",
      bodySize: "1.125rem",
      lineHeight: "1.6",
    },
    spacing: {
      section: "8rem",
      element: "3rem",
      compact: "1.5rem",
    },
  },
  professional: {
    id: "professional",
    name: "Professional Resume",
    description: "Corporate and polished with structured sections and formal typography",
    defaultSections: ["hero", "about", "experience", "skills", "projects", "contact"] as SectionType[],
    typography: {
      fontFamily: "'Georgia', serif",
      headingWeight: "600",
      bodyWeight: "400",
      headingSize: "clamp(2rem, 4vw, 2.5rem)",
      bodySize: "1rem",
      lineHeight: "1.7",
    },
    spacing: {
      section: "5rem",
      element: "2.5rem",
      compact: "1.25rem",
    },
  },
  student: {
    id: "student",
    name: "Student Portfolio",
    description: "Fresh and energetic design perfect for students and early career",
    defaultSections: ["hero", "about", "projects", "skills", "contact"] as SectionType[],
    typography: {
      fontFamily: "'Poppins', sans-serif",
      headingWeight: "700",
      bodyWeight: "400",
      headingSize: "clamp(2.25rem, 5vw, 3.5rem)",
      bodySize: "1rem",
      lineHeight: "1.75",
    },
    spacing: {
      section: "4rem",
      element: "2rem",
      compact: "1rem",
    },
  },
}

// AI content generation helper
export const generatePortfolioContent = async (
  githubData: any,
  techMap: any,
  templateId: string
): Promise<PortfolioSection[]> => {
  const template = templateConfigs[templateId as keyof typeof templateConfigs]
  const sections: PortfolioSection[] = []

  template.defaultSections.forEach((sectionType, index) => {
    const section = createDefaultSection(sectionType, index)

    // Populate with real data
    switch (sectionType) {
      case "hero":
        section.data = {
          ...section.data,
          title: githubData.user.name || githubData.user.login,
          subtitle: githubData.user.bio || "Developer",
          description: `${githubData.stats.totalRepos} repositories • ${githubData.stats.totalStars} stars earned`,
        }
        break

      case "about":
        section.data = {
          ...section.data,
          content: githubData.user.bio || "Passionate developer building amazing projects",
          highlights: [
            `${githubData.stats.totalRepos} Public Repositories`,
            `${githubData.stats.totalStars} Stars Earned`,
            `${githubData.stats.totalForks} Total Forks`,
          ],
        }
        break

      case "skills":
        section.data = {
          ...section.data,
          skills: techMap?.mostUsed?.slice(0, 12).map((tech: any) => ({
            name: tech.technology,
            level: Math.min(100, (tech.totalProjects / githubData.stats.totalRepos) * 100),
            projects: tech.totalProjects,
          })) || [],
        }
        break

      case "projects":
        section.data = {
          ...section.data,
          projects: githubData.repos
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
            .map((repo: any) => ({
              id: repo.id,
              name: repo.name,
              description: repo.description || "No description available",
              image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
              thumbnail: repo.owner?.avatar_url || `https://github.com/${repo.owner?.login}.png`,
              tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4),
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              url: repo.html_url,
              demo: repo.homepage,
              language: repo.language,
              languageColor: getLanguageColor(repo.language),
            })),
        }
        break

      case "stats":
        section.data = {
          ...section.data,
          stats: [
            { label: "Repositories", value: githubData.stats.totalRepos, icon: "repo" },
            { label: "Stars Earned", value: githubData.stats.totalStars, icon: "star" },
            { label: "Total Forks", value: githubData.stats.totalForks, icon: "fork" },
            { label: "Followers", value: githubData.user.followers, icon: "users" },
          ],
        }
        break

      case "contact":
        section.data = {
          ...section.data,
          email: githubData.user.email || "",
          social: [
            { platform: "github", url: `https://github.com/${githubData.user.login}`, icon: "github" },
            githubData.user.blog && { platform: "website", url: githubData.user.blog, icon: "link" },
            githubData.user.twitter_username && { 
              platform: "twitter", 
              url: `https://twitter.com/${githubData.user.twitter_username}`, 
              icon: "twitter" 
            },
          ].filter(Boolean),
        }
        break
    }

    sections.push(section)
  })

  return sections
}

// Language color mapping
const getLanguageColor = (language: string | null): string => {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    React: "#61dafb",
  }
  return colors[language || ""] || "#8b949e"
}
