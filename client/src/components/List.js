import React, { useEffect, useState } from "react";

function List() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/list-files", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  
  return (
    <div>
      <table>
        <tbody>
          {items &&
            items.map((item, index) => {
              return (
                <tr key={index}>
                    <td><img src={`http://localhost:5000/get-object/${item['name'].slice(7,)}`} width={100} height={200} alt={item['name']}/></td>
                  <td>{item["name"].slice(7,)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default List;
