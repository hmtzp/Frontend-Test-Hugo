import React from "react";
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import FreeShipping from '../../assets/icons/ic_shipping@2x.png';
import "./Results.scss";

const Results = ({ items, handleClick }) => {
    return (
        <Container className="bg-white">
            {items !== undefined && items.length > 0 &&
                items.map((item) => {
                    const formattedDecimals = item.price.decimals !== 0 ? item.price.decimals.toString().padEnd(2, '0').slice(1) : '';
                    return (
                        <div className="item d-flex"
                            key={`${item.id}-${item.name}`}
                            onClick={() => handleClick(item.id)}
                        >
                            <Col sm={2} className="col-img">
                                <img src={item.picture} alt={item.title} />
                            </Col>
                            <Col sm={5} className="col-description d-flex align-items-start justify-content-center flex-column">
                                <div className="price-content d-flex align-items-center">
                                    <div className="price">
                                        $<span className="final-price">{item.price.price.toLocaleString('es-AR')}{formattedDecimals && <sup>{formattedDecimals}</sup>}</span>
                                    </div>
                                    {item.free_shipping && (
                                        <div className="shipping">
                                            <img src={FreeShipping} alt="Envio Gratis" />
                                        </div>
                                    )}
                                </div>
                                <div className="name">
                                    {item.title}
                                </div>
                            </Col>
                        </div>
                    );
                })
            }
        </Container>
    );
};

export default Results;