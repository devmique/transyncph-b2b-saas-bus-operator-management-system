import { ObjectId } from 'mongodb';

export interface Operator {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  city: string;
  region: string;
  tier: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  _id?: ObjectId;
  operatorId: ObjectId;
  name: string;
  startTerminal: string;
  endTerminal: string;
  distance: number;
  estimatedDuration: number;
  fare: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  _id?: ObjectId;
  routeId: ObjectId;
  operatorId: ObjectId;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: number[];
  capacity: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Terminal {
  _id?: ObjectId;
  operatorId: ObjectId;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  _id?: ObjectId;
  operatorId: ObjectId;
  title: string;
  message: string;
  type: 'maintenance' | 'delay' | 'cancellation' | 'general';
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  operatorId: string;
  email: string;
  tier: string;
}
