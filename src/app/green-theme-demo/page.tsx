'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GreenThemeDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Green Theme Demo</h1>
          <p className="text-lg text-muted-foreground">Showcasing the enhanced dark theme with vibrant green accents</p>
        </div>

        {/* Color Palette */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Enhanced green color scheme for the dark theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-primary"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">hsl(142, 76%, 36%)</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-secondary"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">Dark Green</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-accent"></div>
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">Bright Green</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-tertiary"></div>
                <p className="text-sm font-medium">Tertiary</p>
                <p className="text-xs text-muted-foreground">Green Variant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Enhanced button styles with green theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className="btn-brand">Brand Button</Button>
              <Button className="btn-accent">Accent Button</Button>
              <Button className="btn-tertiary">Tertiary Button</Button>
              <Button className="btn-green-glow">Green Glow</Button>
            </div>
          </CardContent>
        </Card>

        {/* Gradient Examples */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Gradient Backgrounds</CardTitle>
            <CardDescription>Green-themed gradient backgrounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 rounded-lg gradient-dark-brand flex items-center justify-center text-white font-medium">
                Brand Gradient
              </div>
              <div className="h-32 rounded-lg gradient-green-glow flex items-center justify-center text-white font-medium">
                Green Glow
              </div>
              <div className="h-32 rounded-lg gradient-green-accent flex items-center justify-center text-white font-medium">
                Green Accent
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Glow Effects */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Glow Effects</CardTitle>
            <CardDescription>Enhanced glow effects with green theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-24 rounded-lg bg-primary/20 glow-primary flex items-center justify-center text-primary font-medium">
                Primary Glow
              </div>
              <div className="h-24 rounded-lg bg-accent/20 glow-accent flex items-center justify-center text-accent font-medium">
                Accent Glow
              </div>
              <div className="h-24 rounded-lg bg-green-500/20 green-glow flex items-center justify-center text-green-400 font-medium">
                Green Glow
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Border Effects */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Border Effects</CardTitle>
            <CardDescription>Green-themed border styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-24 rounded-lg bg-background green-border flex items-center justify-center text-green-400 font-medium">
                Green Border
              </div>
              <div className="h-24 rounded-lg bg-background green-border-glow flex items-center justify-center text-green-400 font-medium">
                Green Border Glow
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>Hover effects and interactive components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className="btn-brand hover-lift">Hover Lift Effect</Button>
              <Button className="btn-green-glow hover-lift">Green Glow Hover</Button>
              <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                Interactive Card
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}