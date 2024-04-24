import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";
import axios from 'axios';
import SearchBar from "../SearchBar/SearchBar";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import FreeShipping from '../../assets/icons/ic_shipping@2x.png';
import "./Details.scss";

function ItemDetails() {
  const [itemDetails, setItemDetails] = useState(null);
  const { itemId } = useParams();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {

        const itemResponse = await axios.get(`https://api.mercadolibre.com/items/${itemId}`);
        const itemData = itemResponse.data;


        const descriptionResponse = await axios.get(`https://api.mercadolibre.com/items/${itemId}/description`);
        const descriptionData = descriptionResponse.data;


        const elPrice = itemData.price;
        const integerPart = Math.floor(elPrice);
        const decimalPart = elPrice - integerPart;
        const roundedDecimalPart = Number(decimalPart.toFixed(2));


        const formattedItem = {
          author: {
            name: 'Hugo',
            lastname: 'Martinez Pablo'
          },
          item: {
            id: itemData.id,
            title: itemData.title,
            price: {
              currency: itemData.currency_id,
              amount: integerPart,
              decimals: decimalPart > 0 ? roundedDecimalPart : 0,
            },
            picture: itemData.pictures[0].secure_url,
            condition: itemData.condition,
            free_shipping: itemData.shipping.free_shipping,
            sold_quantity: itemData.sold_quantity,
            description: descriptionData.plain_text
          }
        };

        setItemDetails(formattedItem);
        console.log(formattedItem);
      } catch (error) {
        console.error('Error al obtener los detalles del ítem:', error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (!itemDetails) {
    return <div>Cargando...</div>;
  }

  let formattedDecimals;
  if (itemDetails.item.price.decimals !== 0) {
    formattedDecimals = itemDetails.item.price.decimals.toString().padEnd(2, '0').slice(1);
  } else {
    formattedDecimals = '';
  }

  return (

    <div>
      <SearchBar />
      <Breadcrumbs />
      <Container className="bg-white item-details-container">
        <Row>
          <Col sm={8} className="col-img">
            <img
              src={itemDetails.item.picture}
              alt={itemDetails.item.title}
              className="img-item-details" />
            <div className="box-description">
              <h2 className="title-description">Descripción del producto</h2>
              <p className="text-description">{itemDetails.item.description}</p>
            </div>
          </Col>
          <Col sm={4} className="col-details">
            <div className="condition-box">
              <p className="condition-text">{itemDetails.item.condition === 'new' ? 'Nuevo' : 'Usado'}</p><p>{itemDetails.item.sold_quantity}</p>
            </div>
            <h3>{itemDetails.item.title}</h3>
            <div className="price-content d-flex align-items-center">
              <div className="price">
                $<span className="final-price">{itemDetails.item.price.amount.toLocaleString('es-AR')}{formattedDecimals && <sup>{formattedDecimals}</sup>}</span>
              </div>
              {itemDetails.item.free_shipping && (
                <div className="shipping">
                  <img src={FreeShipping} alt="Envio Gratis" />
                </div>
              )}
            </div>
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg">
                Comprar
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ItemDetails;