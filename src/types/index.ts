export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  createdAt: string;
  userId: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  eventId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  eventId: string;
  name: string;
  quantity: number;
  image?: string;
  createdAt: string;
}

export interface FileUpload {
  id: string;
  eventId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface RSVPField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'radio' | 'checkbox' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface RSVPForm {
  id: string;
  eventId: string;
  fields: RSVPField[];
  thankYouMessage: string;
  isActive: boolean;
}

export interface RSVPResponse {
  id: string;
  formId: string;
  eventId: string;
  responses: Record<string, any>;
  submittedAt: string;
  qrCode?: string;
}