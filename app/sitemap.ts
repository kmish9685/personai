import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const domain = 'https://personai.fun';

    return [
        {
            url: domain,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${domain}/chat`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        },

        {
            url: `${domain}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${domain}/compare/chatgpt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/character-ai`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/claude`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/perplexity`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/executive-coaching`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${domain}/guides/inversion-framework`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${domain}/guides/leverage-analysis`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
