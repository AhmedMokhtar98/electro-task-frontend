import { Skeleton } from "antd";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CheckCircle2, CircleDotDashed, Inbox, LoaderCircle } from "lucide-react";
import SortableTask from "./SortableTask";

const columnStyles = {
  "To Do": {
    icon: CircleDotDashed,
    iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    badgeClass: "bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    surfaceClass: "bg-slate-100/70 dark:bg-[#1a1a1a]/80",
  },
  "In Progress": {
    icon: LoaderCircle,
    iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    surfaceClass: "bg-sky-50/70 dark:bg-sky-950/20",
  },
  Done: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    surfaceClass: "bg-emerald-50/70 dark:bg-emerald-950/20",
  },
};

const TaskColumn = ({
  status,
  tasks,
  loading,
  activeDropColumn,
  deleteLoading,
  draggingDisabled,
  onDelete,
  onEdit,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: { type: "column", status, },
  });
  const highlighted = isOver || activeDropColumn === status;
  const styleConfig = columnStyles[status];
  const ColumnIcon = styleConfig.icon;

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] select-none rounded-[26px] border p-3 transition-[border-color,background-color,box-shadow] sm:p-4 ${styleConfig.surfaceClass} ${
        highlighted
          ? "border-emerald-500 ring-4 ring-emerald-500/10"
          : "border-slate-200/80 dark:border-slate-800"
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl ${styleConfig.iconClass}`}
          >
            <ColumnIcon size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {status}
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-white/60">
              Drag tasks to reorder
            </p>
          </div>
        </div>
        <span
          className={`grid h-7 min-w-7 place-items-center rounded-full px-2 text-xs font-semibold ${styleConfig.badgeClass}`}
        >
          {tasks.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#1b1b1b]/95"
            >
              <Skeleton active paragraph={{ rows: 3 }} title />
            </div>
          ))}
        </div>
      ) : (
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-64 space-y-3">
            {tasks.map((task) => (
              <SortableTask
                key={task._id}
                deleteLoading={deleteLoading}
                disabled={draggingDisabled}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}

            {!tasks.length && (
              <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300/80 bg-white/40 px-4 dark:border-slate-700 dark:bg-slate-900/30">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Inbox
                    aria-hidden="true"
                    className="text-slate-300 dark:text-white/70"
                    size={42}
                    strokeWidth={1.6}
                  />
                  <p className="text-sm text-slate-500 dark:text-white/70">
                    No {status.toLowerCase()} tasks
                  </p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </section>
  );
};

export default TaskColumn;
