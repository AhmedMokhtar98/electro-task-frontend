import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PutService } from "@/api/services/requests-service";
import { showToast } from "@/components/toastify/Toast";

export const TASK_COLUMNS = ["To Do", "In Progress", "Done"];

const POSITION_STEP = 1000;

const TaskDndContext = ({ tasks, setTasks, children, renderOverlay }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);
  const [overlayWidth, setOverlayWidth] = useState(undefined);
  const [savingOrder, setSavingOrder] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6, }, }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6, },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, })
  );

  const tasksByColumn = useMemo(
    () =>
      Object.fromEntries(
        TASK_COLUMNS.map((status) => [
          status,
          tasks.filter((task) => task.status === status),
        ])
      ),
    [tasks]
  );

  const resetDragState = () => {
    setActiveTask(null);
    setActiveDropColumn(null);
    setOverlayWidth(undefined);
  };

  const handleDragStart = ({ active, }) => {
    setActiveTask(active.data.current?.task || null);
    setActiveDropColumn(active.data.current?.status || null);
    setOverlayWidth(active.rect.current.initial?.width);
  };

  const handleDragOver = ({ over, }) => {
    setActiveDropColumn(over?.data.current?.status || null);
  };

  const handleDragEnd = async ({ active, over, }) => {
    resetDragState();

    if (!over || savingOrder) return;

    const activeId = String(active.id);
    const sourceStatus = active.data.current?.status;
    const targetStatus = over.data.current?.status;

    if (!sourceStatus || !targetStatus) return;

    const nextColumns = Object.fromEntries(
      TASK_COLUMNS.map((status) => [status, [...tasksByColumn[status]]])
    );
    const sourceItems = nextColumns[sourceStatus];
    const activeIndex = sourceItems.findIndex((task) => task._id === activeId);

    if (activeIndex < 0) return;

    if (sourceStatus === targetStatus) {
      const overIndex =
        over.data.current?.type === "column"
          ? sourceItems.length - 1
          : sourceItems.findIndex((task) => task._id === String(over.id));

      if (overIndex < 0 || activeIndex === overIndex) return;
      nextColumns[sourceStatus] = arrayMove(sourceItems, activeIndex, overIndex);
    } else {
      const [movedTask] = sourceItems.splice(activeIndex, 1);
      const targetItems = nextColumns[targetStatus];
      const overIndex =
        over.data.current?.type === "column"
          ? targetItems.length
          : targetItems.findIndex((task) => task._id === String(over.id));
      const insertAt = overIndex < 0 ? targetItems.length : overIndex;

      targetItems.splice(insertAt, 0, { ...movedTask, status: targetStatus, });
    }

    const previousTasks = tasks.map((task) => ({ ...task, }));
    const nextTasks = TASK_COLUMNS.flatMap((status) =>
      nextColumns[status].map((task, index) => ({
        ...task,
        status,
        position: (index + 1) * POSITION_STEP,
      }))
    );

    setTasks(nextTasks);
    setSavingOrder(true);

    try {
      await PutService({
        route: "tasks/reorder",
        data: {
          tasks: nextTasks.map(({ _id, status, position, }) => ({
            id: _id,
            status,
            position,
          })),
        },
      });
    } catch (error) {
      setTasks(previousTasks);
      showToast({
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to save task order",
        status: false,
      });
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragCancel={resetDragState}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {children({ tasksByColumn, activeDropColumn, savingOrder, })}

      <DragOverlay>
        {activeTask ? (
          <div style={{ width: overlayWidth, }}>
            {renderOverlay(activeTask)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskDndContext;
