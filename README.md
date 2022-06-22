# Lib-Typr
Have form data presented one after the other with the text being written with a `typing effect`.

## Installation
To install it is as simple as simply typing out: 
```bash
npm install lib-typr
```
## Usage
Below is a simple example. Try it out
```javascript
import { TyprForm } from "lib-typr";

export default App = () => {
    return (
        <TyprForm variables={["name", "age", "profession"]}>
            <h1>Title of all of this</h1>
            <div className="Field">
                <h1>What is your name again?</h1>
                <input type={"text"} triggerNext={true} name="name" />

            </div>
            <div className="Field">
                <h1>%name%, How old are you?</h1>
                <input type={"text"} triggerNext={true} name="age" />
            </div>
            <div className="Field">
                <h1>%name% being %age%, What is profession?</h1>
                <input type={"text"} triggerNext={true} name="profession" />
            </div>
            <p>%name% is %age% and interested in %profession%</p>
            <button triggerNext={true}>Next</button>
        </TyprForm>
    )
}
```
## License
[MIT](https://choosealicense.com/licenses/mit/)

## Github repo
You can check out my [github](https://github.com/IVainqueur) for more experimental projects like this