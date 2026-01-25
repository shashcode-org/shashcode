import { useEffect, useState } from "react";

const IndependenceToast = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
  if (sessionStorage.getItem("republic_day_toast_shown")) return;

  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      if (data.country_code !== "IN") return;

      setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("republic_day_toast_shown", "true");

        setTimeout(() => {
          setShow(false);
        }, 3500);
      }, 800);
    })
    .catch(() => {
      // fail silently (no toast)
    });
}, []);


  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-slideInLeft">
      <div
        className="
          flex items-center gap-3
          px-4 py-3 rounded-xl shadow-lg
          bg-gradient-to-r from-orange-600 via-white to-green-600
          text-black
        "
      >
        <div className="text-sm leading-tight">
          <p className="font-semibold">Happy Republic Day</p>
          <p className="text-xs opacity-80">— Team ShashCode</p>
        </div>
      </div>
    </div>
  );
};

export default IndependenceToast;
