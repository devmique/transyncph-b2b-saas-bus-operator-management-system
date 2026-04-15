 
export interface OperatorProfile {
    name: string
    email: string
    companyName: string
    phone: string
    city: string
    region: string
    tier: string
    status: string
  }
   
  export interface Announcement {
    _id?: string
    title: string
    message: string
    type: 'info' | 'warning' | 'alert'
    affectedRoutes: string[]
    createdAt?: Date
  }

 export interface Route {
    _id?: string
    routeNumber: string
    startPoint: string
    endPoint: string
    distance: number
    estimatedTime: string
  }
  
  export interface Schedule {
    _id?: string
    routeNumber: string
    departureTime: string
    arrivalTime: string
    driverName: string
    vehicleNumber: string
    status: 'active' | 'inactive'
  }

  export interface Terminal {
    _id?: string
    name: string
    location: string
    lat: number
    lng: number
    facilities?: string[]
  }
  

  