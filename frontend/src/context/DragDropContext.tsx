import React, { createContext, useState, useCallback, useContext, type ReactNode } from "react";

interface DragDropContexValue {
    isDragging: Boolean
    activeDragableId: string | null;
    setDragState: (id: string | null) => void
}

const DragDropCtx = createContext<DragDropContexValue | null>(null);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeDragableId, setActiveDragableId] = useState<string | null>(null);
    const setDragState = useCallback((id: string | null) => { setActiveDragableId(id) }, [])

    return (
        <DragDropCtx.Provider value={{
            isDragging: activeDragableId !== null,
            activeDragableId,
            setDragState,
        }}>
            {children}
        </DragDropCtx.Provider>
    )
}

export function useDragDropContext(): DragDropContexValue {
    const ctx = useContext(DragDropCtx)
    if (!ctx) {
        throw new Error('useDragDropContext must be used inside <DragDropProvider>');
    }
    return ctx;
}
