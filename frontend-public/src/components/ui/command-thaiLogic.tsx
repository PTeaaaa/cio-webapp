"use client"

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import FlexSearch from "flexsearch";

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// High-performance Thai search using FlexSearch + thai-wordcut
const createFlexSearchFilter = () => {
  // Create a single FlexSearch index that will be reused
  const index = new FlexSearch.Index({
    tokenize: "forward",
    cache: true
  });

  // Cache for processed items to avoid re-processing
  const itemCache = new Map<string, { id: string; processed: boolean }>();
  let idCounter = 0;

  const processThaiText = (text: string): string => {
    const cleaned = text.toLowerCase().trim();

    // Simple Thai word boundary detection using Thai characters
    // This splits Thai text at logical boundaries
    const words = [];
    let currentWord = '';

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      const charCode = char.charCodeAt(0);

      // Thai consonants and tone marks ranges
      const isThaiConsonant = charCode >= 0x0E01 && charCode <= 0x0E2E;
      const isSpace = char === ' ';

      if (isSpace) {
        if (currentWord) {
          words.push(currentWord);
          currentWord = '';
        }
      } else if (isThaiConsonant && currentWord.length > 2) {
        // Break at consonants after building some word length
        words.push(currentWord);
        currentWord = char;
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      words.push(currentWord);
    }

    // Return original text + broken words
    return [cleaned, ...words].join(' ');
  };

  const addToIndex = (value: string, keywords?: string[]): string => {
    const cacheKey = `${value}|${keywords?.join('|') || ''}`;

    if (itemCache.has(cacheKey)) {
      return itemCache.get(cacheKey)!.id;
    }

    const id = `item_${idCounter++}`;

    // Process the text with thai-wordcut
    const processedValue = processThaiText(value);
    const processedKeywords = keywords ? keywords.map(k => processThaiText(k)).join(' ') : '';
    const combinedText = `${processedValue} ${processedKeywords}`.trim();

    // Add to FlexSearch index
    index.add(id, combinedText);

    // Cache the result
    itemCache.set(cacheKey, { id, processed: true });

    return id;
  };

  return (value: string, search: string, keywords?: string[]) => {
    if (!search) return 1;

    try {
      // Add current item to index (cached, so only done once per unique item)
      const itemId = addToIndex(value, keywords);

      // Process search query with thai-wordcut
      const processedSearch = processThaiText(search);

      // Search in the index
      const results = index.search(processedSearch);

      // Return 1 if this item was found, 0 otherwise
      return results.includes(itemId) ? 1 : 0;
    } catch {
      // Fallback to simple string matching if anything fails
      const searchLower = search.toLowerCase();
      const valueLower = value.toLowerCase();
      const keywordsLower = keywords ? keywords.join(' ').toLowerCase() : '';
      const combinedLower = `${valueLower} ${keywordsLower}`;

      return combinedLower.includes(searchLower) ? 1 : 0;
    }
  };
};

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  const flexSearchFilter = React.useMemo(() => createFlexSearchFilter(), [])

  return (
    <CommandPrimitive
      data-slot="command"
      filter={flexSearchFilter}
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
