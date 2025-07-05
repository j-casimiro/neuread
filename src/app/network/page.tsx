'use client';
import { useAppStore } from '../store';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import NodeItem from '@/components/NodeItem';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

function getCenterPosition() {
  // For demo, center in a 800x600 area
  return { x: 400, y: 300 };
}

type EditNoteSheetProps = {
  node: import('../store').Node;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
};

function EditNoteSheet({ node, onSave, onCancel }: EditNoteSheetProps) {
  const [title, setTitle] = useState(node.title);
  const [content, setContent] = useState(node.content);
  return (
    <form
      className="flex flex-col gap-4 mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(title, content);
      }}
    >
      <label className="font-medium">Title</label>
      <input
        className="border rounded px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="font-medium">Content</label>
      <textarea
        className="border rounded px-2 py-1 min-h-[120px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2 justify-end mt-4">
        <button
          type="button"
          className="px-3 py-1 rounded border"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 rounded bg-primary text-primary-foreground"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default function NetworkView() {
  const nodes = useAppStore((s) => s.nodes);
  const addNode = useAppStore((s) => s.addNode);
  const updateNode = useAppStore((s) => s.updateNode);

  // Add dummy data on mount if empty
  useEffect(() => {
    if (nodes.length === 0) {
      // No-op for now, wait for user to click Add Node
    }
  }, [nodes.length]);

  const handleAddNode = () => {
    const { x, y } = getCenterPosition();
    addNode({
      id: Date.now().toString(),
      title: 'First Note',
      content: '',
      x,
      y,
      parentId: null,
    });
  };

  // Drag state
  const [dragging, setDragging] = useState<null | {
    node: import('../store').Node;
    start: { x: number; y: number };
  }>(null);
  const [dragLine, setDragLine] = useState<null | {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Edit sheet state
  const [editingNode, setEditingNode] = useState<null | string>(null);

  // Get node being edited
  const nodeToEdit = nodes.find((n) => n.id === editingNode) || null;

  return (
    <section
      aria-label="Network Canvas"
      className="absolute inset-0 w-full h-full z-0 bg-muted/50 rounded-xl overflow-hidden"
    >
      {nodes.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-lg select-none gap-4">
          <div>No notes yet.</div>
          <Button onClick={handleAddNode}>+ Add Node</Button>
        </div>
      ) : (
        <div
          className="w-full h-full relative"
          ref={containerRef}
          onMouseMove={(e) => {
            if (dragging && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              setDragLine({
                x1: dragging.node.x,
                y1: dragging.node.y,
                x2: e.clientX - rect.left,
                y2: e.clientY - rect.top,
              });
            }
          }}
        >
          {/* Render SVG lines for connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {nodes.map((node) => {
              if (!node.parentId) return null;
              const parent = nodes.find((n) => n.id === node.parentId);
              if (!parent) return null;
              return (
                <line
                  key={node.id + '-line'}
                  x1={parent.x}
                  y1={parent.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="#8884"
                  strokeWidth={2}
                />
              );
            })}
            {/* Drag line */}
            {dragLine && (
              <line
                x1={dragLine.x1}
                y1={dragLine.y1}
                x2={dragLine.x2}
                y2={dragLine.y2}
                stroke="#4f46e5"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            )}
          </svg>
          {/* Render nodes */}
          {nodes.map((node) => (
            <NodeItem
              key={node.id}
              node={node}
              onStartDrag={(n, e) => {
                setDragging({ node: n, start: { x: e.clientX, y: e.clientY } });
                setDragLine({ x1: n.x, y1: n.y, x2: n.x, y2: n.y });
              }}
              onClick={(n) => setEditingNode(n.id)}
              onEndDrag={(n, isDrag, e) => {
                if (isDrag && containerRef.current && e) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  addNode({
                    id: Date.now().toString(),
                    title: 'New Note',
                    content: '',
                    x: x + 40,
                    y: y + 40,
                    parentId: dragging?.node.id ?? n.id,
                  });
                }
                setDragging(null);
                setDragLine(null);
              }}
            />
          ))}
        </div>
      )}
      {/* Edit Note Sheet */}
      <Sheet
        open={!!editingNode}
        onOpenChange={(open) => {
          if (!open) setEditingNode(null);
        }}
      >
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Edit Note</SheetTitle>
          </SheetHeader>
          {nodeToEdit && (
            <EditNoteSheet
              node={nodeToEdit}
              onSave={(title, content) => {
                updateNode(nodeToEdit.id, { title, content });
                setEditingNode(null);
              }}
              onCancel={() => setEditingNode(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
