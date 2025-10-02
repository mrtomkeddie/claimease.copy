
"use client";

import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '@/lib/constants';
import type { FormValues } from '@/lib/formSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PaidRouteGuard } from '@/components/PaidRouteGuard';

// PIP2 form question mappings
const pip2Mappings = {
  preparingFood: "Question 3",
  eatingAndDrinking: "Question 4", 
  managingTreatments: "Question 5",
  washingAndBathing: "Question 6",
  managingToiletNeeds: "Question 7",
  dressingAndUndressing: "Question 8",
  planningAndFollowingJourneys: "Question 11",
  movingAround: "Question 12",
};

const fieldLabels: Record<string, string> = {
  fullName: "Full Name",
  mainCondition: "Main Health Condition or Disability",
  otherConditions: "Other Conditions or Disabilities", 
  medications: "Medications",
  preparingFood: "Preparing Food",
  eatingAndDrinking: "Eating and Drinking",
  managingTreatments: "Managing Treatments",
  washingAndBathing: "Washing and Bathing",
  managingToiletNeeds: "Managing Toilet Needs",
  dressingAndUndressing: "Dressing and Undressing",
  planningAndFollowingJourneys: "Planning and Following Journeys",
  movingAround: "Moving Around",
  additionalInfo: "Additional Information",
};

export default function PrintPage() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setFormData(JSON.parse(savedData));
        setTimeout(() => window.print(), 1000);
      }
    } catch (error) {
      console.error("Failed to load or print data:", error);
    }
  }, []);

  const renderCoverPage = () => (
    <div className="page-break-after text-center space-y-8 mb-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-primary">ClaimEase PIP Claim Support Pack</h1>
        <div className="w-24 h-1 bg-primary mx-auto"></div>
      </div>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        <p className="text-xl text-gray-700 leading-relaxed">
          Your answers have been rewritten into clear, DWP-friendly statements.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          Each section below tells you exactly where to copy your answers into the PIP2 form.
        </p>
      </div>
    </div>
  );

  const renderPersonalDetails = () => {
    if (!formData?.fullName) return null;
    
    return (
      <section className="print-section mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Section 1: Personal Details</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          (This information goes into the first pages of your PIP2 form.)
        </p>
        <div className="space-y-3">
          <div>
            <strong>Full Name:</strong> {formData.fullName}
          </div>
        </div>
      </section>
    );
  };

  const renderHealthConditions = () => {
    const hasHealthContent = formData?.mainCondition || formData?.otherConditions || formData?.medications;
    if (!hasHealthContent) return null;

    return (
      <section className="print-section mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Section 2: Health Conditions & Medications</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          (Copy into "About Your Health Conditions" on the PIP2 form.)
        </p>
        <div className="space-y-6">
          {formData?.mainCondition && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Main Health Condition or Disability:</h3>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <p className="font-medium text-blue-800 mb-1">ClaimEase Answer:</p>
                <p className="text-gray-800 leading-relaxed">{formData.mainCondition}</p>
              </div>
            </div>
          )}
          
          {formData?.otherConditions && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Other Conditions or Disabilities:</h3>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <p className="font-medium text-blue-800 mb-1">ClaimEase Answer:</p>
                <p className="text-gray-800 leading-relaxed">{formData.otherConditions}</p>
              </div>
            </div>
          )}
          
          {formData?.medications && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Medications:</h3>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <p className="font-medium text-blue-800 mb-1">ClaimEase Answer:</p>
                <p className="text-gray-800 leading-relaxed">{formData.medications}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderDailyLiving = () => {
    const dailyLivingFields: (keyof FormValues)[] = [
      'preparingFood', 'eatingAndDrinking', 'managingTreatments', 
      'washingAndBathing', 'managingToiletNeeds', 'dressingAndUndressing'
    ];
    
    const hasContent = dailyLivingFields.some(field => formData?.[field]);
    if (!hasContent) return null;

    return (
      <section className="print-section mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Section 3: Daily Living Activities</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          (Each answer goes into the relevant Daily Living question on the PIP2 form.)
        </p>
        <div className="space-y-6">
          {dailyLivingFields.map(field => {
            const value = formData?.[field];
            if (!value) return null;
            
            return (
              <div key={field}>
                <h3 className="font-semibold text-lg mb-2">
                  {fieldLabels[field]} → {pip2Mappings[field as keyof typeof pip2Mappings]}
                </h3>
                <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <p className="font-medium text-green-800 mb-1">ClaimEase Answer:</p>
                  <p className="text-gray-800 leading-relaxed">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderMobility = () => {
    const mobilityFields: (keyof FormValues)[] = ['planningAndFollowingJourneys', 'movingAround'];
    const hasContent = mobilityFields.some(field => formData?.[field]);
    if (!hasContent) return null;

    return (
      <section className="print-section mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Section 4: Mobility</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          (Copy into "Moving Around" and "Planning and Following Journeys" on the PIP2 form.)
        </p>
        <div className="space-y-6">
          {mobilityFields.map(field => {
            const value = formData?.[field];
            if (!value) return null;
            
            return (
              <div key={field}>
                <h3 className="font-semibold text-lg mb-2">
                  {fieldLabels[field]} → {pip2Mappings[field as keyof typeof pip2Mappings]}
                </h3>
                <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                  <p className="font-medium text-purple-800 mb-1">ClaimEase Answer:</p>
                  <p className="text-gray-800 leading-relaxed">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderAdditionalInfo = () => {
    if (!formData?.additionalInfo) return null;

    return (
      <section className="print-section mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Section 5: Additional Information</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          (Copy into the "Extra Information" box at the end of the PIP2 form if relevant.)
        </p>
        <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
          <p className="font-medium text-orange-800 mb-1">ClaimEase Answer:</p>
          <p className="text-gray-800 leading-relaxed">{formData.additionalInfo}</p>
        </div>
      </section>
    );
  };

  const renderFinalPage = () => (
    <div className="page-break-before mt-12 space-y-8">
      <h2 className="text-3xl font-bold text-center border-b-2 border-black pb-4">Important Reminders</h2>
      
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
        <h3 className="text-xl font-bold text-red-800 mb-4">Before You Submit:</h3>
        <ul className="space-y-3 text-gray-800">
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>These answers are ready to copy into your PIP2 form, but <strong>ClaimEase does not submit the form for you.</strong></span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Double-check your answers are accurate and truthful before sending your application.</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Keep a copy of this pack for your records.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  if (!isMounted) {
    return <div className="p-8 text-center">Loading preview...</div>;
  }
  
  if (!formData) {
    return (
      <div className="p-8 text-center text-red-600">
        Could not load form data. Please complete the form before printing.
      </div>
    );
  }

  return (
    <PaidRouteGuard>
      <div className="bg-gray-100 p-2 md:p-8 font-sans">
        <header className="no-print mb-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">ClaimEase PIP Support Pack - Print Preview</h1>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2" />
            Print or Save as PDF
          </Button>
        </header>
        
        <div className="printable-area w-full max-w-4xl mx-auto p-8 md:p-12 bg-white text-black shadow-lg">
          {renderCoverPage()}
          {renderPersonalDetails()}
          {renderHealthConditions()}
          {renderDailyLiving()}
          {renderMobility()}
          {renderAdditionalInfo()}
          {renderFinalPage()}
        </div>

        <style jsx>{`
          @media print {
            .page-break-after {
              page-break-after: always;
            }
            .page-break-before {
              page-break-before: always;
            }
            .no-print {
              display: none;
            }
          }
        `}</style>
      </div>
    </PaidRouteGuard>
  );
}
