export type UserConfig = {
  title?: string
  description?: string
}
export interface SiteConfig {
  root: string
  configPath?: string
  siteData: UserConfig
}
