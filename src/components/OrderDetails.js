import React, { useContext, useEffect, useState } from "react";
import AdminContext from "../context/Admincontext";
import axios from "axios";
import { translate } from "../functions";
import OrderDetailsContainer from "./styles/OrderDetailsContainer.styles";
import api from "../functions/api";


function OrderDetails({ order }) {
  const [products, setProducts] = useState([]);
  const { sanityprod } = useContext(AdminContext);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (sanityprod.length > 0) {
      const items = order.products.map((prod) => {
        const [id, quantity] = prod.split("_");
        const name = sanityprod.find((product) => {
          return product._id === id;
        }).title;
        return { id, quantity, name };
      });
      setProducts(items);
    }
  }, [sanityprod]);

  useEffect(() => {
    if (order.payment_type && order.payment_type.includes("PIX")) {
      api.get(`v1/payments/${order.payment_id}`).then((res) => {
        setStatus(res.data.status);
      });
    } else if (
      order.payment_type &&
      order.payment_type.includes("Cartão de Crédito")
    ) {
      setStatus(order.payment_status);
    }
  }, []);

  return (
  
    <OrderDetailsContainer>
      <div className="rightbar">
        <h2>Pedidos Realizados:</h2>
        <p><strong>Produtos:</strong></p>
        {products.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>{item.quantity}</p>
          </div>
        ))}
        <p>
        <strong>Endereço:</strong>
          <br></br>
          {order.address}
        </p>
        <p><strong>Dados do Cliente:</strong> {order.personal_data}</p>
        <p><strong>Tipo do Envio:</strong> {order.mailing_type}</p>
        <p><strong>Preço:</strong> {order.total_price} </p>
        <p><strong>Status do Pagamento:</strong> {translate(status)}</p>
      </div>
    </OrderDetailsContainer>
  );
}

export default OrderDetails;
