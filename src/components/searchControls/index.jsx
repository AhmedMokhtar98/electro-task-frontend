import { useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { initialFilters, priorityOptions, sortOptions, statusOptions, } from "../../utils/constants";

const controlClass = "h-12 rounded-2xl border border-slate-200 bg-slate-50/80 transition-colors hover:border-slate-300 dark:border-white/[0.08] dark:bg-black/25 dark:hover:border-white/[0.14]";
const selectClass = `${controlClass} [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selection-item]:!leading-[46px]`;
const searchPattern = /^[\p{L}\p{M}\p{N}' -]*$/u;

const SearchControls = ({ total, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || initialFilters.search;
  const [searchValue, setSearchValue] = useState(urlSearch);
  const searchTimeoutRef = useRef(null);
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const filters = {
    search: urlSearch,
    status: searchParams.get("status") || initialFilters.status,
    priority: searchParams.get("priority") || initialFilters.priority,
    dueDate: searchParams.get("dueDate") || initialFilters.dueDate,
    sortBy: searchParams.get("sortBy") || initialFilters.sortBy,
    sortOrder: searchParams.get("sortOrder") || initialFilters.sortOrder,
    page: page > 0 ? page : initialFilters.page,
    limit: limit > 0 ? limit : initialFilters.limit,
  };

  useEffect(() => {
    setSearchValue(urlSearch);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [urlSearch]);

  const updateUrl = (nextFilters) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([name, value]) => {
      if (value !== "" && value !== initialFilters[name]) {
        params.set(name, value);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const changeFilter = (name, value) => {
    const nextFilters = name === "sort" ? { ...filters, ...value, page: 1 } : { ...filters, [name]: value, page: 1 };
    updateUrl(nextFilters);
  };

  const changeSearch = (value) => {
    if (!searchPattern.test(value)) return;

    setSearchValue(value);
    clearTimeout(searchTimeoutRef.current);

    if (!value) {
      setSearchParams((currentParams) => {
        const params = new URLSearchParams(currentParams);
        params.delete("search");
        params.delete("page");
        return params;
      }, { replace: true });
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchParams((currentParams) => {
        const params = new URLSearchParams(currentParams);
        params.set("search", value);
        params.delete("page");
        return params;
      }, { replace: true });
    }, 1000);
  };

  const clearFilters = () => {
    clearTimeout(searchTimeoutRef.current);
    setSearchValue("");
    setSearchParams({}, { replace: true });
  };

  return (
    <section className="mb-6 rounded-[26px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/[0.07] dark:bg-[#171717]/90 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <SlidersHorizontal size={16} />
          </span>
          Search and filters
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          {loading
            ? "Loading tasks..."
            : `${total} ${total === 1 ? "task" : "tasks"} `}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(280px,1.4fr)_repeat(4,minmax(145px,0.8fr))_auto]">
        <Input
          allowClear
          aria-label="Search tasks by title"
          className={`${controlClass} md:col-span-2 lg:col-span-1`}
          placeholder="Search tasks by title..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={searchValue}
          onChange={(event) => changeSearch(event.target.value)}
        />

        <Select
          aria-label="Filter tasks by status"
          className={selectClass}
          options={statusOptions}
          value={filters.status}
          onChange={(value) => changeFilter("status", value)}
        />

        <Select
          aria-label="Filter tasks by priority"
          className={selectClass}
          options={priorityOptions}
          value={filters.priority}
          onChange={(value) => changeFilter("priority", value)}
        />

        <Input
          aria-label="Filter tasks by due date"
          className={`${controlClass} cursor-pointer px-3`}
          type="date"
          value={filters.dueDate}
          onClick={(event) => event.currentTarget.showPicker?.()}
          onChange={(event) => changeFilter("dueDate", event.target.value)}
        />

        <Select
          aria-label="Sort tasks"
          className={selectClass}
          options={sortOptions}
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(value) => {
            const [sortBy, sortOrder] = value.split(":");
            changeFilter("sort", { sortBy, sortOrder });
          }}
        />

        <Button
          aria-label="Clear task filters"
          className="!h-12 !rounded-2xl !border-slate-200 !px-4 !font-medium !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50 dark:!border-slate-700 dark:!text-slate-300 dark:hover:!bg-slate-800"
          icon={<ReloadOutlined />}
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>

    </section>
  );
};

export default SearchControls;
