"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from 'qrcode'
import { debounce, getBase64 } from "./_lib/helper";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver"
import { toast } from "react-toastify";

export default function Home() {
  const [preview, setPreview] = useState(null)
  const [value, setValue] = useState("")
  const [logo, setLogo] = useState(null)
  const [transparent, setTransparent] = useState(false)
  const previewRef = useRef()

  useEffect(() => {
    QRCode.toDataURL(value,{ 
      width: 1024,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000', // Dark blue color for the QR code modules
        light: transparent ? "none" : '#FFFFFF', // Light color for the background (almost white)
      }
    }, 
    function (err, url) {
      if(err) toast("An error has occured", { type: 'error' })
      else setPreview(url)
    })
  }, [value, transparent])

  const downloadQR = () => {
    if(previewRef.current) 
    toPng(previewRef.current, {
      canvasWidth: 1024,
      canvasHeight: 1024
    })
      .then(dataUrl => saveAs(dataUrl, "QR_" + crypto.randomUUID()))
      .then(() => toast("QR Code has been downloaded!", { type: 'success' }))
      .catch(e => console.log(e))
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen px-4 py-8">
      <div className="flex flex-col mb-6 bg-gray-200 shadow-md border border-black/20 rounded-lg py-4 px-4">
        <div ref={previewRef} className="relative w-full max-w-[300px] aspect-square mb-4">
          {preview && <Image src={preview} alt="qr-code-preview" fill/>}
          {logo && <Image src={logo} alt="qr-code-preview" fill className="scale-[0.3] object-cover"/>}
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="logo" className="text-sm font-semibold mb-1">QR Logo (optional)</label>
          <input 
            id="logo"
            type="file" 
            onChange={(e) => 
              getBase64(e.target.files[0])
              .then(result => setLogo(result))
              .catch(err => console.log(err))
            }
            accept="image/*"
          />
          <span htmlFor="logo" className="text-xs">*Recommended aspect ratio is 1:1</span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="text-sm font-semibold mb-1">Content</label>
          <textarea 
            id="content"
            rows={3} 
            onChange={debounce((e) => setValue(e.target.value), 1000)} 
            className="mb-2" 
            maxLength={4296}
          >
            {value}
          </textarea>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <input 
            id="transparent"
            type="checkbox" 
            onChange={(e) => setTransparent(e.target.checked)}
            checked={transparent}
            className="w-5 h-5"
          />
          <label htmlFor="transparent">Transparent Background</label>
        </div>
        
        {/* <button className="bg-black text-white py-2 hover:bg-black/80 rounded mb-2 disabled:bg-gray-400" onClick={generateQR} disabled={!value}>Generate QR</button> */}
        <button 
          className="bg-blue-600 text-white py-2 hover:bg-blue-600/80 rounded disabled:bg-slate-400 font-semibold" 
          disabled={!preview} 
          onClick={downloadQR}
        >
          Download QR
        </button>
      </div>
    </div>
  );
}
