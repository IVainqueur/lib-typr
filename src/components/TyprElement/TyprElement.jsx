import React, { useEffect, useState, useContext } from "react";
import { getDataType, randomWait, wait } from "../../oneliners/oneliners";
import { TyprFormContext } from "../TyprForm/TyprForm.jsx";

let hasChildren = false;

const TyprElement = ({
    children,
    parent_unique_key,
    nextElement,
    randomWaitInterval,
}) => {
    const [onDisplay, setOnDisplay] = useState([]);
    const [toDisplay, setToDisplay] = useState([]);
    const [forms, setForms] = useContext(TyprFormContext);
    useEffect(() => {
        /**
         * First check if the element has children
         */
        let type = getDataType(children.props.children);
        hasChildren = ["Array", "Object"].includes(type);
    }, []);

    useEffect(() => {
        (async function () {
            /**
             * CHECK If the current variable has all the text written out
             */
            if (!onDisplay.length) return;
            let currentElement = onDisplay[onDisplay.length - 1];
            if (!onDisplay[onDisplay.length - 1].props.requiredtext) {
                await wait(150);
                let isTextField = ["input", "textarea"].includes(
                    currentElement.type
                );
                let hasTriggerNext = currentElement.props.triggerNext === true;
                if ((isTextField) || (hasTriggerNext)) return; /* Return and wait for nextTrigger */
                
                setToDisplay(onDisplay);
                return; 
            }
            if (
                onDisplay[onDisplay.length - 1].props.children ==
                onDisplay[onDisplay.length - 1].props.requiredtext
            ) {
                setToDisplay(onDisplay);
                return;
            }

            /* Check if the  */

            await wait(
                randomWait(randomWaitInterval.min, randomWaitInterval.max)
            );
            setOnDisplay((prev) => {
                let others = prev.slice(0, onDisplay.length - 1);
                let currentEl = onDisplay[onDisplay.length - 1];
                let currentText =
                    onDisplay[onDisplay.length - 1].props.children;
                let requiredtext =
                    onDisplay[onDisplay.length - 1].props.requiredtext;
                let toShow = React.createElement(
                    currentEl.type,
                    { ...currentEl.props },
                    requiredtext.slice(0, currentText.length + 1)
                );
                return [...others, toShow];
            });
        })();
    }, [onDisplay]);

    useEffect(() => {
        (async () => {
            // console.log(children);
            if (!hasChildren) {
                console.log("HAS NO CHILDREN");
                return;
            }
            if (children.props.children.length === onDisplay.length) {
                console.log("ENOUGH CHILDREN");
                nextElement(setForms, parent_unique_key);
                return;
            }
            // console.log(children)
            let isOne = getDataType(children.props.children) === "Object";
            if (isOne && onDisplay.length == 1) {
                nextElement(setForms, parent_unique_key);
                return;
            }
            /**
             * If it has children, then...
             */
            let nextChild = isOne
                ? children.props.children
                : children.props.children[onDisplay.length];
            /**
             * Check if the current child has no props
             */
            //  if(Object.keys(nextChild.props).length === 0){
            //     nextElement(setForms, parent_unique_key);
            //     return;
            // }
            /**
             * Check if the current child to display has text content
             */
            let contentIsString =
                getDataType(nextChild.props.children) === "String";
            /**
             * If the content is of string type, then...
             */
            if (contentIsString) {
                const reg = /(%(\w+)%)+?/g;
                let newString = nextChild.props.children;
                let result;
                while ((result = reg.exec(newString))) {
                    let fillIn = forms[parent_unique_key].variables[result[2]]
                        ? forms[parent_unique_key].variables[result[2]]
                        : result[0];

                    newString =
                        newString.slice(0, result.index) +
                        fillIn +
                        newString.slice(result.index + result[0].length);
                }
                let toShow = React.createElement(
                    nextChild.type,
                    { requiredtext: newString, ...nextChild.props },
                    nextChild.props.children[0]
                );
                setOnDisplay((prev) => [...prev, toShow]);
            } else {
                setOnDisplay((prev) => [...prev, nextChild]);
            }
        })();
    }, [toDisplay]);
    return <>{onDisplay}</>;
};

export { TyprElement };
