import { Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./type.css";
const { Option } = Select;

export default function Type({ type, setType, Options }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchType = (value) => {
    const urlParams = new URLSearchParams(location.search);
    setType(value);
    const oldValue = urlParams.get(`${type}`);
    //urlParams.delete(`dateField`);
    urlParams.delete(`${type}`);
    if (oldValue !== null) {
      urlParams.set(`${value}`, `${oldValue}`);
      const newUrl = `${location.pathname}?${urlParams.toString()}`;
      navigate(newUrl, { replace: true });
    }
  };

  return (
    <>
      <Select
        defaultValue={type}
        className={"!h-[40px] !min-w-[100px] !mt-0"}
        onChange={(value) => {
          handleSearchType(value);
        }}
      >
        {Options.map((item) => (
          <Option key={item.value} value={item.value}>
            {t(item.label)}
          </Option>
        ))}
      </Select>
    </>
  );
}
