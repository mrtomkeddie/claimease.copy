'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit, Eye, Calendar, User } from 'lucide-react';
import { mockSavedClaims, SavedClaim } from '@/lib/mockData';
import { poppins } from '@/lib/fonts';
import { UpsellModal } from './UpsellModal';

interface SavedClaimsProps {
  onLoadClaim?: (claim: SavedClaim) => void;
  onNewClaim?: () => void;
}

export default function SavedClaims({ onLoadClaim, onNewClaim }: SavedClaimsProps) {
  const [savedClaims, setSavedClaims] = useState<SavedClaim[]>(mockSavedClaims);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const handleDeleteClaim = (claimId: string) => {
    setSavedClaims(prev => prev.filter(claim => claim.id !== claimId));
  };

  const handleStartNewClaim = () => {
    // Show upsell modal if user has existing claims
    if (savedClaims.length > 0) {
      setShowUpsellModal(true);
    } else {
      // If no existing claims, proceed directly
      onNewClaim?.();
    }
  };

  const handlePurchaseExtraClaim = () => {
    // TODO: Implement payment flow
    setShowUpsellModal(false);
    onNewClaim?.();
  };

  const handleContinueFree = () => {
    setShowUpsellModal(false);
    onNewClaim?.();
  };

  const getStatusColor = (status: SavedClaim['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready-to-submit':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: SavedClaim['status']) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in-progress':
        return 'In Progress';
      case 'ready-to-submit':
        return 'Ready to Submit';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${poppins.className}`}>
              Saved Claims
            </h1>
            <p className="text-gray-600">
              Continue working on your saved claims or start a new one
            </p>
          </div>
          <Button 
            onClick={handleStartNewClaim}
            className="bg-primary hover:bg-primary/90"
          >
            Start New Claim
          </Button>
        </div>

        {savedClaims.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <User className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved claims</h3>
              <p className="text-gray-600 mb-4">
                You haven't saved any claims yet. Start a new claim to get started.
              </p>
              <Button onClick={handleStartNewClaim}>
                Start Your First Claim
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedClaims.map((claim) => (
              <Card key={claim.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(claim.status)}
                    >
                      {getStatusText(claim.status)}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {claim.progress}% complete
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {claim.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {formatDate(claim.dateCreated)}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <Progress value={claim.progress} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <p><strong>Last modified:</strong> {formatDate(claim.dateModified)}</p>
                    {claim.formData.personalInfo?.firstName && (
                      <p><strong>Claimant:</strong> {claim.formData.personalInfo.firstName} {claim.formData.personalInfo.lastName}</p>
                    )}
                    {claim.formData.incidentDetails?.dateOfIncident && (
                      <p><strong>Incident Date:</strong> {formatDate(claim.formData.incidentDetails.dateOfIncident)}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadClaim?.(claim)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Continue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* TODO: Implement preview */}}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClaim(claim.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onPurchase={handlePurchaseExtraClaim}
        onContinueFree={handleContinueFree}
      />
    </>
  );
}