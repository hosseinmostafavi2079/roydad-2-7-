import React from 'react';

export interface Instructor {
  id: string;
  name: string;
  expertise: string;
  bio: string;
  imageUrl: string;
  coursesCount: number;
}

export interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  currency: string;
  capacity: number;
  registered: number;
  imageUrl: string;
  description: string;
  organizer: string;
  // New Fields
  instructorId?: string;
  isVirtual?: boolean;
  meetingLink?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}