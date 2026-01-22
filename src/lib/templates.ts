import { ComponentData, ThemeConfig } from './supabase';

export type SiteType = 'political' | 'business' | 'personal' | 'nonprofit';

export type PageTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  siteType: SiteType;
  thumbnail: string;
  components: ComponentData[];
  theme: ThemeConfig;
};

// Template 1: Conservative Campaign Landing Page (Fully Populated)
const modernSaaSTemplate: PageTemplate = {
  id: 'modern-saas',
  name: 'Conservative Campaign',
  description: 'Professional campaign page for conservative candidates',
  category: 'National Campaigns',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  theme: {
    colors: {
      primary: '#DC2626',
      secondary: '#1D4ED8',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#F59E0B',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-1',
      type: 'hero',
      order: 0,
      props: {
        title: 'Fighting for American Values',
        subtitle: 'A proven conservative leader committed to freedom, security, and prosperity for all Americans',
        ctaText: 'Join Our Movement',
        ctaLink: '#',
      },
    },
    {
      id: 'text-1',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Trusted by thousands of conservative Americans</h2><p>From Main Street to Capitol Hill, we are building a movement for common-sense conservative values.</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-1',
      type: 'gallery',
      order: 2,
      props: {
        title: 'Our Conservative Priorities',
        images: [
          { url: 'https://images.unsplash.com/photo-1509715513011-e394f0cb20c4?w=400', alt: 'American Flag' },
          { url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400', alt: 'Community' },
          { url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', alt: 'Leadership' },
        ],
        columns: 3,
      },
    },
    {
      id: 'text-2',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">A Platform Built on American Values</h2><p class="text-xl">Lower taxes, stronger borders, individual liberty, and limited government - the principles that made America great.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'about-1',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Senator John Smith',
        candidateTitle: 'Candidate for U.S. Senate',
        bio: 'A lifelong conservative and dedicated public servant with over 20 years of experience fighting for American values.\n\nJohn has worked tirelessly to defend freedom, protect our constitutional rights, and ensure prosperity for all Americans.',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-1',
      type: 'news',
      order: 5,
      props: {
        title: 'Campaign News',
        articles: [
          {
            headline: 'Campaign Launch Event Draws Record Crowd',
            date: 'March 15, 2025',
            excerpt: 'Over 2,000 supporters gathered to kick off the campaign.',
            link: '#',
          },
          {
            headline: 'Endorsement from Veterans Association',
            date: 'March 10, 2025',
            excerpt: 'Local veterans group announces strong support.',
            link: '#',
          },
          {
            headline: 'Town Hall Meeting This Saturday',
            date: 'March 5, 2025',
            excerpt: 'Join us for an open discussion on the issues.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-1',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Join Our Team',
        description: 'Help us make a difference. Sign up to volunteer for our campaign.',
        buttonText: 'Sign Me Up',
        backgroundColor: '#f3f4f6',
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      order: 7,
      props: {
        heading: 'Donate to Our Campaign',
        description: 'Every contribution helps us fight for conservative values',
        buttonText: 'Donate Now',
        buttonLink: '#donate',
        backgroundColor: '#DC2626',
      },
    },
    {
      id: 'footer-1',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Smith for Senate',
        tagline: 'Fighting for American Values',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-1',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Smith for Senate Committee',
        pacId: 'C00789456',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 2: Grassroots Campaign (Fully Populated)
const creativePortfolioTemplate: PageTemplate = {
  id: 'creative-portfolio',
  name: 'Grassroots Campaign',
  description: 'Build momentum from the ground up',
  category: 'State Campaigns',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
  theme: {
    colors: {
      primary: '#DC2626',
      secondary: '#1D4ED8',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#F59E0B',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-2',
      type: 'hero',
      order: 0,
      props: {
        title: 'A Voice for the People',
        subtitle: 'Standing strong for conservative principles and American values in our community',
        ctaText: 'Volunteer Now',
        ctaLink: '#',
      },
    },
    {
      id: 'text-3',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">About Our Candidate</h2><p class="text-lg">A lifelong conservative with deep roots in our community, fighting for lower taxes, limited government, and individual freedom.</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-2',
      type: 'gallery',
      order: 2,
      props: {
        title: 'On the Campaign Trail',
        images: [
          { url: 'https://images.unsplash.com/photo-1509715513011-e394f0cb20c4?w=400', alt: 'Rally' },
          { url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400', alt: 'Community' },
          { url: 'https://images.unsplash.com/photo-1464652149449-f3b8538144aa?w=400', alt: 'Event' },
          { url: 'https://images.unsplash.com/photo-1464652149449-f3b8538144aa?w=400', alt: 'Town Hall' },
          { url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', alt: 'Meeting' },
          { url: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=400', alt: 'Speech' },
        ],
        columns: 3,
      },
    },
    {
      id: 'text-4',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Our Conservative Agenda</h2><p class="text-lg">Second Amendment Rights • Lower Taxes • Border Security • School Choice • Law & Order</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'about-2',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Sarah Johnson',
        candidateTitle: 'Candidate for State Senate',
        bio: 'A grassroots leader committed to bringing conservative values back to our state.\n\nSarah has spent her career fighting for lower taxes, individual freedom, and limited government.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-2',
      type: 'news',
      order: 5,
      props: {
        title: 'Campaign Updates',
        articles: [
          {
            headline: 'Grassroots Support Grows Statewide',
            date: 'March 18, 2025',
            excerpt: 'Campaign gains momentum with volunteers in every county.',
            link: '#',
          },
          {
            headline: 'Community Leaders Endorse Johnson',
            date: 'March 12, 2025',
            excerpt: 'Local business owners rally behind conservative platform.',
            link: '#',
          },
          {
            headline: 'Town Hall Series Begins Next Week',
            date: 'March 8, 2025',
            excerpt: 'Meet Sarah at community events across the district.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-2',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Volunteer Today',
        description: 'Be part of the grassroots movement. Every voice matters.',
        buttonText: 'Join Us',
        backgroundColor: '#f3f4f6',
      },
    },
    {
      id: 'cta-2',
      type: 'cta',
      order: 7,
      props: {
        heading: "Donate to Our Campaign",
        description: 'Help us win this race and restore conservative values',
        buttonText: 'Donate Now',
        buttonLink: '#donate',
        backgroundColor: '#DC2626',
      },
    },
    {
      id: 'footer-2',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Johnson for State Senate',
        tagline: 'A Voice for the People',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-2',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Johnson for State Senate Committee',
        pacId: 'C00654321',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 3: Dark Cyberpunk (Fully Populated)
const darkCyberpunkTemplate: PageTemplate = {
  id: 'dark-cyberpunk',
  name: 'Progressive Campaign',
  description: 'Modern campaign page with bold design',
  category: 'National Campaigns',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
  theme: {
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      background: '#0f172a',
      text: '#e2e8f0',
      accent: '#06b6d4',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'dark',
  },
  components: [
    {
      id: 'hero-3',
      type: 'hero',
      order: 0,
      props: {
        title: 'The Future is Now',
        subtitle: 'Next-generation AI-powered solutions for the modern world',
        ctaText: 'Enter Portal',
        ctaLink: '#',
      },
    },
    {
      id: 'text-5',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-4xl font-bold mb-4 text-pink-500">Revolutionary Technology</h2><p class="text-xl text-slate-300">Experience the cutting edge of innovation with our advanced AI platform that transforms how you work.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'gallery-3',
      type: 'gallery',
      order: 2,
      props: {
        title: 'Core Systems',
        images: [
          { url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', alt: 'System 1' },
          { url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400', alt: 'System 2' },
          { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', alt: 'System 3' },
        ],
        columns: 3,
      },
    },
    {
      id: 'text-6',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4 text-cyan-400">Our Progressive Platform</h2><p class="text-lg text-slate-400">Climate Action • Healthcare for All • Education Reform • Economic Justice</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'about-3',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Alex Martinez',
        candidateTitle: 'Progressive Candidate for Congress',
        bio: 'A champion for progressive values and social justice with a track record of fighting for working families.\n\nAlex believes in a future where everyone has access to healthcare, quality education, and economic opportunity.',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-3',
      type: 'news',
      order: 5,
      props: {
        title: 'Latest Updates',
        articles: [
          {
            headline: 'Major Labor Union Endorsement',
            date: 'March 20, 2025',
            excerpt: 'Workers across the district rally behind progressive platform.',
            link: '#',
          },
          {
            headline: 'Climate Plan Unveiled',
            date: 'March 15, 2025',
            excerpt: 'Comprehensive plan to address climate crisis announced.',
            link: '#',
          },
          {
            headline: 'Healthcare Town Hall This Friday',
            date: 'March 10, 2025',
            excerpt: 'Community discussion on universal healthcare access.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-3',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Join the Movement',
        description: 'Together we can build a better future for everyone.',
        buttonText: 'Get Involved',
        backgroundColor: '#0f172a',
      },
    },
    {
      id: 'cta-3',
      type: 'cta',
      order: 7,
      props: {
        heading: 'Support Our Campaign',
        description: 'Help us fight for progressive values and real change',
        buttonText: 'Donate Today',
        buttonLink: '#donate',
        backgroundColor: '#ec4899',
      },
    },
    {
      id: 'footer-3',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Martinez for Congress',
        tagline: 'A Progressive Voice for Change',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-3',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Martinez for Congress Committee',
        pacId: 'C00987654',
        textColor: '#94a3b8',
        backgroundColor: '#1e293b',
      },
    },
  ],
};

// Template 4: Minimal Blog (Fully Populated)
const minimalBlogTemplate: PageTemplate = {
  id: 'minimal-blog',
  name: 'Minimal Blog',
  description: 'Clean and elegant blog layout',
  category: 'Candidate',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
  theme: {
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#3b82f6',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-4',
      type: 'hero',
      order: 0,
      props: {
        title: 'Thoughts & Ideas',
        subtitle: 'A minimal blog about design, development, and creative thinking',
        ctaText: 'Read Articles',
        ctaLink: '#',
      },
    },
    {
      id: 'text-7',
      type: 'text',
      order: 1,
      props: {
        content: '<article class="prose prose-lg"><h2>Latest Articles</h2><p>Discover insights on modern web development, design principles, and creative thinking that will transform your work.</p></article>',
        alignment: 'left',
        fontSize: 'lg',
      },
    },
    {
      id: 'text-8',
      type: 'text',
      order: 2,
      props: {
        content: '<article class="prose prose-lg"><h3>The Art of Simplicity in Design</h3><p>Published March 15, 2025</p><p>Learn how minimalism can enhance user experience and create more impactful digital products.</p></article>',
        alignment: 'left',
        fontSize: 'md',
      },
    },
    {
      id: 'text-9',
      type: 'text',
      order: 3,
      props: {
        content: '<article class="prose prose-lg"><h3>Modern JavaScript Best Practices</h3><p>Published March 10, 2025</p><p>Explore cutting-edge JavaScript techniques and patterns that will level up your development skills.</p></article>',
        alignment: 'left',
        fontSize: 'md',
      },
    },
    {
      id: 'about-4',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Robert Chen',
        candidateTitle: 'Independent Candidate for Mayor',
        bio: 'A non-partisan voice focused on practical solutions and community collaboration.\n\nRobert brings 15 years of public service experience and a commitment to transparency and accountability.',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-4',
      type: 'news',
      order: 5,
      props: {
        title: 'Campaign Journal',
        articles: [
          {
            headline: 'Infrastructure Plan Released',
            date: 'March 22, 2025',
            excerpt: 'Comprehensive roadmap for city improvements unveiled.',
            link: '#',
          },
          {
            headline: 'Community Forums Schedule',
            date: 'March 16, 2025',
            excerpt: 'Open discussions in all neighborhoods this month.',
            link: '#',
          },
          {
            headline: 'Endorsement from Teachers Union',
            date: 'March 11, 2025',
            excerpt: 'Education professionals back independent campaign.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-4',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Volunteer With Us',
        description: 'Help build a better city for everyone. Join our grassroots movement.',
        buttonText: 'Sign Up',
        backgroundColor: '#f9fafb',
      },
    },
    {
      id: 'cta-4',
      type: 'cta',
      order: 7,
      props: {
        heading: 'Support Independent Leadership',
        description: 'Your donation helps us run a people-powered campaign',
        buttonText: 'Contribute',
        buttonLink: '#donate',
        backgroundColor: '#1f2937',
      },
    },
    {
      id: 'footer-4',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Chen for Mayor',
        tagline: 'Independent Leadership for Our City',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-4',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Chen for Mayor Committee',
        pacId: 'C00456123',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 5: E-commerce Product (Fully Populated)
const ecommerceTemplate: PageTemplate = {
  id: 'ecommerce-product',
  name: 'Petition Campaign',
  description: 'Single-issue petition and advocacy page',
  category: 'Petitions',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
  theme: {
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-5',
      type: 'hero',
      order: 0,
      props: {
        title: 'Stop Climate Inaction Now',
        subtitle: 'Sign the petition demanding immediate action on climate change',
        ctaText: 'Sign the Petition',
        ctaLink: '#sign',
      },
    },
    {
      id: 'text-10',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Why This Matters</h2><p class="text-lg">• 97% of scientists agree climate change is real<br>• We have less than 10 years to act<br>• Your voice can make a difference<br>• Join 50,000+ supporters already taking action</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-4',
      type: 'gallery',
      order: 2,
      props: {
        title: 'Product Images',
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Product view 1' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', alt: 'Product view 2' },
          { url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400', alt: 'Product view 3' },
          { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', alt: 'Product view 4' },
        ],
        columns: 4,
      },
    },
    {
      id: 'text-11',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">What People Are Saying</h2><p class="text-xl">Join 50,000+ concerned citizens</p><p class="text-lg mt-4">"This petition is exactly what we need. The time for action is now!" - Sarah M.</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'volunteer-5',
      type: 'volunteer-form',
      order: 4,
      props: {
        title: 'Add Your Voice',
        description: 'Sign the petition and join the movement for climate action.',
        buttonText: 'Sign Now',
        backgroundColor: '#f0fdf4',
      },
    },
    {
      id: 'news-5',
      type: 'news',
      order: 5,
      props: {
        title: 'Campaign Updates',
        articles: [
          {
            headline: 'Petition Reaches 50,000 Signatures',
            date: 'March 20, 2025',
            excerpt: 'Momentum builds as more citizens demand action.',
            link: '#',
          },
          {
            headline: 'Rally This Weekend',
            date: 'March 15, 2025',
            excerpt: 'Join us downtown for a climate action rally.',
            link: '#',
          },
          {
            headline: 'Scientists Support Our Demands',
            date: 'March 10, 2025',
            excerpt: 'Leading researchers endorse petition goals.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'cta-5',
      type: 'cta',
      order: 6,
      props: {
        heading: 'Support This Campaign',
        description: 'Help us amplify our message and reach more people',
        buttonText: 'Donate to the Cause',
        buttonLink: '#donate',
        backgroundColor: '#10b981',
      },
    },
    {
      id: 'footer-5',
      type: 'footer',
      order: 7,
      props: {
        companyName: 'Climate Action Now',
        tagline: 'Fighting for Our Planet\'s Future',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Take Action', url: '#action' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-5',
      type: 'disclaimer',
      order: 8,
      props: {
        paidForBy: 'Climate Action Now Organization',
        pacId: 'C00741852',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 6: Agency Landing (Fully Populated)
const agencyTemplate: PageTemplate = {
  id: 'agency-landing',
  name: 'Organization Campaign',
  description: 'Political organization or PAC homepage',
  category: 'Organizations',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#818cf8',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-6',
      type: 'hero',
      order: 0,
      props: {
        title: 'Digital Agency for Bold Brands',
        subtitle: 'We help companies build remarkable digital experiences that drive growth',
        ctaText: 'View Our Work',
        ctaLink: '#',
      },
    },
    {
      id: 'text-12',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">Our Services</h2><p class="text-xl">Strategy • Design • Development • Growth</p><p class="text-lg mt-4">End-to-end digital solutions tailored to your business needs.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'gallery-5',
      type: 'gallery',
      order: 2,
      props: {
        title: 'Recent Work',
        images: [
          { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Project 1' },
          { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Project 2' },
          { url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400', alt: 'Project 3' },
        ],
        columns: 3,
      },
    },
    {
      id: 'text-13',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Making a Real Difference</h2><p class="text-lg">Supporting conservative candidates and causes nationwide since 2015</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'about-6',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Americans for Freedom PAC',
        candidateTitle: 'Supporting Conservative Candidates Nationwide',
        bio: 'A leading political action committee dedicated to electing conservative leaders who share our values.\n\nSince 2015, we\'ve helped elect over 100 conservative candidates to local, state, and federal office.',
        imageUrl: 'https://images.unsplash.com/photo-1509715513011-e394f0cb20c4?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-6',
      type: 'news',
      order: 5,
      props: {
        title: 'Latest News',
        articles: [
          {
            headline: 'Record Fundraising Quarter',
            date: 'March 18, 2025',
            excerpt: 'Grassroots support reaches new heights this quarter.',
            link: '#',
          },
          {
            headline: '15 Endorsed Candidates Win Primaries',
            date: 'March 12, 2025',
            excerpt: 'Our endorsed candidates sweep primary elections.',
            link: '#',
          },
          {
            headline: 'New Leadership Training Program',
            date: 'March 8, 2025',
            excerpt: 'Preparing the next generation of conservative leaders.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-6',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Get Involved',
        description: 'Join our network of conservative activists making a difference.',
        buttonText: 'Join Now',
        backgroundColor: '#f3f4f6',
      },
    },
    {
      id: 'cta-6',
      type: 'cta',
      order: 7,
      props: {
        heading: "Support Conservative Candidates",
        description: 'Your contribution helps elect leaders who share our values',
        buttonText: 'Donate to PAC',
        buttonLink: '#donate',
        backgroundColor: '#6366f1',
      },
    },
    {
      id: 'footer-6',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Americans for Freedom PAC',
        tagline: 'Electing Conservative Leaders',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Get Involved', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-6',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Americans for Freedom PAC',
        pacId: 'C00369258',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 7: Event Landing (Fully Populated)
const eventTemplate: PageTemplate = {
  id: 'event-landing',
  name: 'Rally & Event Campaign',
  description: 'Campaign event and rally page',
  category: 'State Campaigns',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
  theme: {
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#eab308',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-7',
      type: 'hero',
      order: 0,
      props: {
        title: 'Web Summit 2025',
        subtitle: 'Join 10,000+ attendees • March 15-17 • San Francisco',
        ctaText: 'Register Now',
        ctaLink: '#',
      },
    },
    {
      id: 'text-14',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">What to Expect</h2><p class="text-xl">3 days of keynotes, workshops, and networking with industry leaders</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'text-15',
      type: 'text',
      order: 2,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Featured Speakers</h2><p class="text-lg">• Jane Doe - CEO at TechCorp<br>• John Smith - Founder of StartupX<br>• Sarah Johnson - VP of Product at InnovateCo<br>• Mike Chen - Lead Designer at DesignHub</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-6',
      type: 'gallery',
      order: 3,
      props: {
        title: 'Previous Rally Highlights',
        images: [
          { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', alt: 'Rally 1' },
          { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', alt: 'Rally 2' },
          { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', alt: 'Rally 3' },
        ],
        columns: 3,
      },
    },
    {
      id: 'about-7',
      type: 'about',
      order: 4,
      props: {
        candidateName: 'Lisa Rodriguez',
        candidateTitle: 'State Representative Candidate',
        bio: 'Fighting for working families and better schools in our community.\n\nLisa has dedicated her career to improving education and creating economic opportunities for all.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-7',
      type: 'news',
      order: 5,
      props: {
        title: 'Campaign News',
        articles: [
          {
            headline: 'Huge Turnout at Weekend Rally',
            date: 'March 19, 2025',
            excerpt: 'Over 5,000 supporters attend campaign kickoff event.',
            link: '#',
          },
          {
            headline: 'Education Plan Announced',
            date: 'March 14, 2025',
            excerpt: 'Comprehensive education reform proposal released.',
            link: '#',
          },
          {
            headline: 'Upcoming Town Halls',
            date: 'March 9, 2025',
            excerpt: 'Schedule of community meetings announced.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-7',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Join the Campaign',
        description: 'Help us win and bring real change to our community.',
        buttonText: 'Volunteer',
        backgroundColor: '#fff7ed',
      },
    },
    {
      id: 'cta-7',
      type: 'cta',
      order: 7,
      props: {
        heading: 'Support Our Campaign',
        description: 'Every dollar helps us reach more voters',
        buttonText: 'Donate Now',
        buttonLink: '#donate',
        backgroundColor: '#f97316',
      },
    },
    {
      id: 'footer-7',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Rodriguez for State Rep',
        tagline: 'Fighting for Our Community',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Events', url: '#events' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-7',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Rodriguez for State Representative Committee',
        pacId: 'C00258963',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 8: App Launch (Fully Populated)
const appLaunchTemplate: PageTemplate = {
  id: 'app-launch',
  name: 'Issue Advocacy',
  description: 'Campaign focused on a single issue',
  category: 'Petitions',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
  theme: {
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-8',
      type: 'hero',
      order: 0,
      props: {
        title: 'Your Life, Organized',
        subtitle: 'The productivity app that adapts to you. Available on iOS and Android.',
        ctaText: 'Download Free',
        ctaLink: '#',
      },
    },
    {
      id: 'text-16',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Why Users Love It</h2><p class="text-lg">• Smart task management with AI<br>• Seamless calendar integration<br>• Team collaboration features<br>• Cross-platform sync</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-7',
      type: 'gallery',
      order: 2,
      props: {
        title: 'App Screenshots',
        images: [
          { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Screenshot 1' },
          { url: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=400', alt: 'Screenshot 2' },
          { url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', alt: 'Screenshot 3' },
          { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', alt: 'Screenshot 4' },
        ],
        columns: 4,
      },
    },
    {
      id: 'text-17',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Community Support</h2><p class="text-xl">Join 25,000+ advocates</p><p class="text-lg mt-4">"This issue affects all of us. I\'m proud to stand with this campaign." - Maria T.</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'volunteer-8',
      type: 'volunteer-form',
      order: 4,
      props: {
        title: 'Take Action Today',
        description: 'Sign up to receive updates and ways to get involved.',
        buttonText: 'Join the Movement',
        backgroundColor: '#cffafe',
      },
    },
    {
      id: 'news-8',
      type: 'news',
      order: 5,
      props: {
        title: 'Latest Developments',
        articles: [
          {
            headline: 'Petition Gains Traction',
            date: 'March 17, 2025',
            excerpt: '25,000 signatures collected in first month.',
            link: '#',
          },
          {
            headline: 'Coalition Expands',
            date: 'March 13, 2025',
            excerpt: '15 more organizations join the campaign.',
            link: '#',
          },
          {
            headline: 'Media Coverage Grows',
            date: 'March 7, 2025',
            excerpt: 'National outlets pick up our story.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'cta-8',
      type: 'cta',
      order: 6,
      props: {
        heading: 'Help Us Spread the Word',
        description: 'Support our advocacy work with a contribution',
        buttonText: 'Donate to the Cause',
        buttonLink: '#donate',
        backgroundColor: '#06b6d4',
      },
    },
    {
      id: 'footer-8',
      type: 'footer',
      order: 7,
      props: {
        companyName: 'Issue Advocacy Campaign',
        tagline: 'Creating Change Together',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Take Action', url: '#action' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-8',
      type: 'disclaimer',
      order: 8,
      props: {
        paidForBy: 'Issue Advocacy Campaign',
        pacId: 'C00963147',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 9: Startup Pitch (Fully Populated)
const startupPitchTemplate: PageTemplate = {
  id: 'startup-pitch',
  name: 'Coalition Campaign',
  description: 'Multi-organization coalition page',
  category: 'Organizations',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
  theme: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-9',
      type: 'hero',
      order: 0,
      props: {
        title: 'Disrupting the Industry',
        subtitle: 'Series A Funding Complete - $10M Raised',
        ctaText: 'View Pitch Deck',
        ctaLink: '#',
      },
    },
    {
      id: 'text-18',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">The Problem</h2><p class="text-xl">Traditional solutions are outdated, expensive, and slow. Businesses lose $500B annually due to inefficiency.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'text-19',
      type: 'text',
      order: 2,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">Our Solution</h2><p class="text-xl">AI-powered platform that reduces costs by 80% and increases efficiency by 5x.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'text-20',
      type: 'text',
      order: 3,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Traction</h2><p class="text-lg">• 500+ enterprise customers<br>• $5M ARR in 18 months<br>• 300% YoY growth<br>• Team of 45 across 3 continents</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-8',
      type: 'gallery',
      order: 4,
      props: {
        title: 'Coalition Partners',
        images: [
          { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', alt: 'Partner org 1' },
          { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', alt: 'Partner org 2' },
          { url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', alt: 'Partner org 3' },
        ],
        columns: 3,
      },
    },
    {
      id: 'news-9',
      type: 'news',
      order: 5,
      props: {
        title: 'Coalition News',
        articles: [
          {
            headline: 'Coalition Announces Joint Initiative',
            date: 'March 21, 2025',
            excerpt: 'Major policy proposal unveiled by coalition partners.',
            link: '#',
          },
          {
            headline: '50 Organizations Join Forces',
            date: 'March 14, 2025',
            excerpt: 'Coalition grows to represent 2 million members.',
            link: '#',
          },
          {
            headline: 'Legislative Victory',
            date: 'March 8, 2025',
            excerpt: 'Coalition-backed bill passes key committee.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-9',
      type: 'volunteer-form',
      order: 6,
      props: {
        title: 'Join the Coalition',
        description: 'Add your organization or become an individual supporter.',
        buttonText: 'Get Involved',
        backgroundColor: '#f5f3ff',
      },
    },
    {
      id: 'cta-9',
      type: 'cta',
      order: 7,
      props: {
        heading: "Support the Coalition",
        description: "Help us achieve our shared goals",
        buttonText: 'Contribute',
        buttonLink: '#donate',
        backgroundColor: '#8b5cf6',
      },
    },
    {
      id: 'footer-9',
      type: 'footer',
      order: 8,
      props: {
        companyName: 'Progressive Coalition',
        tagline: 'United for Change',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Partners', url: '#partners' },
          { title: 'Join Us', url: '#join' },
          { title: 'Donate', url: '#donate' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-9',
      type: 'disclaimer',
      order: 9,
      props: {
        paidForBy: 'Progressive Coalition',
        pacId: 'C00852369',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// Template 10: Wellness & Health (Fully Populated)
const wellnessTemplate: PageTemplate = {
  id: 'wellness-health',
  name: 'Community Candidate',
  description: 'Local candidate focused on community issues',
  category: 'Candidate',
  siteType: 'political',
  thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  theme: {
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    {
      id: 'hero-10',
      type: 'hero',
      order: 0,
      props: {
        title: 'Find Your Balance',
        subtitle: 'Holistic wellness coaching for mind, body, and spirit',
        ctaText: 'Book Consultation',
        ctaLink: '#',
      },
    },
    {
      id: 'text-21',
      type: 'text',
      order: 1,
      props: {
        content: '<h2 class="text-4xl font-bold mb-6">Our Approach</h2><p class="text-xl">Evidence-based practices combined with ancient wisdom for lasting transformation.</p>',
        alignment: 'center',
        fontSize: 'xl',
      },
    },
    {
      id: 'text-22',
      type: 'text',
      order: 2,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Services</h2><p class="text-lg">• Personal Wellness Coaching<br>• Nutrition Planning<br>• Mindfulness & Meditation<br>• Movement & Yoga<br>• Sleep Optimization</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'gallery-9',
      type: 'gallery',
      order: 3,
      props: {
        title: 'Transform Your Life',
        images: [
          { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', alt: 'Wellness 1' },
          { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', alt: 'Wellness 2' },
          { url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400', alt: 'Wellness 3' },
        ],
        columns: 3,
      },
    },
    {
      id: 'text-23',
      type: 'text',
      order: 4,
      props: {
        content: '<h2 class="text-3xl font-bold mb-4">Community Voices</h2><p class="text-lg">"We need fresh leadership that listens to our concerns. That\'s why I\'m supporting this campaign." - Emily R.</p><p class="text-lg mt-3">"Finally, a candidate who cares about our neighborhoods." - David L.</p>',
        alignment: 'center',
        fontSize: 'lg',
      },
    },
    {
      id: 'about-10',
      type: 'about',
      order: 5,
      props: {
        candidateName: 'Maria Santos',
        candidateTitle: 'Candidate for City Council',
        bio: 'A community organizer with deep roots in our neighborhood.\n\nMaria has spent 10 years fighting for affordable housing, better schools, and safer streets.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
        flagEmoji: true,
      },
    },
    {
      id: 'news-10',
      type: 'news',
      order: 6,
      props: {
        title: 'Campaign Updates',
        articles: [
          {
            headline: 'Neighborhood Walk This Weekend',
            date: 'March 23, 2025',
            excerpt: 'Meet Maria and discuss local issues.',
            link: '#',
          },
          {
            headline: 'Community Leaders Endorse Campaign',
            date: 'March 16, 2025',
            excerpt: 'Local advocates rally behind Santos.',
            link: '#',
          },
          {
            headline: 'Housing Plan Announced',
            date: 'March 9, 2025',
            excerpt: 'Comprehensive affordable housing proposal released.',
            link: '#',
          },
        ],
      },
    },
    {
      id: 'volunteer-10',
      type: 'volunteer-form',
      order: 7,
      props: {
        title: 'Join Our Team',
        description: 'Help us build a better community together.',
        buttonText: 'Volunteer',
        backgroundColor: '#f0fdf4',
      },
    },
    {
      id: 'cta-10',
      type: 'cta',
      order: 8,
      props: {
        heading: 'Support Our Campaign',
        description: 'Every contribution helps us reach more neighbors',
        buttonText: 'Donate Today',
        buttonLink: '#donate',
        backgroundColor: '#059669',
      },
    },
    {
      id: 'footer-10',
      type: 'footer',
      order: 9,
      props: {
        companyName: 'Santos for City Council',
        tagline: 'A Voice for Our Community',
        links: [
          { title: 'About', url: '#about' },
          { title: 'News', url: '#news' },
          { title: 'Volunteer', url: '#volunteer' },
          { title: 'Donate', url: '#donate' },
          { title: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'f' },
          { platform: 'Twitter/X', url: 'https://twitter.com', icon: '𝕏' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { platform: 'YouTube', url: 'https://youtube.com', icon: '▶' },
        ],
      },
    },
    {
      id: 'disclaimer-10',
      type: 'disclaimer',
      order: 10,
      props: {
        paidForBy: 'Santos for City Council Committee',
        pacId: 'C00159753',
        textColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    },
  ],
};

// BUSINESS TEMPLATES

// Business Template 1: Modern SaaS
const businessSaaSTemplate: PageTemplate = {
  id: 'business-saas',
  name: 'Modern SaaS',
  description: 'Clean SaaS landing page for software products',
  category: 'SaaS',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#60a5fa',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b1', type: 'hero', order: 0, props: { title: 'Transform Your Business', subtitle: 'Powerful tools to streamline your workflow and boost productivity', ctaText: 'Start Free Trial', ctaLink: '#' } },
    { id: 'text-b1', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Trusted by 10,000+ Companies</h2><p>From startups to enterprises, teams love our platform</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b1', type: 'gallery', order: 2, props: { title: 'Features', images: [{ url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Feature 1' }, { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Feature 2' }, { url: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=400', alt: 'Feature 3' }], columns: 3 } },
    { id: 'cta-b1', type: 'cta', order: 3, props: { heading: 'Ready to Get Started?', description: 'Join thousands of teams already using our platform', buttonText: 'Sign Up Free', buttonLink: '#', backgroundColor: '#3b82f6' } },
    { id: 'contact-b1', type: 'contact-form', order: 4, props: { title: 'Contact Sales', description: 'Get in touch with our team to learn more', buttonText: 'Send Message', backgroundColor: '#f3f4f6' } },
    { id: 'footer-b1', type: 'footer', order: 5, props: { companyName: 'SaaS Company', tagline: 'Building better software', links: [{ title: 'Product', url: '#' }, { title: 'Pricing', url: '#' }, { title: 'About', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 2: Digital Agency
const businessAgencyTemplate: PageTemplate = {
  id: 'business-agency',
  name: 'Digital Agency',
  description: 'Professional agency portfolio',
  category: 'Agency',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  theme: {
    colors: { primary: '#6366f1', secondary: '#818cf8', background: '#ffffff', text: '#1f2937', accent: '#a78bfa' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b2', type: 'hero', order: 0, props: { title: 'Creative Digital Solutions', subtitle: 'We craft exceptional digital experiences', ctaText: 'View Our Work', ctaLink: '#' } },
    { id: 'gallery-b2', type: 'gallery', order: 1, props: { title: 'Recent Projects', images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Project 1' }, { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Project 2' }, { url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400', alt: 'Project 3' }], columns: 3 } },
    { id: 'text-b2', type: 'text', order: 2, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Services</h2><p>Strategy • Design • Development • Marketing</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'contact-b2', type: 'contact-form', order: 3, props: { title: 'Start a Project', description: 'Let\'s create something amazing together', buttonText: 'Get in Touch', backgroundColor: '#f9fafb' } },
    { id: 'footer-b2', type: 'footer', order: 4, props: { companyName: 'Digital Agency', tagline: 'Crafting Digital Excellence', links: [{ title: 'Services', url: '#' }, { title: 'Work', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 3: E-commerce Store
const businessEcommerceTemplate: PageTemplate = {
  id: 'business-ecommerce',
  name: 'E-commerce Store',
  description: 'Modern online store design',
  category: 'E-commerce',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
  theme: {
    colors: { primary: '#10b981', secondary: '#059669', background: '#ffffff', text: '#1f2937', accent: '#34d399' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b3', type: 'hero', order: 0, props: { title: 'Premium Products', subtitle: 'Discover our curated collection', ctaText: 'Shop Now', ctaLink: '#' } },
    { id: 'gallery-b3', type: 'gallery', order: 1, props: { title: 'Featured Products', images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Product 1' }, { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', alt: 'Product 2' }, { url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400', alt: 'Product 3' }, { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', alt: 'Product 4' }], columns: 4 } },
    { id: 'cta-b3', type: 'cta', order: 2, props: { heading: 'Free Shipping Over $50', description: 'Shop now and save on delivery', buttonText: 'Browse Collection', buttonLink: '#', backgroundColor: '#10b981' } },
    { id: 'contact-b3', type: 'contact-form', order: 3, props: { title: 'Customer Support', description: 'Have questions? We\'re here to help', buttonText: 'Send Message', backgroundColor: '#f0fdf4' } },
    { id: 'footer-b3', type: 'footer', order: 4, props: { companyName: 'Store', tagline: 'Quality Products', links: [{ title: 'Shop', url: '#' }, { title: 'About', url: '#' }, { title: 'Support', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 4: Restaurant
const businessRestaurantTemplate: PageTemplate = {
  id: 'business-restaurant',
  name: 'Restaurant & Cafe',
  description: 'Beautiful restaurant website',
  category: 'Restaurant',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  theme: {
    colors: { primary: '#f97316', secondary: '#fb923c', background: '#ffffff', text: '#1f2937', accent: '#fdba74' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b4', type: 'hero', order: 0, props: { title: 'Culinary Excellence', subtitle: 'Farm-to-table dining experience', ctaText: 'Make Reservation', ctaLink: '#' } },
    { id: 'text-b4', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Story</h2><p>Serving authentic cuisine since 2010</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b4', type: 'gallery', order: 2, props: { title: 'Signature Dishes', images: [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Dish 1' }, { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', alt: 'Dish 2' }, { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', alt: 'Dish 3' }], columns: 3 } },
    { id: 'contact-b4', type: 'contact-form', order: 3, props: { title: 'Contact Us', description: 'Questions or special requests?', buttonText: 'Send Message', backgroundColor: '#fff7ed' } },
    { id: 'footer-b4', type: 'footer', order: 4, props: { companyName: 'Restaurant', tagline: 'Fine Dining', links: [{ title: 'Menu', url: '#' }, { title: 'Reservations', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 5: Real Estate
const businessRealEstateTemplate: PageTemplate = {
  id: 'business-realestate',
  name: 'Real Estate',
  description: 'Property listings and agency',
  category: 'Real Estate',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
  theme: {
    colors: { primary: '#1e40af', secondary: '#3b82f6', background: '#ffffff', text: '#1f2937', accent: '#60a5fa' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b5', type: 'hero', order: 0, props: { title: 'Find Your Dream Home', subtitle: 'Luxury properties in prime locations', ctaText: 'Browse Listings', ctaLink: '#' } },
    { id: 'gallery-b5', type: 'gallery', order: 1, props: { title: 'Featured Properties', images: [{ url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400', alt: 'Property 1' }, { url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400', alt: 'Property 2' }, { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400', alt: 'Property 3' }], columns: 3 } },
    { id: 'text-b5', type: 'text', order: 2, props: { content: '<h2 class="text-3xl font-bold mb-4">Why Choose Us</h2><p>Expert agents • Prime locations • Transparent process</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'contact-b5', type: 'contact-form', order: 3, props: { title: 'Schedule a Viewing', description: 'Get in touch to tour our properties', buttonText: 'Contact Agent', backgroundColor: '#eff6ff' } },
    { id: 'footer-b5', type: 'footer', order: 4, props: { companyName: 'Real Estate', tagline: 'Your Dream Home Awaits', links: [{ title: 'Properties', url: '#' }, { title: 'Agents', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 6: Consulting Firm
const businessConsultingTemplate: PageTemplate = {
  id: 'business-consulting',
  name: 'Consulting Firm',
  description: 'Professional consulting services',
  category: 'Consulting',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
  theme: {
    colors: { primary: '#0f172a', secondary: '#1e293b', background: '#ffffff', text: '#1f2937', accent: '#64748b' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b6', type: 'hero', order: 0, props: { title: 'Strategic Business Solutions', subtitle: 'Expert guidance for growth and transformation', ctaText: 'Learn More', ctaLink: '#' } },
    { id: 'text-b6', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Expertise</h2><p>Strategy • Operations • Technology • Finance</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b6', type: 'gallery', order: 2, props: { title: 'Case Studies', images: [{ url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', alt: 'Case 1' }, { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', alt: 'Case 2' }, { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400', alt: 'Case 3' }], columns: 3 } },
    { id: 'contact-b6', type: 'contact-form', order: 3, props: { title: 'Get a Consultation', description: 'Let\'s discuss your business needs', buttonText: 'Schedule Call', backgroundColor: '#f8fafc' } },
    { id: 'footer-b6', type: 'footer', order: 4, props: { companyName: 'Consulting Group', tagline: 'Strategic Excellence', links: [{ title: 'Services', url: '#' }, { title: 'Insights', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 7: Fitness Studio
const businessFitnessTemplate: PageTemplate = {
  id: 'business-fitness',
  name: 'Fitness Studio',
  description: 'Gym and wellness center',
  category: 'Health & Fitness',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
  theme: {
    colors: { primary: '#dc2626', secondary: '#ef4444', background: '#ffffff', text: '#1f2937', accent: '#f87171' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b7', type: 'hero', order: 0, props: { title: 'Transform Your Body', subtitle: 'Expert trainers • Modern equipment • Group classes', ctaText: 'Join Now', ctaLink: '#' } },
    { id: 'text-b7', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Why Members Love Us</h2><p>Certified trainers • Flexible schedules • Supportive community</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b7', type: 'gallery', order: 2, props: { title: 'Our Facility', images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', alt: 'Gym 1' }, { url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', alt: 'Gym 2' }, { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', alt: 'Gym 3' }], columns: 3 } },
    { id: 'contact-b7', type: 'contact-form', order: 3, props: { title: 'Get Started', description: 'Sign up for a free trial class', buttonText: 'Join Now', backgroundColor: '#fef2f2' } },
    { id: 'footer-b7', type: 'footer', order: 4, props: { companyName: 'Fitness Studio', tagline: 'Your Fitness Journey Starts Here', links: [{ title: 'Classes', url: '#' }, { title: 'Membership', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 8: Tech Startup
const businessStartupTemplate: PageTemplate = {
  id: 'business-startup',
  name: 'Tech Startup',
  description: 'Innovative startup pitch',
  category: 'Startup',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
  theme: {
    colors: { primary: '#8b5cf6', secondary: '#a78bfa', background: '#ffffff', text: '#1f2937', accent: '#c4b5fd' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b8', type: 'hero', order: 0, props: { title: 'The Future is Here', subtitle: 'Revolutionary AI technology', ctaText: 'Request Demo', ctaLink: '#' } },
    { id: 'text-b8', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Backed by Leading Investors</h2><p>Series A funded • Rapid growth • Proven results</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b8', type: 'gallery', order: 2, props: { title: 'Product Features', images: [{ url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Feature 1' }, { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Feature 2' }, { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', alt: 'Feature 3' }], columns: 3 } },
    { id: 'contact-b8', type: 'contact-form', order: 3, props: { title: 'Join the Waitlist', description: 'Be among the first to experience our platform', buttonText: 'Sign Up', backgroundColor: '#faf5ff' } },
    { id: 'footer-b8', type: 'footer', order: 4, props: { companyName: 'Tech Startup', tagline: 'Innovating Tomorrow', links: [{ title: 'Product', url: '#' }, { title: 'About', url: '#' }, { title: 'Careers', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 9: Law Firm
const businessLawFirmTemplate: PageTemplate = {
  id: 'business-lawfirm',
  name: 'Law Firm',
  description: 'Professional legal services',
  category: 'Legal',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
  theme: {
    colors: { primary: '#115e59', secondary: '#14b8a6', background: '#ffffff', text: '#1f2937', accent: '#5eead4' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b9', type: 'hero', order: 0, props: { title: 'Expert Legal Counsel', subtitle: '50+ years of combined experience', ctaText: 'Schedule Consultation', ctaLink: '#' } },
    { id: 'text-b9', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Practice Areas</h2><p>Corporate • Real Estate • Family • Criminal Defense</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b9', type: 'gallery', order: 2, props: { title: 'Our Team', images: [{ url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', alt: 'Attorney 1' }, { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', alt: 'Attorney 2' }, { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', alt: 'Attorney 3' }], columns: 3 } },
    { id: 'contact-b9', type: 'contact-form', order: 3, props: { title: 'Get Legal Help', description: 'Contact us for a confidential consultation', buttonText: 'Contact Us', backgroundColor: '#f0fdfa' } },
    { id: 'footer-b9', type: 'footer', order: 4, props: { companyName: 'Law Firm', tagline: 'Justice & Excellence', links: [{ title: 'Practice Areas', url: '#' }, { title: 'Attorneys', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// Business Template 10: Marketing Agency
const businessMarketingTemplate: PageTemplate = {
  id: 'business-marketing',
  name: 'Marketing Agency',
  description: 'Digital marketing services',
  category: 'Marketing',
  siteType: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=400',
  theme: {
    colors: { primary: '#ec4899', secondary: '#f472b6', background: '#ffffff', text: '#1f2937', accent: '#f9a8d4' },
    fonts: { heading: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  components: [
    { id: 'hero-b10', type: 'hero', order: 0, props: { title: 'Grow Your Brand', subtitle: 'Data-driven marketing that delivers results', ctaText: 'Get Started', ctaLink: '#' } },
    { id: 'text-b10', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Services</h2><p>SEO • Social Media • Content • PPC • Analytics</p>', alignment: 'center', fontSize: 'lg' } },
    { id: 'gallery-b10', type: 'gallery', order: 2, props: { title: 'Success Stories', images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Case 1' }, { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', alt: 'Case 2' }, { url: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=400', alt: 'Case 3' }], columns: 3 } },
    { id: 'contact-b10', type: 'contact-form', order: 3, props: { title: 'Let\'s Talk Growth', description: 'Tell us about your marketing goals', buttonText: 'Get Proposal', backgroundColor: '#fdf2f8' } },
    { id: 'footer-b10', type: 'footer', order: 4, props: { companyName: 'Marketing Agency', tagline: 'Your Growth Partner', links: [{ title: 'Services', url: '#' }, { title: 'Portfolio', url: '#' }, { title: 'Contact', url: '#' }], socialLinks: [] } },
  ],
};

// PERSONAL/PORTFOLIO TEMPLATES (10 templates with minimal components for brevity)
const personalCreativeTemplate: PageTemplate = { id: 'personal-creative', name: 'Creative Portfolio', description: 'Showcase your creative work', category: 'Portfolio', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1487837647815-bbc1f30cd0d2?w=400', theme: { colors: { primary: '#ec4899', secondary: '#f472b6', background: '#ffffff', text: '#1f2937', accent: '#f9a8d4' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p1', type: 'hero', order: 0, props: { title: 'Creative Designer', subtitle: 'Crafting beautiful digital experiences', ctaText: 'View Work', ctaLink: '#' } }, { id: 'gallery-p1', type: 'gallery', order: 1, props: { title: 'Portfolio', images: [{ url: 'https://images.unsplash.com/photo-1487837647815-bbc1f30cd0d2?w=400', alt: 'Work 1' }, { url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400', alt: 'Work 2' }, { url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400', alt: 'Work 3' }], columns: 3 } }, { id: 'contact-p1', type: 'contact-form', order: 2, props: { title: 'Get In Touch', description: 'Let\'s work together', buttonText: 'Send Message', backgroundColor: '#fdf2f8' } }, { id: 'footer-p1', type: 'footer', order: 3, props: { companyName: 'Designer', tagline: 'Creative Work', links: [], socialLinks: [] } }] };
const personalPhotographyTemplate: PageTemplate = { id: 'personal-photography', name: 'Photography', description: 'Photo portfolio', category: 'Portfolio', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400', theme: { colors: { primary: '#0f172a', secondary: '#1e293b', background: '#ffffff', text: '#1f2937', accent: '#64748b' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p2', type: 'hero', order: 0, props: { title: 'Photographer', subtitle: 'Capturing moments', ctaText: 'View Gallery', ctaLink: '#' } }, { id: 'gallery-p2', type: 'gallery', order: 1, props: { title: 'Gallery', images: [{ url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400', alt: 'Photo 1' }, { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400', alt: 'Photo 2' }, { url: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400', alt: 'Photo 3' }, { url: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=400', alt: 'Photo 4' }], columns: 4 } }, { id: 'contact-p2', type: 'contact-form', order: 2, props: { title: 'Book a Session', description: 'Contact me', buttonText: 'Contact', backgroundColor: '#f8fafc' } }, { id: 'footer-p2', type: 'footer', order: 3, props: { companyName: 'Photographer', tagline: '', links: [], socialLinks: [] } }] };
const personalBlogTemplate: PageTemplate = { id: 'personal-blog', name: 'Personal Blog', description: 'Blog and writing', category: 'Blog', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', theme: { colors: { primary: '#3b82f6', secondary: '#60a5fa', background: '#ffffff', text: '#1f2937', accent: '#93c5fd' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p3', type: 'hero', order: 0, props: { title: 'My Blog', subtitle: 'Thoughts and stories', ctaText: 'Read Posts', ctaLink: '#' } }, { id: 'text-p3', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Latest Posts</h2><p>Sharing my journey</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-p3', type: 'contact-form', order: 2, props: { title: 'Subscribe', description: 'Get updates', buttonText: 'Subscribe', backgroundColor: '#eff6ff' } }, { id: 'footer-p3', type: 'footer', order: 3, props: { companyName: 'Blog', tagline: '', links: [], socialLinks: [] } }] };
const personalResumeTemplate: PageTemplate = { id: 'personal-resume', name: 'Resume/CV', description: 'Professional resume', category: 'Resume', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400', theme: { colors: { primary: '#1f2937', secondary: '#374151', background: '#ffffff', text: '#1f2937', accent: '#6b7280' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p4', type: 'hero', order: 0, props: { title: 'Professional Name', subtitle: 'Job Title', ctaText: 'Download Resume', ctaLink: '#' } }, { id: 'text-p4', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Experience</h2><p>Career highlights</p>', alignment: 'left', fontSize: 'lg' } }, { id: 'contact-p4', type: 'contact-form', order: 2, props: { title: 'Contact Me', description: 'Get in touch', buttonText: 'Send', backgroundColor: '#f9fafb' } }, { id: 'footer-p4', type: 'footer', order: 3, props: { companyName: 'Name', tagline: '', links: [], socialLinks: [] } }] };
const personalMusicianTemplate: PageTemplate = { id: 'personal-musician', name: 'Musician', description: 'Music and performances', category: 'Music', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', theme: { colors: { primary: '#7c3aed', secondary: '#8b5cf6', background: '#ffffff', text: '#1f2937', accent: '#a78bfa' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p5', type: 'hero', order: 0, props: { title: 'Musician', subtitle: 'Listen to my music', ctaText: 'Listen Now', ctaLink: '#' } }, { id: 'gallery-p5', type: 'gallery', order: 1, props: { title: 'Performances', images: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', alt: 'Performance 1' }], columns: 3 } }, { id: 'contact-p5', type: 'contact-form', order: 2, props: { title: 'Book Me', description: 'For events', buttonText: 'Contact', backgroundColor: '#faf5ff' } }, { id: 'footer-p5', type: 'footer', order: 3, props: { companyName: 'Musician', tagline: '', links: [], socialLinks: [] } }] };
const personalWriterTemplate: PageTemplate = { id: 'personal-writer', name: 'Writer/Author', description: 'Writing portfolio', category: 'Writing', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', theme: { colors: { primary: '#059669', secondary: '#10b981', background: '#ffffff', text: '#1f2937', accent: '#34d399' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p6', type: 'hero', order: 0, props: { title: 'Author', subtitle: 'Published works', ctaText: 'Read More', ctaLink: '#' } }, { id: 'text-p6', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Books</h2><p>My published works</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-p6', type: 'contact-form', order: 2, props: { title: 'Contact', description: 'Get in touch', buttonText: 'Send', backgroundColor: '#f0fdf4' } }, { id: 'footer-p6', type: 'footer', order: 3, props: { companyName: 'Author', tagline: '', links: [], socialLinks: [] } }] };
const personalCoachTemplate: PageTemplate = { id: 'personal-coach', name: 'Life Coach', description: 'Coaching services', category: 'Coaching', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400', theme: { colors: { primary: '#f59e0b', secondary: '#fbbf24', background: '#ffffff', text: '#1f2937', accent: '#fcd34d' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p7', type: 'hero', order: 0, props: { title: 'Life Coach', subtitle: 'Transform your life', ctaText: 'Learn More', ctaLink: '#' } }, { id: 'text-p7', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Services</h2><p>Coaching programs</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-p7', type: 'contact-form', order: 2, props: { title: 'Schedule Session', description: 'Get started', buttonText: 'Contact', backgroundColor: '#fffbeb' } }, { id: 'footer-p7', type: 'footer', order: 3, props: { companyName: 'Coach', tagline: '', links: [], socialLinks: [] } }] };
const personalArtistTemplate: PageTemplate = { id: 'personal-artist', name: 'Visual Artist', description: 'Art portfolio', category: 'Art', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', theme: { colors: { primary: '#dc2626', secondary: '#ef4444', background: '#ffffff', text: '#1f2937', accent: '#f87171' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p8', type: 'hero', order: 0, props: { title: 'Visual Artist', subtitle: 'Contemporary art', ctaText: 'View Gallery', ctaLink: '#' } }, { id: 'gallery-p8', type: 'gallery', order: 1, props: { title: 'Artwork', images: [{ url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', alt: 'Art 1' }], columns: 3 } }, { id: 'contact-p8', type: 'contact-form', order: 2, props: { title: 'Inquire', description: 'Purchase or commission', buttonText: 'Contact', backgroundColor: '#fef2f2' } }, { id: 'footer-p8', type: 'footer', order: 3, props: { companyName: 'Artist', tagline: '', links: [], socialLinks: [] } }] };
const personalTechTemplate: PageTemplate = { id: 'personal-tech', name: 'Tech Professional', description: 'Tech portfolio', category: 'Tech', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', theme: { colors: { primary: '#06b6d4', secondary: '#0891b2', background: '#ffffff', text: '#1f2937', accent: '#22d3ee' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p9', type: 'hero', order: 0, props: { title: 'Developer', subtitle: 'Building software', ctaText: 'View Projects', ctaLink: '#' } }, { id: 'gallery-p9', type: 'gallery', order: 1, props: { title: 'Projects', images: [{ url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', alt: 'Project 1' }], columns: 3 } }, { id: 'contact-p9', type: 'contact-form', order: 2, props: { title: 'Hire Me', description: 'Available for work', buttonText: 'Contact', backgroundColor: '#cffafe' } }, { id: 'footer-p9', type: 'footer', order: 3, props: { companyName: 'Developer', tagline: '', links: [], socialLinks: [] } }] };
const personalInfluencerTemplate: PageTemplate = { id: 'personal-influencer', name: 'Influencer', description: 'Social media presence', category: 'Influencer', siteType: 'personal', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', theme: { colors: { primary: '#f43f5e', secondary: '#fb7185', background: '#ffffff', text: '#1f2937', accent: '#fda4af' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-p10', type: 'hero', order: 0, props: { title: 'Influencer', subtitle: 'Content creator', ctaText: 'Follow Me', ctaLink: '#' } }, { id: 'gallery-p10', type: 'gallery', order: 1, props: { title: 'Content', images: [{ url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', alt: 'Content 1' }], columns: 3 } }, { id: 'contact-p10', type: 'contact-form', order: 2, props: { title: 'Collaborate', description: 'Brand partnerships', buttonText: 'Contact', backgroundColor: '#fff1f2' } }, { id: 'footer-p10', type: 'footer', order: 3, props: { companyName: 'Influencer', tagline: '', links: [], socialLinks: [] } }] };

// NONPROFIT TEMPLATES (10 templates)
const nonprofitCharityTemplate: PageTemplate = { id: 'nonprofit-charity', name: 'Charity', description: 'Charitable organization', category: 'Charity', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400', theme: { colors: { primary: '#10b981', secondary: '#059669', background: '#ffffff', text: '#1f2937', accent: '#34d399' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n1', type: 'hero', order: 0, props: { title: 'Help Those In Need', subtitle: 'Making a difference together', ctaText: 'Donate Now', ctaLink: '#' } }, { id: 'text-n1', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Mission</h2><p>Supporting communities worldwide</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'gallery-n1', type: 'gallery', order: 2, props: { title: 'Impact', images: [{ url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400', alt: 'Impact 1' }], columns: 3 } }, { id: 'contact-n1', type: 'contact-form', order: 3, props: { title: 'Get Involved', description: 'Join our mission', buttonText: 'Contact Us', backgroundColor: '#f0fdf4' } }, { id: 'footer-n1', type: 'footer', order: 4, props: { companyName: 'Charity', tagline: 'Making a Difference', links: [], socialLinks: [] } }] };
const nonprofitEnvironmentTemplate: PageTemplate = { id: 'nonprofit-environment', name: 'Environmental', description: 'Environmental organization', category: 'Environment', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', theme: { colors: { primary: '#059669', secondary: '#10b981', background: '#ffffff', text: '#1f2937', accent: '#34d399' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n2', type: 'hero', order: 0, props: { title: 'Protect Our Planet', subtitle: 'Environmental conservation', ctaText: 'Take Action', ctaLink: '#' } }, { id: 'text-n2', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Work</h2><p>Conservation efforts</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n2', type: 'contact-form', order: 2, props: { title: 'Support Us', description: 'Join the movement', buttonText: 'Get Involved', backgroundColor: '#f0fdf4' } }, { id: 'footer-n2', type: 'footer', order: 3, props: { companyName: 'Environmental Org', tagline: 'Protecting Nature', links: [], socialLinks: [] } }] };
const nonprofitEducationTemplate: PageTemplate = { id: 'nonprofit-education', name: 'Education', description: 'Educational nonprofit', category: 'Education', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400', theme: { colors: { primary: '#3b82f6', secondary: '#60a5fa', background: '#ffffff', text: '#1f2937', accent: '#93c5fd' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n3', type: 'hero', order: 0, props: { title: 'Education for All', subtitle: 'Empowering through learning', ctaText: 'Learn More', ctaLink: '#' } }, { id: 'text-n3', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Programs</h2><p>Educational initiatives</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n3', type: 'contact-form', order: 2, props: { title: 'Get Involved', description: 'Support education', buttonText: 'Contact', backgroundColor: '#eff6ff' } }, { id: 'footer-n3', type: 'footer', order: 3, props: { companyName: 'Education Org', tagline: 'Learning for All', links: [], socialLinks: [] } }] };
const nonprofitHealthTemplate: PageTemplate = { id: 'nonprofit-health', name: 'Health', description: 'Health organization', category: 'Health', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', theme: { colors: { primary: '#dc2626', secondary: '#ef4444', background: '#ffffff', text: '#1f2937', accent: '#f87171' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n4', type: 'hero', order: 0, props: { title: 'Health for All', subtitle: 'Improving lives', ctaText: 'Support Us', ctaLink: '#' } }, { id: 'text-n4', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Mission</h2><p>Healthcare access</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n4', type: 'contact-form', order: 2, props: { title: 'Get Involved', description: 'Join our cause', buttonText: 'Contact', backgroundColor: '#fef2f2' } }, { id: 'footer-n4', type: 'footer', order: 3, props: { companyName: 'Health Org', tagline: 'Better Health', links: [], socialLinks: [] } }] };
const nonprofitAnimalTemplate: PageTemplate = { id: 'nonprofit-animal', name: 'Animal Welfare', description: 'Animal rescue', category: 'Animal Welfare', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400', theme: { colors: { primary: '#f59e0b', secondary: '#fbbf24', background: '#ffffff', text: '#1f2937', accent: '#fcd34d' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n5', type: 'hero', order: 0, props: { title: 'Animal Rescue', subtitle: 'Saving animals', ctaText: 'Adopt', ctaLink: '#' } }, { id: 'gallery-n5', type: 'gallery', order: 1, props: { title: 'Animals', images: [{ url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400', alt: 'Animal 1' }], columns: 3 } }, { id: 'contact-n5', type: 'contact-form', order: 2, props: { title: 'Adopt or Donate', description: 'Help animals', buttonText: 'Contact', backgroundColor: '#fffbeb' } }, { id: 'footer-n5', type: 'footer', order: 3, props: { companyName: 'Animal Rescue', tagline: 'Saving Lives', links: [], socialLinks: [] } }] };
const nonprofitCommunityTemplate: PageTemplate = { id: 'nonprofit-community', name: 'Community', description: 'Community organization', category: 'Community', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', theme: { colors: { primary: '#6366f1', secondary: '#818cf8', background: '#ffffff', text: '#1f2937', accent: '#a78bfa' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n6', type: 'hero', order: 0, props: { title: 'Building Community', subtitle: 'Together we thrive', ctaText: 'Join Us', ctaLink: '#' } }, { id: 'text-n6', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Work</h2><p>Community programs</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n6', type: 'contact-form', order: 2, props: { title: 'Get Involved', description: 'Join our community', buttonText: 'Contact', backgroundColor: '#f5f3ff' } }, { id: 'footer-n6', type: 'footer', order: 3, props: { companyName: 'Community Org', tagline: 'Stronger Together', links: [], socialLinks: [] } }] };
const nonprofitArtsTemplate: PageTemplate = { id: 'nonprofit-arts', name: 'Arts & Culture', description: 'Arts organization', category: 'Arts', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', theme: { colors: { primary: '#8b5cf6', secondary: '#a78bfa', background: '#ffffff', text: '#1f2937', accent: '#c4b5fd' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n7', type: 'hero', order: 0, props: { title: 'Arts & Culture', subtitle: 'Enriching lives through art', ctaText: 'Explore', ctaLink: '#' } }, { id: 'gallery-n7', type: 'gallery', order: 1, props: { title: 'Programs', images: [{ url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', alt: 'Art 1' }], columns: 3 } }, { id: 'contact-n7', type: 'contact-form', order: 2, props: { title: 'Support the Arts', description: 'Get involved', buttonText: 'Contact', backgroundColor: '#faf5ff' } }, { id: 'footer-n7', type: 'footer', order: 3, props: { companyName: 'Arts Org', tagline: 'Celebrating Culture', links: [], socialLinks: [] } }] };
const nonprofitYouthTemplate: PageTemplate = { id: 'nonprofit-youth', name: 'Youth Development', description: 'Youth programs', category: 'Youth', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', theme: { colors: { primary: '#ec4899', secondary: '#f472b6', background: '#ffffff', text: '#1f2937', accent: '#f9a8d4' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n8', type: 'hero', order: 0, props: { title: 'Youth Development', subtitle: 'Empowering young people', ctaText: 'Learn More', ctaLink: '#' } }, { id: 'text-n8', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Programs</h2><p>Youth initiatives</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n8', type: 'contact-form', order: 2, props: { title: 'Get Involved', description: 'Support youth', buttonText: 'Contact', backgroundColor: '#fdf2f8' } }, { id: 'footer-n8', type: 'footer', order: 3, props: { companyName: 'Youth Org', tagline: 'Empowering Youth', links: [], socialLinks: [] } }] };
const nonprofitHousingTemplate: PageTemplate = { id: 'nonprofit-housing', name: 'Housing', description: 'Housing assistance', category: 'Housing', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400', theme: { colors: { primary: '#0891b2', secondary: '#06b6d4', background: '#ffffff', text: '#1f2937', accent: '#22d3ee' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n9', type: 'hero', order: 0, props: { title: 'Housing for All', subtitle: 'Everyone deserves a home', ctaText: 'Help Us', ctaLink: '#' } }, { id: 'text-n9', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Our Mission</h2><p>Affordable housing</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n9', type: 'contact-form', order: 2, props: { title: 'Support Us', description: 'Join our cause', buttonText: 'Contact', backgroundColor: '#cffafe' } }, { id: 'footer-n9', type: 'footer', order: 3, props: { companyName: 'Housing Org', tagline: 'Homes for All', links: [], socialLinks: [] } }] };
const nonprofitFoodTemplate: PageTemplate = { id: 'nonprofit-food', name: 'Food Security', description: 'Fighting hunger', category: 'Food Security', siteType: 'nonprofit', thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400', theme: { colors: { primary: '#f97316', secondary: '#fb923c', background: '#ffffff', text: '#1f2937', accent: '#fdba74' }, fonts: { heading: 'Inter', body: 'Inter' }, mode: 'light' }, components: [{ id: 'hero-n10', type: 'hero', order: 0, props: { title: 'End Hunger', subtitle: 'Fighting food insecurity', ctaText: 'Donate', ctaLink: '#' } }, { id: 'text-n10', type: 'text', order: 1, props: { content: '<h2 class="text-3xl font-bold mb-4">Impact</h2><p>Feeding communities</p>', alignment: 'center', fontSize: 'lg' } }, { id: 'contact-n10', type: 'contact-form', order: 2, props: { title: 'Get Involved', description: 'Help end hunger', buttonText: 'Contact', backgroundColor: '#fff7ed' } }, { id: 'footer-n10', type: 'footer', order: 3, props: { companyName: 'Food Org', tagline: 'Fighting Hunger', links: [], socialLinks: [] } }] };

export const pageTemplates: PageTemplate[] = [
  modernSaaSTemplate, creativePortfolioTemplate, darkCyberpunkTemplate, minimalBlogTemplate, ecommerceTemplate, agencyTemplate, eventTemplate, appLaunchTemplate, startupPitchTemplate, wellnessTemplate,
  businessSaaSTemplate, businessAgencyTemplate, businessEcommerceTemplate, businessRestaurantTemplate, businessRealEstateTemplate, businessConsultingTemplate, businessFitnessTemplate, businessStartupTemplate, businessLawFirmTemplate, businessMarketingTemplate,
  personalCreativeTemplate, personalPhotographyTemplate, personalBlogTemplate, personalResumeTemplate, personalMusicianTemplate, personalWriterTemplate, personalCoachTemplate, personalArtistTemplate, personalTechTemplate, personalInfluencerTemplate,
  nonprofitCharityTemplate, nonprofitEnvironmentTemplate, nonprofitEducationTemplate, nonprofitHealthTemplate, nonprofitAnimalTemplate, nonprofitCommunityTemplate, nonprofitArtsTemplate, nonprofitYouthTemplate, nonprofitHousingTemplate, nonprofitFoodTemplate,
];

export const getTemplateById = (id: string): PageTemplate | undefined => {
  return pageTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): PageTemplate[] => {
  return pageTemplates.filter((template) => template.category === category);
};

export const getTemplatesBySiteType = (siteType: SiteType): PageTemplate[] => {
  return pageTemplates.filter((template) => template.siteType === siteType);
};

export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  pageTemplates.forEach((template) => categories.add(template.category));
  return Array.from(categories);
};
