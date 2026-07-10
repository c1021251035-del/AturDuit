"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  mode: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  initialFocus?: boolean;
}

export function Calendar({ mode, selected, onSelect, initialFocus }: CalendarProps) {
  const [date, setDate] = useState(selected || new Date());
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    if (selected) {
      setDate(selected);
      setMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selected]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  const days: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(month.getFullYear(), month.getMonth(), d);
    const isSelected = selected && dayDate.toISOString().split("T")[0] === selected.toISOString().split("T")[0];
    const isToday = dayDate.toISOString().split("T")[0] === today.toISOString().split("T")[0];
    days.push(
      <button
        key={d}
        onClick={() => onSelect && onSelect(dayDate)}
        className={cn(
          "p-2 rounded-md text-sm hover:bg-muted",
          isSelected && "bg-primary text-primary-foreground",
          isToday && !isSelected && "bg-muted"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="p-3 w-64">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-sm">
          {month.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}