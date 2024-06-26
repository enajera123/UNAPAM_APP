import { ReactNode } from "react"

export type TextAreaProps = {
    label: string,
    placeholder: string,
    rows: number,
    value: string, 
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
}