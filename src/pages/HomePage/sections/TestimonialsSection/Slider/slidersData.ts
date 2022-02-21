import testimonialImageUser from '../../../images/testimonials/userIcon.svg';
import testimonialImage1 from '../../../images/testimonials/testy1.png';
import testimonialImage3 from '../../../images/testimonials/testy3.png';

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
    imageSrc2: testimonialImageUser,
    name1: 'r0b0',
    name2: 'Ravage',
    organisation1: 'BackDAO',
    organisation2: 'Dino Kingz',
    text1:
      'We fractionalized NFTs to offer them to our DAO members, we went on to base our entire Backistan economy and the issuance of $BACK on the fraktionalization of a basket containing no less than 766 NFTs.\n' +
      '\n' +
      'Throughout the implementation of the Frakt developed solutions we have received tremendous support from the team.',
    text2:
      'FRAKT  allowed Dino Kingz vision to come true.\n' +
      '\n' +
      'Dino DAO wanted to have a token backed by SOL NFTs instead of a LP/USD. We had a vision to create ETF Style vault where our DAO members can become shareholders and by fractionalising our DAO holdings on FRAKT, this generated a token which allows our community to become shareholders of the DAO vault by receiving the token \n' +
      '\n' +
      "FRAKT's Fraktionalisation protocol and it’s basket feature  made the whole process of adding NFTs, Fractionalising NFTs and generating  tokens very easy. Anyone without any dev experience can follow their guide and fraktionalize their NFTs for any purpose in less than couple minutes",
  },
  {
    imageSrc1: testimonialImage3,
    // imageSrc2: testimonialImage4,
    name1: 'G',
    // name2: 'Tim Biden',
    organisation1: '@Crypt0xG',
    // organisation2: 'cryptorussia',
    text1: 'The process was smooth and straightforward',
    // text2:
    // 'Your task is not just to do something new, your task is to take a fundamentally new step. bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
  },
];
