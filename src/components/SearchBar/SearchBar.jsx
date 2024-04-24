import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import logoImage from '../../assets/icons/Logo_ML@2x.png';
import searchIcon from '../../assets/icons/ic_Search@2x.png';
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Results from "../Results/Results";
import axios from 'axios';

const SearchBar = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [theCategories, setTheCategories] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.query) {
      setLoading(true);
      fetchSearchResults(params.query).catch(error => console.error("error")).finally(() => setLoading(false));
    }
  }, [params.query]);

  const fetchCategoryInfo = async (categoryId) => {
    const url = `https://api.mercadolibre.com/categories/${categoryId}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const categories = data.path_from_root;
      setTheCategories(categories);
    } catch (error) {
      console.error("Error fetching category info for category ID", categoryId, ":", error);
    }
  };

  const fetchSearchResults = async (searchQuery) => {
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(searchQuery)}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const categoryCount = {};
      const items = data.results.slice(0, 4).map(item => {
        categoryCount[item.category_id] = (categoryCount[item.category_id] || 0) + 1;
        const elPrice = item.price;
        const integerPart = Math.floor(elPrice);
        const decimalPart = elPrice - integerPart;
        const roundedDecimalPart = Number(decimalPart.toFixed(2));
        return {
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            price: integerPart,
            decimals: decimalPart > 0 ? roundedDecimalPart : 0,
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping?.free_shipping,
        };
      });

      const mostFrequentCategoryId = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );
      await fetchCategoryInfo(mostFrequentCategoryId);
      const realResponse = {
        author: {
          name: "Hugo",
          lastname: "Martinez Pablo",
        },
        items: items,
        categories: theCategories,
      };
      setResults(realResponse);
      console.log(realResponse);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setResults([]);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search/${query}`);
    }
  };

  const handleClick = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  return (
    <div>
      <Navbar expand='lg' className='bg-meli w-100 z-1'>
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logoImage}
              height="30"
              className="d-inline-block align-top"
              alt="Mercado Libre"
            />
          </Navbar.Brand>
          <Form className='meli-search' onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto"
              />
              <Button type="submit" className='nav-search-btn'>
                <span className='icon icon-search'>
                  <img
                    src={searchIcon}
                    height="25"
                    className="d-inline-block align-top"
                    alt="Buscar"
                  />
                </span>
              </Button>
            </InputGroup>
          </Form>

        </Container>
      </Navbar>
      <Breadcrumbs info={theCategories.length > 0 ? theCategories : []} />
      <Results items={results.items} handleClick={handleClick} />
    </div>
  );
};

export default SearchBar;