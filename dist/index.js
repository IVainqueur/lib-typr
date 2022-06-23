'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uuid = require('uuid');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const wait = duration => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};
const getType = value => {
  return Object.prototype.toString.call(value).slice(1, -1).split(' ')[1];
};
const randomWait = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

let hasChildren = false;

const TyprElement = ({
  children,
  parent_unique_key,
  nextElement,
  randomWaitInterval
}) => {
  const [onDisplay, setOnDisplay] = React.useState([]);
  const [toDisplay, setToDisplay] = React.useState([]);
  const [forms, setForms] = React.useContext(TyprFormContext);
  React.useEffect(() => {
    /**
     * First check if the element has children
     */
    let type = getType(children.props.children);
    hasChildren = ["Array", "Object"].includes(type);
  }, []);
  React.useEffect(() => {
    (async function () {
      /**
       * CHECK If the current variable has all the text written out
       */
      if (!onDisplay.length) return;

      if (!onDisplay[onDisplay.length - 1].props.requiredtext) {
        await wait(150);
        return;
      }

      if (onDisplay[onDisplay.length - 1].props.children == onDisplay[onDisplay.length - 1].props.requiredtext) {
        setToDisplay(onDisplay);
        return;
      }

      await wait(randomWait(randomWaitInterval.min, randomWaitInterval.max));
      setOnDisplay(prev => {
        let others = prev.slice(0, onDisplay.length - 1);
        let currentEl = onDisplay[onDisplay.length - 1];
        let currentText = onDisplay[onDisplay.length - 1].props.children;
        let requiredtext = onDisplay[onDisplay.length - 1].props.requiredtext;
        let toShow = /*#__PURE__*/React__default["default"].createElement(currentEl.type, { ...currentEl.props
        }, requiredtext.slice(0, currentText.length + 1));
        return [...others, toShow];
      });
    })();
  }, [onDisplay]);
  React.useEffect(() => {
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


      let nextChild = isOne ? children.props.children : children.props.children[onDisplay.length];
      /**
       * Check if the current child to display has text content
       */

      let contentIsString = getType(nextChild.props.children) === "String";
      /**
       * If the content is of string type, then...
       */

      if (contentIsString) {
        const reg = /(%(\w+)%)+?/g;
        let newString = nextChild.props.children;
        let result;

        while (result = reg.exec(newString)) {
          let fillIn = forms[parent_unique_key].variables[result[2]] ? forms[parent_unique_key].variables[result[2]] : result[0];
          newString = newString.slice(0, result.index) + fillIn + newString.slice(result.index + result[0].length);
        }

        let toShow = /*#__PURE__*/React__default["default"].createElement(nextChild.type, {
          requiredtext: newString,
          ...nextChild.props
        }, nextChild.props.children[0]);
        setOnDisplay(prev => [...prev, toShow]);
      } else {
        setOnDisplay(prev => [...prev, nextChild]);
      }
    })();
  }, [toDisplay]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "TyprElement"
  }, onDisplay);
};

const TyprFormContext = /*#__PURE__*/React.createContext();

const nextIndex = (curIndex, num) => {
  if (num - 1 !== curIndex) {
    return curIndex + 1;
  } else {
    return curIndex;
  }
};

const nextElement = (setForms, unique_key, variable) => {
  setForms(prev => {
    if (Object.keys(prev).length == 0) return prev;
    let curVal = prev[unique_key];
    return { ...prev,
      [unique_key]: {
        currentIndex: nextIndex(curVal.currentIndex, curVal.all.length),
        all: curVal.all,
        variables: { ...curVal.variables,
          ...variable
        }
      }
    };
  });
};

const checkForNextTrigger = (children, setForms, unique_key) => {
  let newChildren = [];

  for (let child of children) {
    /* Check if it has children */
    if (getType(child.props.children) == "Array") {
      let checkedChildren = checkForNextTrigger(child.props.children, setForms, unique_key);
      child = /*#__PURE__*/React__default["default"].createElement(child.type, { ...child.props,
        children: checkedChildren
      });
    } else if (getType(child.props.children) == "Object") {
      let checkedChildren = checkForNextTrigger([child.props.children], setForms, unique_key);
      child = /*#__PURE__*/React__default["default"].createElement(child.type, { ...child.props,
        children: checkedChildren
      });
    }
    /* Check if it has the triggerNext prop */


    if (child.props.triggerNext) {
      let event = ["input", "textarea"].includes(child.type) ? "onKeyUp" : "onClick";
      child = /*#__PURE__*/React__default["default"].createElement(child.type, { ...child.props,
        [event]: e => {
          if (event === "onKeyUp") {
            if (e.key !== "Enter") return;
            let variable = child.props.name ? {
              [child.props.name]: e.target.value
            } : {};
            nextElement(setForms, unique_key, variable);
          } else {
            nextElement(setForms, unique_key, {});
          }
        }
      });
    }

    newChildren.push(child);
  }

  return newChildren;
};

const TyprForm = ({
  animation = "default",
  randomWait = {
    min: 100,
    max: 200
  },
  children,
  variables = []
}) => {
  const [forms, setForms] = React.useState({});
  const unique_key = React.useMemo(() => uuid.v4(), []);
  React.useEffect(() => {
    //Check if children is an array or object
    let param = getType(children) === "Array" ? children : [children];
    children = checkForNextTrigger(param, setForms, unique_key);
    if (!children) return () => {
      console.log("SHIT");
    };
    let type = getType(children);

    if (type != "Array") {
      children = [children];
    }

    if (!unique_key) throw new Error("A TyprForm needs a unique_key prop to be uniquely identifiable among others");
    setForms(prev => ({ ...prev,
      [unique_key]: {
        currentIndex: 0,
        all: parseChildren(children, unique_key, randomWait),
        variables: getVariables(variables)
      }
    }));
  }, []);
  return /*#__PURE__*/React__default["default"].createElement(TyprFormContext.Provider, {
    value: [forms, setForms]
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "TyprForm"
  }, forms[unique_key] ? (() => {
    return forms[unique_key].all.slice(0, forms[unique_key].currentIndex + 1);
  })() : /*#__PURE__*/React__default["default"].createElement("h1", null, "Nothing to show")));
};

function parseChildren(children, parent_unique_key, randomWait) {
  return children.map(child => {
    if (getType(child.props.children) == "String") {
      return /*#__PURE__*/React__default["default"].createElement(TyprElement, {
        nextElement: nextElement,
        parent_unique_key: parent_unique_key,
        randomWaitInterval: randomWait
      }, /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(child.type, { ...child.props
      }, child.props.children)));
    }

    return /*#__PURE__*/React__default["default"].createElement(TyprElement, {
      nextElement: nextElement,
      parent_unique_key: parent_unique_key,
      randomWaitInterval: randomWait
    }, child);
  });
}

function getVariables(variables) {
  let theArr = {};

  for (let variable of variables) {
    theArr[variable] = "";
  }

  return theArr;
}

exports.TyprForm = TyprForm;
exports.TyprFormContext = TyprFormContext;
