import React, {useRef} from "preact/compat";
import {useEffect, useState} from "preact/hooks";

const OptionCheck = ({label, name, setSettings}) => {

    const [checked, setChecked] = useState(logseq.settings[name]);
    const checkRef = useRef();

    const handleClick = (e) => {
        e.preventDefault();
        const newState = Object.assign({}, logseq.settings);
        newState[name] = e.target.checked;
        setSettings(newState);
        console.log('set checked', name, checked, !checked);
        setChecked(!checked);
    };

    useEffect(() => {
        if (checkRef && checkRef.current) {
            checked ? checkRef.current.checked = true : checkRef.current.checked = false;
        }
    }, [checked]);

    return (
        <div className={"option-check"}>
            <label>{label}</label>
            {
                <input ref={checkRef} name={name} type="checkbox" onClick={handleClick}/>
            }
        </div>
    );
}

export default OptionCheck;