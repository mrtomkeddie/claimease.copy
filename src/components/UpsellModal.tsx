'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Crown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserTier, PRICING } from '@/lib/constants';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onContinueFree?: () => void;
}

export function UpsellModal({ isOpen, onClose, onPurchase, onContinueFree }: UpsellModalProps) {
  const { user } = useUser();
  
  const isProTier = user?.tier === UserTier.PRO;
  const remainingClaims = user ? (user.tier === UserTier.PRO ? -1 : Math.max(0, 1 - user.claims_used)) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {isProTier ? 'Pro Claims Available' : 'Claim Limit Reached'}
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            {isProTier 
              ? 'You have unlimited claims with your Pro plan!'
              : `You've used all ${user?.claims_used || 0} of your included claims.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {!isProTier && (
          <div className="space-y-4 py-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm">Full PIP claim support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm">Same expert guidance</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm">Free appeal support if needed</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Perfect for partners, family members, or new applications
            </div>
            
            {/* Upgrade to Pro Option */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Better Value: Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Get unlimited claims for just £{PRICING.UPGRADE_TO_PRO} more (total £{PRICING.PRO})
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={onPurchase}
              >
                Upgrade to Pro Claims
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onPurchase}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isProTier}
          >
            <Crown className="h-4 w-4 mr-2" />
            {isProTier ? 'Pro Plan Active' : `Upgrade to Pro for £${PRICING.UPGRADE_TO_PRO}`}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onContinueFree || onClose}
            className="w-full"
          >
            {isProTier ? 'Continue' : 'Maybe Later'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}