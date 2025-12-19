
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  avatar?: string;
  verificationToken?: string;
}

export interface Chapter {
  title: string;
  time: number; // seconds
}

export interface Story {
  id: string;
  type: 'video' | 'photo';
  title: string;
  category: 'Homelessness' | 'Domestic Violence' | 'Addiction' | 'Social Justice';
  description: string;
  imageUrl: string; 
  date: string;
  localVideoUrl?: string; // Direct file URL only
  photos?: string[]; 
}

export interface Resource {
  id: string;
  name: string;
  nameZhTW?: string;
  nameZhCN?: string;
  region: 'North' | 'South' | 'Central' | 'National';
  type: 'Shelter' | 'Legal Aid' | 'Mental Health' | 'Hotline' | 'Food Bank' | 'Addiction Recovery' | 'Domestic Violence' | 'Chinese Services' | 'Other';
  typeZhTW?: string;
  typeZhCN?: string;
  description: string;
  descriptionZhTW?: string;
  descriptionZhCN?: string;
  contact: string;
  location: string;
  operatingHours?: string;
  operatingHoursZhTW?: string;
  operatingHoursZhCN?: string;
  website?: string;
}

export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  STORIES = 'STORIES',
  RESOURCES = 'RESOURCES',
  RESOURCE_CATEGORY = 'RESOURCE_CATEGORY',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PROFILE = 'PROFILE',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  SUBMIT_STORY = 'SUBMIT_STORY',
  CHAT = 'CHAT',
  VOLUNTEER = 'VOLUNTEER',
  PRESENTATION = 'PRESENTATION',
  DONATE = 'DONATE'
}
