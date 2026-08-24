import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TbArrowsSort } from "react-icons/tb";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import style from "./style.module.css";

const Sort = ({ sortOptions }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialSortState = () => {
    const searchParams = new URLSearchParams(location.search);
    const sortParam = searchParams.get("sort");

    if (!sortParam) return { field: "", direction: "" };

    return {
      field: sortParam.startsWith("-") ? sortParam.substring(1) : sortParam,
      direction: sortParam.startsWith("-") ? "Descending" : "Ascending",
    };
  };

  const [sort, setSort] = useState(getInitialSortState());

  // Sync state with URL changes
  useEffect(() => {
    setSort(getInitialSortState());
  }, [location.search]);

  const handleSortChange = (field, direction) => {
    const newSort = { field, direction };
    setSort(newSort);

    const searchParams = new URLSearchParams(location.search);

    if (field && direction) {
      const sortValue = direction === "Descending" ? `-${field}` : field;
      searchParams.set("sort", sortValue);
    } else {
      searchParams.delete("sort");
    }

    // Reset to first page when sort changes
    searchParams.set("page", "1");

    navigate({ search: searchParams.toString() }, { replace: true });
  };

  return (
    <div
      className={`${style.SortContainer} bg-[var(--bg-third-color)] text-[var(--text-primary-color)] rounded-lg p-4 border border-[var(--border-primary-color)]`}
    >
      <div className={"flex items-center gap-2 mb-4"}>
        <TbArrowsSort size={24} />
        <span>{t("Sort")}</span>
      </div>

      <div className={style.SortOptions}>
        {sortOptions.map((option) => (
          <div key={option.value} className={style.SortOption}>
            <label className="!text-[var(--text-primary-color)]">
              {t(option.label)}
            </label>
            <div className={style.SortButtons}>
              {["Ascending", "Descending"].map((direction) => (
                <Button
                  key={direction}
                  type={
                    sort.field === option.value && sort.direction === direction
                      ? "primary"
                      : "default"
                  }
                  className={
                    sort.field === option.value && sort.direction === direction
                      ? style.active_btn
                      : style.btn
                  }
                  onClick={() => handleSortChange(option.value, direction)}
                >
                  {t(direction)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sort;
