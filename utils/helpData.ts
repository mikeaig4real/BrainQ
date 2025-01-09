import { categories, CategoryType } from "./constants";

const formatLabel = ( str: string ) =>
{
  return str.split( "_" ).map( ( word ) => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) ).join( " " );
}

const moreInfo = ( label: string, description: string ):string =>
{
  const moreInfoMap: {
    [key: string]: string
  } = {
"mnemonic":"Two groups of words named with colors will be displayed to you, you have to memorize the words from the first group displayed and find the word or words that appear in the next group.",
"sequence":"Wait and watch the way icons are produced and their frequency, after which you'll need to reproduce them in the same order and frequency they appeared.",
"arithmetic":"Pick the right options that will make the mathematical equations displayed to you mathematically correct.",
"chips":"Two boxes of balls will appear to you, you have to pick the one that holds the most additive weight.",
"countdown":"Numbers will be thrown at you to pick/click them in the order the question demands, be it in increasing or decreasing order.",
"true_or_false":"Statements will be given to you to be able to deduce if the final question asked is true or false.",
"patterns":"Logically predict what comes next from the group of progressions of icons and/or numbers.",
"clock_it":"Click the stop button to stop the ticking time as soon as the target given is reached, make sure to check for the right precision required.",
"whack_it":"Quickly hit the rat when and where you see it.",
"number_flash":"Identify which group of numbers is a perfect match to the ones flashing on the screen.",
"bubbles":"Identify the ball that bounces the highest amongst all of the balls bouncing on the screen.",
"scramble":"Try to decode the scattered word by typing what it might be when it's in the right order.",
"hangman":"Try to complete the word with the limited amount of lives given. You can make use of hints by clicking the 'Use Hint' button to reveal some letters.",
  }
  return moreInfoMap[label] ? `: ${moreInfoMap[label]}` : "";
}


const getContentFromCategories = ( categories: CategoryType[] ) =>
{
  const tests = [];
  for ( const category of categories )
  {
    for ( const test of category?.tests )
    {
      tests.push( {
        title: `${formatLabel(test.label)} (${category.label.toUpperCase()})`,
        description: `${test.description}
${moreInfo(test.label, test.description)}`      } );
    }
  }
  return tests;
}


export const helpData = [
  {
    id: 'brain-q',
    tabTitle: 'Brain-Q',
    contents: [
      {
        title: 'What is Brain-Q?',
        description: 'Brain-Q is a cognitive training platform designed to enhance your mental capabilities through various engaging exercises and games. Our scientifically-backed approach helps improve memory, focus, problem-solving, and more.'
      },
      {
        title: 'How it Works',
        description: 'Brain-Q adapts to your performance, providing increasingly challenging exercises as you improve.'
      },
      {
        title: 'Benefits',
        description: 'Regular use of Brain-Q can lead to improved cognitive function, better memory retention, enhanced problem-solving skills, and increased mental agility.'
      }
    ]
  },
  {
    id: 'faqs',
    tabTitle: 'FAQs',
    contents: [
      {
        title: 'How often should I practice?',
        description: 'We recommend practicing for 15-20 minutes daily to see optimal results. Consistency is key to improving your cognitive abilities.'
      },
      {
        title: 'Can I track my progress?',
        description: 'Yes! Brain-Q provides some progress tracking for each category type. The Stats section provides your previous (cumulative) and most recent performance, This is done to make you concentrate on your active progress.'
      },
      {
        title: 'Is Brain-Q suitable for all ages?',
        description: 'Absolutely! Brain-Q is designed for users of all ages (Um... Most of the time 🤣). The adaptive difficulty ensures everyone can benefit from the exercises.'
      },
      {
        title: 'All Questions Correct, Stats still low?',
        description: "Yes, It's possible to get all questions correctly but still low performance, this is because just as correctness is measured, speed is measured by how many questions you can answer",
      },
    ]
  },
  {
    id: 'games',
    tabTitle: 'Games',
    contents: [
      ...getContentFromCategories(categories)
    ]
  }
];
