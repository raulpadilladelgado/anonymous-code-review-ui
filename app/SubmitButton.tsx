"use client"

import { useFormStatus } from 'react-dom'

export default function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button className="px-3 py-2 bg-red-500 text-white rounded-lg disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-red-700" type="submit" disabled={pending}>
            Clone random repository
        </button>
    )
}