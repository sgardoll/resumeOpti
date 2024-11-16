import React from 'react';
import { Copy, Download } from 'lucide-react';
import { Button } from './Button';

interface ResumeActionsProps {
  markdown: string;
}

export function ResumeActions({ markdown }: ResumeActionsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        icon={Copy}
        onClick={handleCopy}
      >
        Copy
      </Button>
      <Button
        variant="secondary"
        icon={Download}
        onClick={handleDownload}
      >
        Download
      </Button>
    </div>
  );
}