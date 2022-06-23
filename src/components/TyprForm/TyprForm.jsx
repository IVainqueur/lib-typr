import React, { useState, useEffect, useMemo, createContext } from "react";
// import { gsap } from "gsap";
// import { TyprFormContext } from "../../../stories/TyprForm.stories";
import { TyprElement } from "../TyprElement/TyprElement.jsx";
import { getDataType } from "../../oneliners/oneliners";
import { v4 } from "uuid";

export const TyprFormContext = createContext();

const nextIndex = (curIndex, num) => {
    if (num - 1 !== curIndex) {
        return curIndex + 1;
    } else {
        return curIndex;
    }
};

const nextElement = (setForms, unique_key, variable) => {
    setForms((prev) => {
        if (Object.keys(prev).length == 0) return prev;
        let curVal = prev[unique_key];
        return {
            ...prev,
            [unique_key]: {
                currentIndex: nextIndex(curVal.currentIndex, curVal.all.length),
                all: curVal.all,
                variables: { ...curVal.variables, ...variable },
            },
        };
    });
};

const checkForNextTrigger = (children, setForms, unique_key) => {
    let newChildren = [];
    for (let child of children) {
        /* Check if it has children */
        if (getDataType(child.props.children) == "Array") {
            let checkedChildren = checkForNextTrigger(
                child.props.children,
                setForms,
                unique_key
            );
            child = React.createElement(child.type, {
                ...child.props,
                children: checkedChildren,
            });
        } else if (getDataType(child.props.children) == "Object") {
            let checkedChildren = checkForNextTrigger(
                [child.props.children],
                setForms,
                unique_key
            );
            child = React.createElement(child.type, {
                ...child.props,
                children: checkedChildren,
            });
        }

        /* Check if it has the triggerNext prop */
        if (child.props.triggerNext) {
            let event = ["input", "textarea"].includes(child.type)
                ? "onKeyUp"
                : "onClick";
            child = React.createElement(child.type, {
                ...child.props,
                [event]: (e) => {
                    if (event === "onKeyUp") {
                        if (e.key !== "Enter") return;
                        let variable = child.props.name
                            ? { [child.props.name]: e.target.value }
                            : {};
                        nextElement(setForms, unique_key, variable);
                    } else {
                        nextElement(setForms, unique_key, {});
                    }
                },
            });
        }
        newChildren.push(child);
    }
    return newChildren;
};

export const TyprForm = ({
    animation = "default",
    randomWait = {min: 100, max: 200},
    children,
    variables = [],
}) => {
    const [forms, setForms] = useState({});
    const unique_key = useMemo(() => v4(), []);
    useEffect(() => {
        //Check if children is an array or object
        let param = getDataType(children) === "Array" ? children : [children];
        children = checkForNextTrigger(param, setForms, unique_key);
        if (!children)
            return () => {
                console.log("SHIT");
            };
        let type = getDataType(children);

        if (type != "Array") {
            children = [children];
        }

        if (!unique_key)
            throw new Error(
                "A TyprForm needs a unique_key prop to be uniquely identifiable among others"
            );
        setForms((prev) => ({
            ...prev,
            [unique_key]: {
                currentIndex: 0,
                all: parseChildren(children, unique_key, randomWait),
                variables: getVariables(variables),
            },
        }));
    }, []);

    return (
        <TyprFormContext.Provider value={[forms, setForms]}>
            <div className="TyprForm">
                {forms[unique_key] ? (
                    (() => {
                        return forms[unique_key].all.slice(
                            0,
                            forms[unique_key].currentIndex + 1
                        );
                    })()
                ) : (
                    <h1>Nothing to show</h1>
                )}
            </div>
        </TyprFormContext.Provider>
    );
};

function parseChildren(children, parent_unique_key, randomWait) {
    return children.map((child) => {
        if (getDataType(child.props.children) == "String") {
            return (
                <TyprElement
                    nextElement={nextElement}
                    parent_unique_key={parent_unique_key}
                    randomWaitInterval={randomWait}
                >
                    <div>
                        {React.createElement(
                            child.type,
                            { ...child.props },
                            child.props.children
                        )}
                    </div>
                </TyprElement>
            );
        }
        return (
            <TyprElement
                nextElement={nextElement}
                parent_unique_key={parent_unique_key}
                randomWaitInterval={randomWait}
            >
                {child}
            </TyprElement>
        );
    });
}

function getVariables(variables) {
    let theArr = {};
    for (let variable of variables) {
        theArr[variable] = "";
    }
    return theArr;
}
