import { useEffect, useState } from 'react'
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import styles from './style.module.css'

export default function IsActiveFilterSelect() {
const {t} = useTranslation()
const navigate = useNavigate()
const location = useLocation()
const getQueryParam = (param) => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
};

const [selectedOption, setSelectedOption] = useState(() => {
  const isActive = getQueryParam('isActive');
  if (isActive === 'true') {
    return 'Active';
  } else if (isActive === 'false') {
    return 'Deleted';
  } else {
    return 'All';
  }
});

const urlParams =  new URLSearchParams(location.search);
const handleChange = (value)=>{
    setSelectedOption(value)
    if(value === "Active"){ urlParams.set(`isActive`, true);}
    else if(value === "Deleted"){urlParams.set(`isActive`, false);}
    else{ urlParams.delete(`isActive`); }
    const newUrl = `${location.pathname}?${urlParams.toString()}`;
    navigate(newUrl, { replace: true });
}

useEffect(() => {
    const selectedType = new URLSearchParams(location.search).get('isActive');
    if (selectedType) {
        if(selectedType==='true'){ setSelectedOption("Active");}
        if(selectedType==='false'){ setSelectedOption("Deleted");}
    }
    else{setSelectedOption("All");}
  }, [location.search]);

const items = [
  { key: '1', label: ( <div onClick={()=>handleChange("All")} className={styles.select_li}><span style={{color:selectedOption==="All"?"black" :""}}>{t("All")}</span> {selectedOption==="All" && <GoDotFill style={{color:"black"}}/>} </div> ), },
  { key: '2', label: ( <div onClick={()=>handleChange("Active")} className={styles.select_li}><span style={{color:selectedOption==="Active"?"green" :""}}>{t("Active")}</span>  {selectedOption==="Active" && <GoDotFill style={{color:"green"}}/>} </div> ), },
  { key: '3', label: ( <div onClick={()=>handleChange("Deleted")} className={styles.select_li}><span style={{color:selectedOption==="Deleted"?"red" :""}}>{t("Deleted")}</span>  {selectedOption==="Deleted" && <GoDotFill style={{color:"red"}}/>} </div> ), },
]
  return (
    <>
        <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }} >
            <Button  id={styles.isActive_Select_Btn} >
              <MdOutlineRemoveRedEye/>
              {t(`${selectedOption}`)}
            </Button>
          </Dropdown>
    </>
  )
}
