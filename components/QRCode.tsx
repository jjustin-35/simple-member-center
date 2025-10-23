"use client";

import { useRef, useEffect } from "react";
import qrcode from "qrcode";

const QRCode = ({ data }: { data: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      qrcode.toCanvas(canvasRef.current, data);
    }
  }, [data]);

  if (!data) return null;
  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCode;
