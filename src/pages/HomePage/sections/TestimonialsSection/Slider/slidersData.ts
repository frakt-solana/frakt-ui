import testimonialImage1 from '../../../images/team/teamPhotoAdrian.jpg';
import testimonialImage2 from '../../../images/team/teamPhotoEgor.jpg';
import testimonialImage3 from '../../../images/team/teamPhotoPhil.jpg';
import testimonialImage4 from '../../../images/team/teamPhotoTim.jpg';
import testimonialImage5 from '../../../images/team/teamPhotoRoman.jpg';
import testimonialImage6 from '../../../images/team/teamPhotoVedamire.jpg';
import testimonialImage7 from '../../../images/team/teamPhotoViktor.jpg';
import testimonialImage8 from '../../../images/team/teamPhotoVlad2.jpg';
import testimonialImage9 from '../../../images/team/teamPhotoVlad.jpg';

interface SlidersDataItem {
  imageSrc1: string;
  imageSrc2?: string;
  name1: string;
  name2?: string;
  organisation1: string;
  organisation2?: string;
  text1: string;
  text2?: string;
}

export const SLIDER_DATA: SlidersDataItem[] = [
  {
    imageSrc1: testimonialImage1,
    imageSrc2: testimonialImage2,
    name1: 'Adrian',
    name2: 'Egor Biden',
    organisation1: 'cryptorussia',
    organisation2: 'cryptorussia',
    text1:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
    text2:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
  {
    imageSrc1: testimonialImage3,
    imageSrc2: testimonialImage4,
    name1: 'Phil Biden',
    name2: 'Tim Biden',
    organisation1: 'cryptorussia',
    organisation2: 'cryptorussia',
    text1:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
    text2:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
  {
    imageSrc1: testimonialImage5,
    imageSrc2: testimonialImage6,
    name1: 'Roman Biden',
    name2: 'Viktor Biden',
    organisation1: 'cryptorussia',
    organisation2: 'cryptorussia',
    text1:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
    text2:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
  {
    imageSrc1: testimonialImage7,
    imageSrc2: testimonialImage8,
    name1: 'Vlad Biden',
    name2: 'Vedamir Biden',
    organisation1: 'cryptorussia',
    organisation2: 'cryptorussia',
    text1:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
    text2:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
  {
    imageSrc1: testimonialImage9,
    name1: 'Vlad Biden',
    organisation1: 'cryptorussia',
    text1:
      'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
];
