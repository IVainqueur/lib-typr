import React, { createContext, useState } from "react";
import './index.css'
import { storiesOf } from '@storybook/react'

import { TyprForm } from "../src/components/TyprForm";


const stories = storiesOf("App Test", module)


stories.add('App', () => {
    return (
        <TyprForm>
                <h2 className="flex flex-col font-bold mb-5">
                    <span>Welcome to anonymous!</span>
                    <br/>
                    <span>You can become an Anonym in just a few steps...</span>
                </h2>
                <div className="Field flex flex-col mb-4">
                    {/* <BsCheckLg fill='#82f5f0'/> */}
                    <span className="text-[#00FFF0]">Field Name</span>
                    <input
                        type="text"
                        className="FieldInput px-3 py-2 border-b-2 border-dotted bg-transparent max-w-xl"
                        placeholder="Field holder"
                        triggerNext={true}
                    />
                </div>
                <div className="Field flex flex-col mb-4">
                    {/* <BsCheckLg fill='#82f5f0'/> */}
                    <span className="text-[#00FFF0]">Field Name</span>
                    <input
                        type="text"
                        className="FieldInput px-3 py-2 border-b-2 border-dotted bg-transparent max-w-xl"
                        placeholder="Field holder"
                    />
                </div>
            </TyprForm>
    )
})

