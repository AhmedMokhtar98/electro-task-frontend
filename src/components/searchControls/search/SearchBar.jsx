import { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeSpacesWithFilter } from "../../../utils/helpers";
import style from "../style.module.css";
import Type from "./Type";
import imageExports from "@/assets/images";

const { Search } = Input;

export default function SearchBar({ type, setType, Options }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [allowApiOnRefresh, setAllowApiOnRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    const disallowedChars = await search.match(
      /[^a-zA-Z0-9\s.,()_\-!?$%[\]{}\/+'@]/g
    );
    if (disallowedChars) {
      // Join all disallowed characters and show them in the error message
      setErrorMessage(
        `These characters are not allowed: ${disallowedChars.join(" ")}`
      );
      return;
    }

    const trimmed = normalizeSpacesWithFilter(search.trimStart());
    setSearch(trimmed);

    const queryParams = new URLSearchParams(location.search);

    if (trimmed.length > 0) {
      queryParams.set(`${type}`, trimmed);
      queryParams.set("page", 1);
    } else {
      queryParams.delete(`${type}`);
      queryParams.set("page", 1);
    }

    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
    setErrorMessage("");
    if (type.length === 0) {
      setType(getQueryParamKey());
    }
  };

  // Update this useEffect to also listen to location.search changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramNames = Array.from(queryParams.keys());
    const filteredParamNames = paramNames.filter((paramName) =>
      Options.some((option) => option.value === paramName)
    );
    const currentType = filteredParamNames[0] || Options[0].value;
    const searchTextParam = queryParams.get(currentType);

    setType(currentType);
    setSearch(searchTextParam || "");
  }, [location.search, Options, setType]); // Added location.search as dependency

  // Handle cancel button click
  const cancelSearch = () => {
    setSearch("");
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete(`${type}`);
    queryParams.set("page", 1);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const getQueryParamKey = () => {
    const urlSearchParams = new URLSearchParams(location.search);
    for (const option of Options) {
      if (urlSearchParams.has(option.value)) {
        return option.value;
      }
    }
    return Options[0].value;
  };

  useEffect(() => {
    if (allowApiOnRefresh) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [search, type]);

  return (
    <div className={style.SearchBarContainer}>
      <Type Options={Options} type={getQueryParamKey()} setType={setType} />
      <Search
        className="bg-[var(--primary-color)] rounded-lg"
        placeholder={t("Type something to search here...")}
        value={search}
        onFocus={() => {
          if (!allowApiOnRefresh) {
            setAllowApiOnRefresh(true);
          }
        }}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        enterButton={
          search ? (
            <Button onClick={cancelSearch} id={style.SearchBTN}>
              X
            </Button>
          ) : (
            <Button
              id={style.SearchBTN}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              <img src={imageExports.searchIcon} alt="search" />
            </Button>
          )
        }
        style={{ flex: 1 }}
        id={style.SearchInput}
        ref={inputRef}
      />
      {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
    </div>
  );
}
