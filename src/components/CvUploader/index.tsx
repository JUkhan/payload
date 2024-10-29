'use client'
import { useState, FormEvent } from 'react'
import {Button} from '@/components/ui/button'

export default function UploadForm() {
  const [isSuccess, setSuccess] = useState<boolean>(false)
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
      await fetch('/api/uploadCV', {
        method: 'POST',
        body: formData,
      });
      setSuccess(true)
  }
  return (
    <>
      {!isSuccess && <form onSubmit={onSubmit} className="flex  gap-4">
        <label>
          <span>Attach Resume</span>
          <input type="file" name="file" required />
        </label>
        <Button type="submit">Submit</Button>
      </form>}
      {isSuccess && <div>Your application has been received. We will get back to you soon.</div>}
    </>
  )
}
