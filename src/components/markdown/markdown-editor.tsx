"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit2 } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your description here... (Supports Markdown)",
  minHeight = "200px",
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
        <div className="text-sm font-medium">Description</div>
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 gap-1"
          >
            {isPreview ? (
              <>
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        {isPreview ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none overflow-auto p-4"
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">No content to preview</p>
            )}
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] resize-y rounded-none border-0 p-3 focus-visible:ring-0"
            style={{ minHeight }}
          />
        )}
      </div>

      <div className="border-t bg-muted/50 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Supports{" "}
          <a
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Markdown
          </a>{" "}
          including tables, lists, code blocks, and more.
        </p>
      </div>
    </div>
  );
}
