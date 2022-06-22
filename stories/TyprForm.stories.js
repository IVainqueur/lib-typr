import React, { createContext, useState } from "react";
import { storiesOf } from '@storybook/react'

import { TyprForm } from "../src/components/TyprForm";


const stories = storiesOf("App Test", module)


stories.add('App', () => {
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
})

