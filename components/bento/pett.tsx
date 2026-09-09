import Image from "next/image"
import { PawPrint } from "lucide-react"
import "./pett.css"
import { TestflightSignup } from "./signups/testflight-signup"

export function PettFeaturedCard() {
  return <div className="pett-promo">
    <div className="pett-promo-grain" aria-hidden="true" />
    <div className="pett-promo-copy">
      <div className="pett-promo-message">
        <h2>I’m building<span className="pett-wordmark"><Image src="/pett/wordmark.png" alt="Pett" width={1536} height={1024} sizes="(max-width: 699px) 180px, 340px" /></span></h2>
        <p>A pet companion and<br />management app for iOS.</p>
      </div>
      <TestflightSignup />
    </div>
    <div className="pett-promo-art" aria-hidden="true">
      <div className="pett-orbit pett-orbit-outer" /><div className="pett-orbit pett-orbit-inner" />
      <div className="pett-icon-stage"><Image src="/pett/app-icon.png" alt="" width={1024} height={1024} sizes="(max-width: 699px) 140px, 240px" /></div>
      <svg className="pett-companions" viewBox="0 0 160 110" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <g className="pett-doodle-cat">
          <path d="M15 84c-9-12-8-24-2-35l-1-24 21 13c10-3 19-2 27 1l17-13-2 25c7 14 3 28-7 34-11 7-40 8-53-1Z" />
          <path d="m18 39 1-5 8 7m36 0 7-6-1 8M25 61q4-5 8 0m18 0q4-5 8 0m-20 7 5 3 4-3m-4 4v4m0 0q-5 5-9 0m9 0q5 5 9 0M10 66l-8-2m9 9-9 1m65-8 11-2m-10 9 10 1" />
          <path d="M24 87v13m34-12v12" />
        </g>
        <g className="pett-doodle-dog">
          <path d="M87 88c-8-10-7-30-2-41 5-12 13-15 25-14 13 0 22 7 25 21 3 12 2 25-4 33-8 10-33 11-44 1Z" />
          <path d="M88 40c-13-4-20 11-19 23 1 10 7 13 12 5l8-18m36-10c14-2 24 17 21 29-3 7-9 6-12-2l-6-15M94 65q4-5 7 0m14 0q4-5 7 0m-18 8q6-5 12 0l-6 4-6-4Zm6 4v5m-7 1q7 6 14 0m-12 3v6q5 6 9 0v-6M94 94l-1 8m31-9 1 9" />
        </g>
      </svg>
      <div className="pett-tag"><span className="pett-tag-ring" /><span className="pett-tag-face"><PawPrint /><i /></span></div>
      <svg className="pett-love-doodle" viewBox="0 0 46 48" fill="none"><path d="M23 40C15 30 3 23 6 12 9 1 21 7 23 17 27 2 41 2 40 15 39 25 31 34 23 40Z" /></svg>
      <svg className="pett-play-line" viewBox="0 0 200 90" fill="none"><path d="M5 47c26 42 75 38 99 13 23-24 5-50-12-35-16 15 12 47 50 32 18-7 32-21 50-16" /></svg>
      <svg className="pett-spark" viewBox="0 0 42 44"><path d="m9 17-5-8M22 12l3-9m5 20 9-3" /></svg>
    </div>
  </div>
}
