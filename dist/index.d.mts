type UserConfig = {
    title?: string;
    description?: string;
};

declare function defineConfig(config: UserConfig): UserConfig;

export { defineConfig };
