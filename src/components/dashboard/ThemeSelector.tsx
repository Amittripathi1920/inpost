import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  themeColor: string;
  onThemeSelect: (color: string) => void;
  colorOptions: Array<{ name: string; color: string }>;
}

export function ThemeSelector({ themeColor, onThemeSelect, colorOptions }: ThemeSelectorProps) {
  return (
    <Card className="flex items-center w-full">
      <CardHeader>
        <CardDescription>Pick Your Favorite Theme</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 rounded-2xl items-center p-0">
        {colorOptions.map((option) => (
          <Button
            key={option.name}
            variant={themeColor === option.color ? "default" : "outline"}
            onClick={() => onThemeSelect(option.color)}
            className="w-6 h-6 rounded-full border-2"
            style={{
              backgroundColor: option.color,
              border: themeColor === option.color ? `3px solid ${option.color}` : "none",
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}