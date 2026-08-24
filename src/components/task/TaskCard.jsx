import { Button } from "antd";
import { CalendarDays, CheckCircle2, GripVertical, Pencil, Trash2, } from "lucide-react";

const priorityStyles = {
  High: "border-red-200 bg-red-50 text-red-600 dark:border-red-900/80 dark:bg-red-950/50 dark:text-red-300",
  Medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/80 dark:bg-amber-950/50 dark:text-amber-300",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/50 dark:text-emerald-300",
};

const cardAccentStyles = {
  "To Do": "before:bg-slate-400",
  "In Progress": "before:bg-sky-500",
  Done: "before:bg-emerald-500",
};

const stopDragActivation = (event) => event.stopPropagation();

const TaskCard = ({
  task,
  onDelete,
  onEdit,
  deleteLoading,
  dragAttributes,
  dragListeners,
  setNodeRef,
  style,
  isDragging,
  isOverlay,
}) => {
  const dueDate = new Date(task.dueDate);
  const overdue = task.status !== "Done" && dueDate < new Date();

  return (
    <article
      ref={setNodeRef}
      style={{ ...style, touchAction: "manipulation" }}
      className={`relative select-none overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_14px_35px_-28px_rgba(15,23,42,0.65)] transition-[border-color,box-shadow,opacity] before:absolute before:inset-y-0 before:left-0 before:w-1 dark:border-white/[0.07] dark:bg-[#1b1b1b]/95 ${cardAccentStyles[task.status]} ${
        isOverlay
          ? "cursor-grabbing border-emerald-300 shadow-2xl ring-2 ring-emerald-500/30 dark:border-emerald-700"
          : "cursor-grab hover:border-slate-300 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.55)] active:cursor-grabbing dark:hover:border-slate-700"
      } ${isDragging ? "opacity-35" : "opacity-100"}`}
      {...dragAttributes}
      {...dragListeners}
    >
      {/* __________ C A R D  H E A D E R _________ */}

      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-950 dark:text-white"> {task.title} </h3>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`} >
            {task.priority} priority
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-slate-300 dark:text-slate-600">
          {task.status === "Done" && ( <CheckCircle2 className="text-emerald-500" size={19} /> )}
          <GripVertical aria-hidden="true" size={18} />
        </div>
      </div>

      {/* __________ C A R D  D E S C R I P T I O N _________ */}

      <p className="mt-3 min-h-12 pl-1 text-sm leading-6 text-slate-500 dark:text-slate-400"> {task.description} </p>

      {/* __________ C A R D  D A T E  &  S T A T U S _________ */}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-black/30">
        <div className={`flex min-w-0 items-center gap-2 text-xs font-medium ${ overdue ? "text-red-500" : "text-slate-500 dark:text-slate-400" }`} >
          <CalendarDays className="shrink-0" size={17} />
          <span className="truncate">
            {dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {overdue ? " (Overdue)" : ""}
          </span>
        </div>

      {/* __________ C A R D  C O N T R O L  B U T T O N S _________ */}

        {!isOverlay && (
          <div
            className="flex shrink-0 items-center gap-1"
            onKeyDown={stopDragActivation}
            onMouseDown={stopDragActivation}
            onPointerDown={stopDragActivation}
            onTouchStart={stopDragActivation}
          >
            <Button
              aria-label={`Edit ${task.title}`}
              className="!grid !h-8 !w-8 !place-items-center !rounded-lg !text-slate-500 hover:!bg-white hover:!text-sky-600 dark:hover:!bg-slate-800"
              icon={<Pencil size={17} />}
              type="text"
              onClick={() => onEdit(task)}
            />
            <Button
              danger
              aria-label={`Delete ${task.title}`}
              className="!grid !h-8 !w-8 !place-items-center !rounded-lg hover:!bg-white dark:hover:!bg-slate-800"
              icon={<Trash2 size={17} />}
              loading={deleteLoading}
              type="text"
              onClick={() => onDelete(task)}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
