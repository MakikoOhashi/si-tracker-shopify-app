//my-next-app/components/StatusTable.jsx

import React, { useState } from 'react';

function StatusTable({ shipments, onSelectShipment }) {
  const [showArchived, setShowArchived] = useState(false);

  const filteredShipments = showArchived
    ? shipments
    : shipments.filter((s) => !s.is_archived);

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        アーカイブも表示
      </label>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>SI番号</th>
            <th>ステータス</th>
            <th>ETA</th>
          </tr>
        </thead>
        <tbody>
          {filteredShipments.map((s) => (
            <tr key={s.si_number}>
              <td
                className="text-blue-600 cursor-pointer"
                onClick={() => onSelectShipment(s)}
              >
                {s.si_number}
              </td>
              <td>{s.status}</td>
              <td>{s.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
