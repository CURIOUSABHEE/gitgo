export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string
  email: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  location: string
  blog: string
  company: string
  twitter_username: string
  hireable: boolean
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

export class GitHubAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async fetch(endpoint: string) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getUser(): Promise<GitHubUser> {
    return this.fetch("/user")
  }

  async getUserEmails() {
    return this.fetch("/user/emails")
  }

  async getRepos(): Promise<GitHubRepo[]> {
    return this.fetch("/user/repos?sort=updated&per_page=100")
  }

  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    return this.fetch(`/repos/${owner}/${repo}/languages`)
  }

  async getUserOrgs() {
    return this.fetch("/user/orgs")
  }

  async getContributions(username: string) {
    // Note: GitHub doesn't have a direct API for contribution graph
    // You might need to use GraphQL API or scrape the profile page
    return this.fetch(`/users/${username}/events/public?per_page=100`)
  }
}
