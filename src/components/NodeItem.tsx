import React, { useRef } from 'react';
import { Node } from '@/app/store';

interface NodeItemProps {
  node: Node;
  onStartDrag: (node: Node, e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (node: Node) => void;
  onEndDrag?: (node: Node, isDrag: boolean, e: MouseEvent) => void;
}

const NodeItem: React.FC<NodeItemProps> = React.memo(
  ({ node, onStartDrag, onClick, onEndDrag }) => {
    const ref = useRef<HTMLDivElement>(null);
    const dragStarted = useRef(false);
    const moved = useRef(false);

    // Only call onClick if not dragged
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      dragStarted.current = true;
      moved.current = false;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      onStartDrag(node, e);
    };

    const handleMouseMove = () => {
      if (dragStarted.current) {
        moved.current = true;
      }
    };

    const handleMouseUp = (e?: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (onEndDrag && e) {
        onEndDrag(node, moved.current, e);
      }
      setTimeout(() => {
        dragStarted.current = false;
        moved.current = false;
      }, 0);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!moved.current) {
        onClick(node);
      }
    };

    return (
      <div
        ref={ref}
        className="absolute flex items-center justify-center rounded-full bg-background shadow-md border w-16 h-16 cursor-pointer select-none transition hover:scale-105"
        style={{ left: node.x - 32, top: node.y - 32, zIndex: 1 }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <span className="font-medium text-center px-2 truncate w-full">
          {node.title}
        </span>
      </div>
    );
  }
);

NodeItem.displayName = 'NodeItem';

export default NodeItem;
