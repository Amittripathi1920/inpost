// components/TopicCombobox.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Topic = {
  id: number
  name: string
}

interface TopicComboboxProps {
  selectedTopicId: number | null
  onChange: (topicId: number, topicName: string) => void
}

export function TopicCombobox({ selectedTopicId, onChange }: TopicComboboxProps) {
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase.from("topics").select("*").order("name")
      if (!error) setTopics(data)
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    const match = topics.find((t) => t.id === selectedTopicId)
    if (match) setSelectedTopic(match)
  }, [topics, selectedTopicId])

  const handleSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    onChange(topic.id, topic.name)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTopic ? selectedTopic.name : "Select topic"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search topic..." />
          <CommandEmpty>No topic found.</CommandEmpty>
          <ScrollArea className="h-52">
            <CommandGroup>
              {topics.map((topic) => (
                <CommandItem
                  key={topic.id}
                  value={topic.name}
                  onSelect={() => handleSelect(topic)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTopic?.id === topic.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {topic.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
