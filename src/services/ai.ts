// This service simulates scalable backend API calls for AI features.
// In production, these would be fetch/axios calls to your actual endpoints (e.g., /api/v1/ai/generate).

export interface GenerateOptions {
  productName?: string;
  category?: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'exciting';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Generates a short, catchy product description.
   */
  generateShortDescription: async (options: GenerateOptions): Promise<string> => {
    await delay(1200); // Simulate network latency
    const name = options.productName || "this premium product";
    return `Discover the exceptional quality of ${name}. Designed for maximum performance and reliability, it's the perfect addition to your daily workflow.`;
  },

  /**
   * Generates a comprehensive, rich-text format product description.
   */
  generateFullDescription: async (options: GenerateOptions): Promise<string> => {
    await delay(2000); // Simulate network latency
    const name = options.productName || "This product";
    return `
      <p>Elevate your experience with <strong>${name}</strong>, engineered with precision to meet the highest enterprise standards.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Unmatched Durability:</strong> Built with premium materials to withstand daily rigorous use.</li>
        <li><strong>Modern Design:</strong> A sleek, minimalist aesthetic that complements any professional environment.</li>
        <li><strong>Seamless Integration:</strong> Works effortlessly right out of the box with zero complex configuration.</li>
      </ul>
      <p>Whether you're scaling your operations or looking for a reliable daily driver, ${name} delivers uncompromising performance.</p>
    `;
  },

  /**
   * Generates SEO metadata (Title, Description, Keywords).
   */
  generateSEO: async (options: GenerateOptions) => {
    await delay(1500);
    const name = options.productName || "Product";
    return {
      title: `Buy ${name} | Premium Quality & Fast Shipping`,
      description: `Shop the new ${name}. Experience premium quality, exceptional design, and reliable performance. Order now for exclusive deals.`,
      keywords: `${name.toLowerCase()}, premium ${name.toLowerCase()}, buy ${name.toLowerCase()}`
    };
  }
};
