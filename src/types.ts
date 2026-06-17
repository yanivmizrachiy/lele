export type PrintStyle = 'hybrid' | 'blue' | 'academic' | 'grayscale';

export interface Question {
  id: number;
  title: string;
  text: string;
  type: 
    | 'spinner' 
    | 'urn' 
    | 'dice' 
    | 'cards' 
    | 'tree' 
    | 'complementary' 
    | 'barchart' 
    | 'geometric'
    | 'vehicles'
    | 'football'
    | 'hobbies'
    | 'calls'
    | 'colors'
    | 'newspaper_sales'
    | 'tv_preferences'
    | 'green_initiative'
    | 'study_time'
    | 'pisa_hits'
    | 'headache'
    | 'headache_advanced'
    | 'usb_memory'
    | 'matching_charts'
    | 'petrus_penguins'
    | 'grades_range'
    | 'sports_class'
    | 'congested_intersection'
    | 'champion_shooter';
  answer: string;
  solution: string;
}

