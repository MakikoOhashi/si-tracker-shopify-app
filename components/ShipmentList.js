//my-next-app/components/ShipmentList.js

import React from 'react';

export function ShipmentList({ shipments }) {
  return (
    <div>
      <h2>出荷一覧</h2>
      <table>
        <thead>
          <tr>
            <th>SI番号</th>
            <th>船名</th>
            <th>出発日</th>
            <th>到着予定日</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.vessel}</td>
              <td>{s.departure}</td>
              <td>{s.arrival}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
