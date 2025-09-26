'use client'

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/card"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // For test cookie
    // Cookies.remove("cookie_consent")

    const consent = Cookies.get("cookie_consent")
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set("cookie_consent", "true", { expires: 365 })
    setVisible(false)
  }

  // Don't render anything until component is mounted on client
  if (!mounted || !visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-end">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-4 flex flex-col gap-3">
          <p>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setVisible(false)}>Decline</Button>
            <Button onClick={handleAccept}>Accept</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
