import React, { useEffect, useState, useContext } from "react";
import { getType, randomWait, wait } from "../../oneliners/oneliners";
import {TyprFormContext} from '../TyprForm/TyprForm.jsx'

let hasChildren = false;

const TyprElement = ({ children, parent_unique_key, nextElement, randomWaitInterval }) => {
    const [onDisplay, setOnDisplay] = useState([]);
    const [toDisplay, setToDisplay] = useState([]);
    const [forms, setForms,] = useContext(TyprFormContext);
    useEffect(() => {
        /**
         * First check if the element has children
         */
        let type = getType(children.props.children);
        hasChildren = ["Array", "Object"].includes(type);
    }, []);

    useEffect(() => {
        (async function () {
            /**
             * CHECK If the current variable has all the text written out
             */
            if (!onDisplay.length) return;
            if (!onDisplay[onDisplay.length - 1].props.requiredText) {
                await wait(150);
                return;
            }
            if (
                onDisplay[onDisplay.length - 1].props.children ==
                onDisplay[onDisplay.length - 1].props.requiredText
            ) {
                setToDisplay(onDisplay);
                return;
            }
            await wait(randomWait(randomWaitInterval.min, randomWaitInterval.max));
            setOnDisplay((prev) => {
                let others = prev.slice(0, onDisplay.length - 1);
                let currentEl = onDisplay[onDisplay.length - 1];
                let currentText =
                    onDisplay[onDisplay.length - 1].props.children;
                let requiredText =
                    onDisplay[onDisplay.length - 1].props.requiredText;
                let toShow = React.createElement(
                    currentEl.type,
                    { ...currentEl.props },
                    requiredText.slice(0, currentText.length + 1)
                );
                return [...others, toShow];
            });
        })();
    }, [onDisplay]);

    useEffect(() => {
        (async () => {
            if (!hasChildren) return;
            let isOne = getType(children.props.children) === "Object";
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
             * Check if the current child to display has text content
             */
            let contentIsString =
                getType(nextChild.props.children) === "String";
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

                    newString = newString.slice(0, result.index) + fillIn + newString.slice(result.index + result[0].length);
                }
                let toShow = React.createElement(
                    nextChild.type,
                    { requiredText: newString, ...nextChild.props },
                    nextChild.props.children[0]
                );
                setOnDisplay((prev) => [...prev, toShow]);
            } else {
                setOnDisplay((prev) => [...prev, nextChild]);
            }
        })();
    }, [toDisplay]);
    return <div className="TyprElement">{onDisplay}</div>;
};

export {TyprElement};
