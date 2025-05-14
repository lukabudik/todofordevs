"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Edit2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Code,
  CheckSquare,
  Table,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Columns,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function EnhancedMarkdownEditor({
  value,
  onChange,
  placeholder = "Write your description here... (Supports Markdown)",
  minHeight = "200px",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview" | "split">("edit");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle tab key for code indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Insert text at cursor position
  const insertText = (
    before: string,
    after: string = "",
    defaultText: string = ""
  ) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);

    // Set cursor position after the inserted text
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos =
          start + before.length + selectedText.length + after.length;
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 0);
  };

  // Toolbar actions
  const toolbarActions = [
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: "Bold (Ctrl+B)",
      action: () => insertText("**", "**", "bold text"),
      shortcut: "Ctrl+B",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: "Italic (Ctrl+I)",
      action: () => insertText("*", "*", "italic text"),
      shortcut: "Ctrl+I",
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      tooltip: "Heading 1",
      action: () => insertText("# ", "", "Heading 1"),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      tooltip: "Heading 2",
      action: () => insertText("## ", "", "Heading 2"),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      tooltip: "Heading 3",
      action: () => insertText("### ", "", "Heading 3"),
    },
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: "Link (Ctrl+K)",
      action: () => setLinkDialogOpen(true),
      shortcut: "Ctrl+K",
    },
    {
      icon: <Image className="h-4 w-4" />,
      tooltip: "Image",
      action: () => setImageDialogOpen(true),
    },
    {
      icon: <List className="h-4 w-4" />,
      tooltip: "Bullet List",
      action: () => insertText("- ", "", "List item"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      tooltip: "Numbered List",
      action: () => insertText("1. ", "", "List item"),
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      tooltip: "Task List",
      action: () => insertText("- [ ] ", "", "Task item"),
    },
    {
      icon: <Code className="h-4 w-4" />,
      tooltip: "Code Block",
      action: () => insertText("```\n", "\n```", "code"),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      tooltip: "Blockquote",
      action: () => insertText("> ", "", "Blockquote"),
    },
    {
      icon: <Table className="h-4 w-4" />,
      tooltip: "Table",
      action: () =>
        insertText(
          "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n",
          "",
          ""
        ),
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            insertText("**", "**", "bold text");
            break;
          case "i":
            e.preventDefault();
            insertText("*", "*", "italic text");
            break;
          case "k":
            e.preventDefault();
            setLinkDialogOpen(true);
            break;
          case "enter":
            if (e.shiftKey) {
              e.preventDefault();
              // Submit form logic would go here
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [value]);

  // Insert link
  const insertLink = () => {
    const linkMarkdown = `[${linkText || "link text"}](${
      linkUrl || "https://example.com"
    })`;
    insertText(linkMarkdown, "", "");
    setLinkDialogOpen(false);
    setLinkText("");
    setLinkUrl("");
  };

  // Insert image
  const insertImage = () => {
    const imageMarkdown = `![${imageAlt || "image"}](${
      imageUrl || "https://example.com/image.jpg"
    })`;
    insertText(imageMarkdown, "", "");
    setImageDialogOpen(false);
    setImageAlt("");
    setImageUrl("");
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
        <div className="text-sm font-medium">Description</div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("edit")}
                  className={`h-8 ${mode === "edit" ? "bg-muted" : ""}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("preview")}
                  className={`h-8 ${mode === "preview" ? "bg-muted" : ""}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("split")}
                  className={`h-8 ${mode === "split" ? "bg-muted" : ""}`}
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Split View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Toolbar */}
      {mode !== "preview" && (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1">
          <TooltipProvider>
            {toolbarActions.map((action, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="h-8 w-8 p-0"
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {action.tooltip}
                  {action.shortcut && ` (${action.shortcut})`}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}

      <div className={`relative ${mode === "split" ? "flex" : ""}`}>
        {/* Editor */}
        {(mode === "edit" || mode === "split") && (
          <div className={mode === "split" ? "w-1/2 border-r" : "w-full"}>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[200px] resize-y rounded-none border-0 p-3 font-mono text-sm focus-visible:ring-0"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* Preview */}
        {(mode === "preview" || mode === "split") && (
          <div
            className={`prose prose-sm dark:prose-invert max-w-none overflow-auto p-4 ${
              mode === "split" ? "w-1/2" : "w-full"
            }`}
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

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Text to display"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Image description"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertImage}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
