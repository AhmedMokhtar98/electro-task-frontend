import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import style from "./style.module.css";

const Filter = ({ Options, path, setData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialFilterState = () => {
    const searchParams = new URLSearchParams(location.search);
    return Options.reduce((acc, filter) => {
      const value = searchParams.get(filter);
      acc[filter] = value === "true" ? "Yes" : value === "false" ? "No" : "All";
      return acc;
    }, {});
  };

  const [filters, setFilters] = useState(getInitialFilterState());

  // Sync state with URL changes
  useEffect(() => {
    setFilters(getInitialFilterState());
  }, [location.search]);

  const handleFilterChange = (filter, value) => {
    const newFilters = { ...filters, [filter]: value };
    setFilters(newFilters);

    const searchParams = new URLSearchParams(location.search);

    // Update or remove the filter parameter
    if (value === "All") {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, value === "Yes" ? "true" : "false");
    }

    // Reset to first page when filters change
    searchParams.set("page", "1");

    navigate({ search: searchParams.toString() }, { replace: true });
  };

  return (
    <div className={style.FilterContainer}>
      <div
        className={
          "flex items-center gap-2 mb-4 !text-[var(--text-primary-color)]"
        }
      >
        <CiFilter size={24} />
        <span>{t("Filter")}</span>
      </div>

      <div className={style.FilterOptions}>
        {Options.map((filter) => (
          <div key={filter} className={style.FilterOption}>
            <label>{t(`${filter}`)}</label>
            <div className={style.FilterButtons}>
              {["All", "Yes", "No"].map((option) => (
                <Button
                  key={option}
                  type={filters[filter] === option ? "primary" : "default"}
                  className={
                    filters[filter] === option ? style.active_btn : style.btn
                  }
                  onClick={() => handleFilterChange(filter, option)}
                >
                  {t(option)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
