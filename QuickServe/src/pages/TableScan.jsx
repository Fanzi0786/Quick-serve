import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

function TableScan() {
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  /* =========================================
     LOAD RESTAURANTS
  ========================================= */

  useEffect(() => {
    const savedRestaurants = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    setRestaurants(savedRestaurants);

    if (restaurantId) {
      const restaurant = savedRestaurants.find(
        (item) => String(item.id) === String(restaurantId),
      );

      if (restaurant) {
        setCurrentRestaurant(restaurant);
      }
    }
  }, [restaurantId]);

  /* =========================================
     VERIFY QR
  ========================================= */

  const verifyQR = (decodedText) => {
    try {
      setLoading(true);
      setError("");

      let url;

      try {
        url = new URL(decodedText);
      } catch {
        throw new Error("Invalid QR code.");
      }

      const pathParts = url.pathname.split("/").filter(Boolean);

      /*
        Expected QR:

        /scan/restaurantId/tableId
      */

      if (pathParts.length !== 3 || pathParts[0] !== "scan") {
        throw new Error("This QR code is not a valid QuickServe table QR.");
      }

      const scannedRestaurantId = pathParts[1];
      const scannedTableId = pathParts[2];

      const restaurant = restaurants.find(
        (item) => String(item.id) === String(scannedRestaurantId),
      );

      if (!restaurant) {
        throw new Error("Restaurant not found.");
      }

      /* RESTAURANT STATUS */

      if (restaurant.status && restaurant.status !== "Active") {
        throw new Error("This restaurant is currently inactive.");
      }

      /* SUBSCRIPTION */

      if (restaurant.subscription?.endDate) {
        const endDate = new Date(restaurant.subscription.endDate);

        if (endDate < new Date()) {
          throw new Error("This restaurant's subscription has expired.");
        }
      }

      /* TABLES */

      const allTables = JSON.parse(
        localStorage.getItem("quickServeTables") || "{}",
      );

      const restaurantTables = allTables[scannedRestaurantId] || [];

      const table = restaurantTables.find(
        (item) => String(item.id) === String(scannedTableId),
      );

      if (!table) {
        throw new Error("Table not found. Please scan the correct table QR.");
      }

      /* SAVE SCAN CONTEXT */

      const scanContext = {
        restaurantId: scannedRestaurantId,
        tableId: scannedTableId,
        restaurantName: restaurant.name,
        tableName: table.name,
        scannedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "restaurantScanContext",
        JSON.stringify(scanContext),
      );

      /*
        Clear previous customer/order session
        when a new table QR is scanned.
      */

      localStorage.removeItem("restaurantCustomer");

      localStorage.removeItem("quickServeCurrentOrder");

      localStorage.removeItem("quickServeCart");

      /* GO TO MENU */

      navigate(`/menu/${scannedRestaurantId}/${scannedTableId}`);
    } catch (err) {
      setError(err.message || "Unable to read this QR code.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     CAMERA SCANNER
  ========================================= */

  const startCamera = async () => {
    setError("");

    if (scanning) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");

      scannerRef.current = html5QrCode;

      setScanning(true);

      await html5QrCode.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          stopCamera();
          verifyQR(decodedText);
        },
        () => {
          /*
            Ignore continuous scanner errors.
          */
        },
      );
    } catch (err) {
      setScanning(false);

      setError(
        "Camera could not be started. Please allow camera permission or use Upload QR Image.",
      );
    }
  };

  /* =========================================
     STOP CAMERA
  ========================================= */

  const stopCamera = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();

        await scannerRef.current.clear();

        scannerRef.current = null;
      }
    } catch (err) {
      console.log(err);
    }

    setScanning(false);
  };

  /* =========================================
     FILE QR SCAN
  ========================================= */

  const handleFileScan = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const html5QrCode = new Html5Qrcode("qr-file-reader");

      const decodedText = await html5QrCode.scanFile(file, true);

      await html5QrCode.clear();

      verifyQR(decodedText);
    } catch (err) {
      setError(
        "Could not read QR from this image. Please upload a clear QR image.",
      );

      setLoading(false);
    }

    event.target.value = "";
  };

  /* =========================================
     CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});

        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  /* =========================================
     DIRECT QR URL
  ========================================= */

  useEffect(() => {
    if (restaurantId && tableId && restaurants.length > 0) {
      const directQR = `${window.location.origin}/scan/${restaurantId}/${tableId}`;

      verifyQR(directQR);
    }
  }, [restaurantId, tableId, restaurants]);

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-container">
        {/* HEADER */}

        <div className="qr-header">
          <div className="qr-logo">Q</div>

          <h1>QuickServe</h1>

          <p>Scan your table QR code to view the menu and order food.</p>
        </div>

        {/* RESTAURANT */}

        {currentRestaurant && (
          <div className="qr-restaurant-info">
            <i className="bi bi-shop"></i>

            <div>
              <strong>{currentRestaurant.name}</strong>

              <span>Table QR</span>
            </div>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="qr-error">
            <i className="bi bi-exclamation-triangle-fill"></i>

            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="qr-loading">
            <div className="qr-spinner"></div>

            <span>Processing QR code...</span>
          </div>
        )}

        {/* OPTIONS */}

        {!loading && (
          <div className="scanner-options">
            {/* CAMERA */}

            <button
              type="button"
              className="scanner-option camera-option"
              onClick={startCamera}
              disabled={scanning}
            >
              <div className="scanner-option-icon">
                <i className="bi bi-camera-fill"></i>
              </div>

              <div className="scanner-option-content">
                <strong>Scan with Camera</strong>

                <span>Use your phone or webcam to scan</span>
              </div>

              <i className="bi bi-chevron-right"></i>
            </button>

            {/* FILE */}

            <button
              type="button"
              className="scanner-option upload-option"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="scanner-option-icon">
                <i className="bi bi-image-fill"></i>
              </div>

              <div className="scanner-option-content">
                <strong>Upload QR Image</strong>

                <span>Select a QR code image from your device</span>
              </div>

              <i className="bi bi-chevron-right"></i>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileScan}
              style={{
                display: "none",
              }}
            />
          </div>
        )}

        {/* CAMERA AREA */}

        {scanning && (
          <div className="camera-section">
            <div className="camera-section-header">
              <div>
                <i className="bi bi-camera-video-fill"></i>

                <strong>Camera Scanner</strong>
              </div>

              <button
                type="button"
                onClick={stopCamera}
                className="stop-camera-button"
              >
                <i className="bi bi-x-lg"></i>
                Stop
              </button>
            </div>

            <div id="qr-reader" className="qr-reader"></div>

            <div className="camera-help">
              <i className="bi bi-info-circle-fill"></i>
              Point your camera at the QR code placed on your restaurant table.
            </div>
          </div>
        )}

        {/* HIDDEN FILE READER */}

        <div
          id="qr-file-reader"
          style={{
            display: "none",
          }}
        ></div>

        {/* HELP */}

        {!scanning && !loading && (
          <div className="qr-help">
            <div className="qr-help-icon">
              <i className="bi bi-qr-code-scan"></i>
            </div>

            <div>
              <strong>How to order?</strong>

              <p>
                Scan the QR code on your table using the camera or upload a QR
                image to continue.
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}

        <div className="qr-footer">
          <i className="bi bi-shield-check"></i>
          Secure restaurant QR ordering
        </div>
      </div>
    </div>
  );
}

export default TableScan;
