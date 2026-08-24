import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

const SortableTask = ({ task, onDelete, onEdit, deleteLoading, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "task", status: task.status, task, },
    disabled,
  });

  return (
    <TaskCard
      deleteLoading={deleteLoading}
      dragAttributes={attributes}
      dragListeners={listeners}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      task={task}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
};

export default SortableTask;
