import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";

interface Props {
  setVisitorData: (data: {
    name: string;
    email: string;
    company: string;
    mobile: string;
    raw: string;
  }) => void;
}

const QRScanner = ({ setVisitorData }: Props) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scannerStarted, setScannerStarted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const element = scannerRef.current;
    if (!element) return;

    html5QrCodeRef.current = new Html5Qrcode(element.id);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length > 0) {
        html5QrCodeRef.current
          ?.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              if (scanned) return; // Prevent double scans
              setScanned(true);
              handleDecodedText(decodedText);
            },
            (errorMessage) => {
              console.warn("Camera scan error:", errorMessage);
            }
          )
          .then(() => setScannerStarted(true))
          .catch((err) => console.error("QR start error", err));
      }
    });

    return () => {
      if (scannerStarted && html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleDecodedText = (decodedText: string) => {
    try {
      const parsed = JSON.parse(decodedText);
      setVisitorData({
        name: parsed.name || "",
        email: parsed.email || "",
        company: parsed.company || "",
        mobile: parsed.mobile || "",
        raw: decodedText,
      });
      if (html5QrCodeRef.current && scannerStarted) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    } catch (err) {
      console.warn("Invalid QR Code format.");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code?.data) {
      handleDecodedText(code.data);
    } else {
      alert("No QR code found in the image.");
    }
  };

  return (
    <div className="space-y-4">
      <div id="qr-reader" ref={scannerRef} className=" bg-gray-100" />

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <a
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-600 underline cursor-pointer"
        >
          Or Scan an Image File
        </a>
      </div>
    </div>
  );
};

export default QRScanner;
