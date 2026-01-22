import { HeroBlock, heroBlockConfig } from '@/components/blocks/HeroBlock';
import { CTABlock, ctaBlockConfig } from '@/components/blocks/CTABlock';
import { GalleryBlock, galleryBlockConfig } from '@/components/blocks/GalleryBlock';
import { TextBlock, textBlockConfig } from '@/components/blocks/TextBlock';
import { FooterBlock, footerBlockConfig } from '@/components/blocks/FooterBlock';
import { DisclaimerBlock, disclaimerBlockConfig } from '@/components/blocks/DisclaimerBlock';
import { VolunteerFormBlock, volunteerFormBlockConfig } from '@/components/blocks/VolunteerFormBlock';
import { ContactFormBlock, contactFormBlockConfig } from '@/components/blocks/ContactFormBlock';
import { AboutBlock, aboutBlockConfig } from '@/components/blocks/AboutBlock';
import { NewsBlock, newsBlockConfig } from '@/components/blocks/NewsBlock';
import { GridBlock, gridBlockConfig } from '@/components/blocks/GridBlock';
import { ButtonComponent, buttonComponentConfig } from '@/components/blocks/ButtonComponent';
import { ImageComponent, imageComponentConfig } from '@/components/blocks/ImageComponent';
import { HeadingComponent, headingComponentConfig } from '@/components/blocks/HeadingComponent';
import { ParagraphComponent, paragraphComponentConfig } from '@/components/blocks/ParagraphComponent';
import { DividerComponent, dividerComponentConfig } from '@/components/blocks/DividerComponent';
import { VideoComponent, videoComponentConfig } from '@/components/blocks/VideoComponent';
import { LinkComponent, linkComponentConfig } from '@/components/blocks/LinkComponent';
import { SpacerComponent, spacerComponentConfig } from '@/components/blocks/SpacerComponent';
import { ListComponent, listComponentConfig } from '@/components/blocks/ListComponent';
import { BadgeComponent, badgeComponentConfig } from '@/components/blocks/BadgeComponent';
import { QuoteComponent, quoteComponentConfig } from '@/components/blocks/QuoteComponent';

export type BlockConfig = {
  type: string;
  name: string;
  category: string;
  defaultProps: Record<string, any>;
  propsSchema: Record<string, any>;
  thumbnail?: string; // Optional thumbnail SVG or data URI
};

export type BlockComponent = React.FC<any>;

export const blockRegistry: Record<string, { component: BlockComponent; config: BlockConfig }> = {
  // Sections
  hero: { component: HeroBlock, config: heroBlockConfig },
  cta: { component: CTABlock, config: ctaBlockConfig },
  gallery: { component: GalleryBlock, config: galleryBlockConfig },
  footer: { component: FooterBlock, config: footerBlockConfig },
  about: { component: AboutBlock, config: aboutBlockConfig },
  news: { component: NewsBlock, config: newsBlockConfig },
  grid: { component: GridBlock, config: gridBlockConfig },

  // Components
  button: { component: ButtonComponent, config: buttonComponentConfig },
  image: { component: ImageComponent, config: imageComponentConfig },
  heading: { component: HeadingComponent, config: headingComponentConfig },
  paragraph: { component: ParagraphComponent, config: paragraphComponentConfig },
  divider: { component: DividerComponent, config: dividerComponentConfig },
  video: { component: VideoComponent, config: videoComponentConfig },
  link: { component: LinkComponent, config: linkComponentConfig },
  spacer: { component: SpacerComponent, config: spacerComponentConfig },
  list: { component: ListComponent, config: listComponentConfig },
  badge: { component: BadgeComponent, config: badgeComponentConfig },
  quote: { component: QuoteComponent, config: quoteComponentConfig },
  text: { component: TextBlock, config: textBlockConfig },
  disclaimer: { component: DisclaimerBlock, config: disclaimerBlockConfig },
  'volunteer-form': { component: VolunteerFormBlock, config: volunteerFormBlockConfig },
  'contact-form': { component: ContactFormBlock, config: contactFormBlockConfig },
};

export const getBlockComponent = (type: string): BlockComponent | null => {
  return blockRegistry[type]?.component || null;
};

export const getBlockConfig = (type: string): BlockConfig | null => {
  return blockRegistry[type]?.config || null;
};

export const getAllBlockConfigs = (): BlockConfig[] => {
  return Object.values(blockRegistry).map((block) => block.config);
};

export const getBlocksByCategory = (category: string): BlockConfig[] => {
  return getAllBlockConfigs().filter((config) => config.category === category);
};

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  getAllBlockConfigs().forEach((config) => categories.add(config.category));
  return Array.from(categories);
};
