import PropTypes from "prop-types";
import QRScanner from "./QRScanner";

function QRScanStep({ onScanComplete }) {
  return (
    <div className="scan-container">
      <h2>Patient Identification</h2>
      <QRScanner
        onResult={(result) =>
          onScanComplete({
            id: result.text,
            isExisting: result.text.startsWith("HOSP-"),
          })
        }
      />
      <button
        onClick={() => onScanComplete({ id: null, isExisting: false })}
        className="manual-entry-btn"
      >
        Manual Entry
      </button>
    </div>
  );
}

QRScanStep.propTypes = {
  onScanComplete: PropTypes.func.isRequired,
};

export default QRScanStep;
