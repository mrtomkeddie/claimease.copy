export interface SavedClaim {
  id: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  progress: number; // percentage of completion
  status: 'draft' | 'in-progress' | 'ready-to-submit';
  formData: {
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      address?: string;
      phoneNumber?: string;
      email?: string;
    };
    incidentDetails?: {
      dateOfIncident?: string;
      locationOfIncident?: string;
      descriptionOfIncident?: string;
    };
    injuries?: {
      typeOfInjury?: string;
      bodyPartsAffected?: string[];
      severityLevel?: string;
    };
    medicalTreatment?: {
      hospitalVisited?: string;
      doctorName?: string;
      treatmentReceived?: string;
      ongoingTreatment?: boolean;
    };
    workImpact?: {
      timeOffWork?: string;
      returnToWorkDate?: string;
      modifiedDuties?: boolean;
    };
  };
}

export const mockSavedClaims: SavedClaim[] = [
  {
    id: '1',
    title: 'Workplace Back Injury - March 2024',
    dateCreated: '2024-03-15',
    dateModified: '2024-03-20',
    progress: 75,
    status: 'in-progress',
    formData: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1985-06-15',
        address: '123 Main St, Toronto, ON',
        phoneNumber: '(416) 555-0123',
        email: 'john.smith@email.com',
      },
      incidentDetails: {
        dateOfIncident: '2024-03-10',
        locationOfIncident: 'Warehouse Floor B',
        descriptionOfIncident: 'Lifted heavy box incorrectly, felt immediate pain in lower back',
      },
      injuries: {
        typeOfInjury: 'Lower back strain',
        bodyPartsAffected: ['Lower Back', 'Left Hip'],
        severityLevel: 'Moderate',
      },
      medicalTreatment: {
        hospitalVisited: 'Toronto General Hospital',
        doctorName: 'Dr. Sarah Johnson',
        treatmentReceived: 'X-ray, pain medication, physiotherapy referral',
        ongoingTreatment: true,
      },
    },
  },
  {
    id: '2',
    title: 'Slip and Fall - February 2024',
    dateCreated: '2024-02-28',
    dateModified: '2024-02-28',
    progress: 25,
    status: 'draft',
    formData: {
      personalInfo: {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
      },
      incidentDetails: {
        dateOfIncident: '2024-02-25',
        locationOfIncident: 'Office lobby',
        descriptionOfIncident: 'Slipped on wet floor near entrance',
      },
    },
  },
  {
    id: '3',
    title: 'Repetitive Strain Injury - January 2024',
    dateCreated: '2024-01-20',
    dateModified: '2024-03-18',
    progress: 90,
    status: 'ready-to-submit',
    formData: {
      personalInfo: {
        firstName: 'David',
        lastName: 'Chen',
        dateOfBirth: '1990-11-22',
        address: '456 Oak Ave, Vancouver, BC',
        phoneNumber: '(604) 555-0456',
        email: 'david.chen@email.com',
      },
      incidentDetails: {
        dateOfIncident: '2024-01-15',
        locationOfIncident: 'Computer workstation',
        descriptionOfIncident: 'Developed wrist pain from repetitive computer use over several months',
      },
      injuries: {
        typeOfInjury: 'Carpal tunnel syndrome',
        bodyPartsAffected: ['Right Wrist', 'Right Hand'],
        severityLevel: 'Mild to Moderate',
      },
      medicalTreatment: {
        hospitalVisited: 'Vancouver Clinic',
        doctorName: 'Dr. Michael Wong',
        treatmentReceived: 'Nerve conduction study, wrist brace, ergonomic assessment',
        ongoingTreatment: true,
      },
      workImpact: {
        timeOffWork: '3 days',
        returnToWorkDate: '2024-01-25',
        modifiedDuties: true,
      },
    },
  },
];