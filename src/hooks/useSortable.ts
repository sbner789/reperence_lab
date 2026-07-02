import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';

type SortableConfig<T> = {
  list: T[];
  keyName: keyof T;
  content: (keyof T)[];
};

const SCROLL_EDGE_THRESHOLD = 60;
const SCROLL_STEP = 20;

const useSortable = <T extends Record<string, any>>({ 
    initialConfig 
} : { initialConfig: Partial<SortableConfig<T>> }) => {
    const [sortableList, setSortableList] = useState<T[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!initialConfig || !initialConfig.list) return;
        setSortableList(initialConfig.list);
    }, [initialConfig.list]);

    const handleDragColumn = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('selectedItem', String(index));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const container = scrollContainerRef.current;
        if (!container) return;

        const { top, bottom } = container.getBoundingClientRect();
        const distanceFromTop = e.clientY - top;
        const distanceFromBottom = bottom - e.clientY;

        if (distanceFromTop < SCROLL_EDGE_THRESHOLD) {
            container.scrollTop -= SCROLL_STEP;
        } else if (distanceFromBottom < SCROLL_EDGE_THRESHOLD) {
            container.scrollTop += SCROLL_STEP;
        }
    };

    const handleDropColumn = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const draggedItemRaw = e.dataTransfer.getData('selectedItem');
        if (draggedItemRaw === '') return;

        const draggedIndex = Number(draggedItemRaw);
        if (draggedIndex === dropIndex) return;

        const keyName = initialConfig?.keyName;
        if (!keyName) return;

        setSortableList((prev) => {
            const newItems = [...prev];
            const [draggedItem] = newItems.splice(draggedIndex, 1);
            newItems.splice(dropIndex, 0, draggedItem);

            return newItems.map((item, index) => ({
                ...item,
                [keyName]: index,
            }));
        });
    }

    const updateItem = (index: number, patch: Partial<T>) => {
        setSortableList((prev) => {
            if (!prev[index]) return prev;

            const newItems = [...prev];
            newItems[index] = { ...newItems[index], ...patch };
            return newItems;
        });
    };

    return {
        sortableList,
        scrollContainerRef,
        handleDragColumn,
        handleDragOver,
        handleDropColumn,
        updateItem
    }
}
export default useSortable;