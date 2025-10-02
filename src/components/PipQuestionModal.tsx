
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  FileText
} from 'lucide-react';

interface QuestionSection {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    label: string;
    points: number;
    description: string;
  }[];
}

interface PipQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string | null;
  onComplete: (activityId: string, score: number, answers: any) => void;
}

const activityQuestions: Record<string, QuestionSection[]> = {
  'preparing-food': [
    {
      id: 'main-question',
      title: 'Preparing Food',
      description: 'Can you prepare and cook a simple meal unaided?',
      options: [
        {
          id: 'no-help',
          label: 'Can prepare and cook a simple meal unaided',
          points: 0,
          description: 'You can safely prepare and cook food without help'
        },
        {
          id: 'supervision',
          label: 'Needs to use an aid or appliance to be able to either prepare or cook a simple meal',
          points: 2,
          description: 'You need aids like special utensils or appliances'
        },
        {
          id: 'prompting',
          label: 'Cannot cook a simple meal using a conventional cooker but is able to do so using a microwave',
          points: 2,
          description: 'You can only use a microwave, not a conventional cooker'
        },
        {
          id: 'assistance',
          label: 'Needs prompting to be able to either prepare or cook a simple meal',
          points: 4,
          description: 'You need someone to remind or encourage you'
        },
        {
          id: 'physical-help',
          label: 'Needs supervision or assistance to be able to either prepare or cook a simple meal',
          points: 8,
          description: 'You need someone to watch over you or help you'
        },
        {
          id: 'cannot-do',
          label: 'Cannot prepare and cook food',
          points: 8,
          description: 'You cannot prepare or cook food at all'
        }
      ]
    }
  ],
  'moving-around': [
    {
      id: 'main-question',
      title: 'Moving Around',
      description: 'Can you stand and then move more than 1 metre but no more than 20 metres, either aided or unaided?',
      options: [
        {
          id: 'over-200m',
          label: 'Can stand and then move more than 200 metres, either aided or unaided',
          points: 0,
          description: 'You can walk over 200 metres'
        },
        {
          id: '50-200m',
          label: 'Can stand and then move more than 50 metres but no more than 200 metres, either aided or unaided',
          points: 4,
          description: 'You can walk between 50-200 metres'
        },
        {
          id: '20-50m',
          label: 'Can stand and then move more than 20 metres but no more than 50 metres, either aided or unaided',
          points: 8,
          description: 'You can walk between 20-50 metres'
        },
        {
          id: '1-20m',
          label: 'Can stand and then move more than 1 metre but no more than 20 metres, either aided or unaided',
          points: 10,
          description: 'You can walk between 1-20 metres'
        },
        {
          id: 'less-1m',
          label: 'Cannot, either aided or unaided, stand or move more than 1 metre',
          points: 12,
          description: 'You cannot stand or move more than 1 metre'
        }
      ]
    }
  ],
  'washing-dressing': [
    {
      id: 'main-question',
      title: 'Washing and Dressing',
      description: 'Can you wash and dress yourself?',
      options: [
        {
          id: 'no-help',
          label: 'Can wash and dress unaided',
          points: 0,
          description: 'You can wash and dress yourself without help'
        },
        {
          id: 'aids',
          label: 'Needs to use an aid or appliance to be able to wash or dress',
          points: 2,
          description: 'You need aids like grab rails or special equipment'
        },
        {
          id: 'prompting',
          label: 'Needs prompting to be able to wash or dress',
          points: 4,
          description: 'You need someone to remind you or encourage you'
        },
        {
          id: 'assistance',
          label: 'Needs assistance to be able to wash either their hair or body below the waist',
          points: 4,
          description: 'You need help washing hair or lower body'
        },
        {
          id: 'supervision',
          label: 'Needs supervision or assistance to be able to wash or dress',
          points: 8,
          description: 'You need someone to watch over you or help you'
        },
        {
          id: 'cannot-do',
          label: 'Cannot wash and dress at all',
          points: 8,
          description: 'You cannot wash or dress yourself at all'
        }
      ]
    }
  ],
};

const getActivityTitle = (activityId: string): string => {
  const titles: Record<string, string> = {
    'preparing-food': 'Preparing Food',
    'moving-around': 'Moving Around',
    'washing-dressing': 'Washing & Dressing',
    'managing-treatments': 'Managing Treatments',
    'eating-drinking': 'Eating & Drinking',
    'toilet-use': 'Toilet Use',
    'speaking-understanding': 'Speaking & Understanding',
    'reading': 'Reading',
    'social-interaction': 'Social Interaction',
    'managing-money': 'Managing Money',
    'planning-journeys': 'Planning & Following Journeys',
    'engaging-others': 'Engaging With Others'
  };
  return titles[activityId] || 'Unknown Activity';
};

export function PipQuestionModal({ isOpen, onClose, activityId, onComplete }: PipQuestionModalProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState('');

  const questions = activityId ? activityQuestions[activityId] || [] : [];
  const currentSection = questions[currentSectionIndex];
  const isLastSection = currentSectionIndex === questions.length - 1;
  const hasAnswered = currentSection ? answers[currentSection.id] : false;

  useEffect(() => {
    if (isOpen) {
      setCurrentSectionIndex(0);
      setAnswers({});
      setAdditionalInfo('');
    }
  }, [isOpen, activityId]);

  const handleAnswerChange = (sectionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!activityId) return;

    let totalScore = 0;
    questions.forEach(question => {
      const answerId = answers[question.id];
      if (answerId) {
        const option = question.options.find(opt => opt.id === answerId);
        if (option) {
          totalScore += option.points;
        }
      }
    });

    const answerData = {
      answers,
      additionalInfo,
      totalScore,
      timestamp: new Date().toISOString()
    };

    onComplete(activityId, totalScore, answerData);
  };

  if (!isOpen || !activityId || !currentSection) {
    return null;
  }

  const selectedOption = currentSection.options.find(opt => opt.id === answers[currentSection.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-medium">
              {getActivityTitle(activityId)}
            </DialogTitle>
            <Badge variant="outline" className="text-sm">
              Question {currentSectionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <DialogDescription className="text-base">
            Answer honestly based on your typical bad days, not your best days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSectionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <Card className="card-elevated">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium">{currentSection.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {currentSection.description}
                  </p>
                </div>

                <RadioGroup
                  value={answers[currentSection.id] || ''}
                  onValueChange={(value) => handleAnswerChange(currentSection.id, value)}
                  className="space-y-4"
                >
                  {currentSection.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant={option.points === 0 ? "secondary" : "outline"} className="text-xs">
                              {option.points} points
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {selectedOption && (
            <Card className="gradient-dark-brand border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-primary">Your Answer</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedOption.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedOption.points} points
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLastSection && (
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Additional Information (Optional)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add any extra details about your condition that might help explain your situation better.
                  </p>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="For example: medication side effects, good days vs bad days, specific difficulties..."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={currentSectionIndex === 0 ? onClose : handlePrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentSectionIndex === 0 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex items-center gap-4">
            {isLastSection ? (
              <Button
                onClick={handleSubmit}
                disabled={!hasAnswered}
                className="glow-primary flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="glow-primary flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
