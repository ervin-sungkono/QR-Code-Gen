"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from 'qrcode'
import { debounce, getBase64 } from "./_lib/helper";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver"
import { toast } from "react-toastify";
import Layout from "./_components/Layout";
import Button from "./_components/Button";
import ColorPicker from "./_components/ColorPicker";

export default function Home() {
  const [preview, setPreview] = useState(null)
  const [value, setValue] = useState("")
  const [logo, setLogo] = useState(null)
  const [logoSize, setLogoSize] = useState(25)
  const [transparent, setTransparent] = useState(false)
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const previewRef = useRef()

  useEffect(() => {
    if(value){
      QRCode.toDataURL(value,{ 
        width: 1024,
        margin: 2,
        errorCorrectionLevel: 'Q',
        color: {
          dark: foregroundColor, // Dark blue color for the QR code modules
          light: transparent ? "none" : backgroundColor, // Light color for the background (almost white)
        }
      }, 
      function (err, url) {
        if(err) toast("An error has occured", { type: 'error' })
        else setPreview(url)
      })
    }
  }, [value, transparent, foregroundColor, backgroundColor])

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
    <Layout>
      <div className="flex justify-center items-center w-full h-full px-4 py-8">
        <div className="w-full h-full max-w-[336px] flex flex-col bg-gray-200 shadow-md border border-black/20 rounded-lg py-4 px-4">
          {preview ? 
          <div ref={previewRef} className="relative w-full flex-shrink-0 aspect-square mb-4">
            {preview && <Image src={preview} alt="qr-code-preview" fill/>}
            {logo && <Image src={logo} alt="qr-code-preview" fill className="object-cover" style={{scale: `${logoSize/100}`}}/>}
          </div>:
          <div className="relative w-full flex-shrink-0 aspect-square mb-4 bg-gray-50 flex justify-center items-center">
            <p className="text-2xl font-semibold uppercase text-black/80">Preview</p>
          </div>}
          <div className="flex flex-col h-auto overflow-y-auto mb-4 pr-1">
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
            {logo && <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="logoSize" className="text-sm font-semibold mb-1">QR Logo Size</label>
              <div className="w-full flex items-center gap-2">
                <p>{logoSize}%</p>
                <input 
                  id="logoSize"
                  type="range" 
                  step={1}
                  min={10}
                  max={30}
                  value={logoSize}
                  onChange={(e) => setLogoSize(e.target.value)}
                  className="w-full"
                />
                <p>30%</p>
              </div>
            </div>}
            <div className="flex flex-col gap-1">
              <label htmlFor="content" className="text-sm font-semibold mb-1">Content</label>
              <textarea 
                id="content"
                rows={3} 
                onChange={debounce((e) => setValue(e.target.value), 1000)} 
                className="mb-2" 
                maxLength={4296}
                defaultValue={value}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <ColorPicker
                  label={"Foreground Color"}
                  id="foregroundColor"
                  defaultValue={foregroundColor}
                  onChange={debounce((e) => setForegroundColor(e.target.value), 500)}
                />
                <ColorPicker
                  label={"Background Color"}
                  id="backgroundColor"
                  defaultValue={backgroundColor} 
                  onChange={debounce((e) => setBackgroundColor(e.target.value), 500)}
                />
            </div>
            <div className="flex gap-2 items-center">
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
          </div>
          <Button disabled={!preview} onClick={downloadQR}/>
        </div>
      </div>
    </Layout>
  );
}
