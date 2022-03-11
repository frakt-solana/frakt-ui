import { PATHS } from '../../../constants';
import {
  TwitterIcon,
  DiscordIcon,
  GitHubIcon,
  MediumIcon,
  DocsIcon,
} from '../../../icons';

export const NAVIGATION_LINKS = [
  {
    to: PATHS.TEST,
    label: 'Test',
  },
  {
    to: PATHS.POOLS,
    label: 'Pools',
  },
  {
    to: PATHS.VAULTS,
    label: 'Vaults',
  },
  {
    to: PATHS.SWAP,
    label: 'Swap',
  },
  {
    to: PATHS.YIELD,
    label: 'Yield',
  },
];

export const DROPDOWN_EXTERNAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/FraktArt',
    icon: TwitterIcon,
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/frakt',
    icon: DiscordIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/frakt-solana',
    icon: GitHubIcon,
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@frakt_nft',
    icon: MediumIcon,
  },
  {
    label: 'Docs',
    href: 'https://docs.frakt.xyz/',
    icon: DocsIcon,
  },
];
