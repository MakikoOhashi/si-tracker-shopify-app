// my-next-app/components/StatusCard.jsx
function StatusCard({ si_number, status, eta, onSelectShipment }) {
    return (
      <div style={{
        border: '1px solid #ddd',
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif'
      }}>
        <h3
        className="text-lg font-bold cursor-pointer text-blue-600"
        onClick={onSelectShipment}
        >
        SI: {si_number}
        </h3>
        <strong>SI番号：</strong>#{si_number}<br />
        <strong>ステータス：</strong>{status}<br />
        <strong>到着予定日：</strong>{eta}
      </div>
    );
  }
  
  export default StatusCard;
  