import { gql, useQuery } from "@apollo/client";
import Dishes from "./dishes";
import { useContext, useState } from "react";

import AppContext from "./context";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);
  const [foodType, setFoodType] = useState("Any");
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart);
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
        foodType
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_RESTAURANTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  let basicBackground = `#fce5cd`;
  let selectedBackground = `#9fc5e8`;

  let foodTypeStyleBasic = {
    marginRight: "25px",
    backgroundColor: basicBackground,
    color: "black",
  };
  let foodTypeStyleSelected = {
    marginRight: "25px",
    backgroundColor: selectedBackground,
    color: "black",
  };

  const foodTypeList = ["Any", "American", "Italian", "French", "Japanese"].map(
    (foodTypeItem) => (
      <>
        {foodTypeItem !== foodType && (
          <Button
            key={foodTypeItem}
            style={foodTypeStyleBasic}
            onClick={() => {
              setFoodType(foodTypeItem);
            }}
          >
            {foodTypeItem}
          </Button>
        )}
        {foodTypeItem === foodType && (
          <Button
            key={foodTypeItem}
            style={foodTypeStyleSelected}
            onClick={() => {
              setFoodType(foodTypeItem);
            }}
          >
            {foodTypeItem}
          </Button>
        )}
      </>
    )
  );

  let searchQuery = data.restaurants.filter((res) => {
    return res.name.toLowerCase().includes(props.search);
  });

  // define renderer for Dishes
  const renderDishes = (restaurantID) => {
    return <Dishes restId={restaurantID}> </Dishes>;
  };

  let restaurantStyleBasic = {
    backgroundColor: basicBackground,
    margin: "0 0.5rem 20px 0.5rem",
  };
  let restaurantStyleSelected = {
    backgroundColor: selectedBackground,
    margin: "0 0.5rem 20px 0.5rem",
  };

  if (searchQuery.length > 0) {
    const restList = searchQuery
      .filter((res, id) => {
        if (foodType !== "Any") return res.foodType === foodType;
        if (foodType == "Any") return res;
      })
      .map((res) => (
        <Col xs="12" sm="6" lg="4" key={res.id}>
          <>
            {/* {true && */}
            {res.id !== restaurantID && (
              <Card style={restaurantStyleBasic}>
                <CardImg
                  top={true}
                  style={{ height: 200 }}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`}
                />
                <CardBody>
                  {/* <CardText>{res.description}</CardText> */}
                  <CardText style={{ height: "96px" }}>
                    {res.description}
                  </CardText>
                </CardBody>
                <div className="card-footer">
                  <Button
                    color="info"
                    onClick={() => {
                      setRestaurantID(res.id);
                    }}
                  >
                    {res.name}
                  </Button>
                </div>
              </Card>
            )}
            {res.id === restaurantID && (
              <Card style={restaurantStyleSelected}>
                <CardImg
                  top={true}
                  style={{ height: 200 }}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`}
                />
                <CardBody>
                  {/* <CardText>{res.description}</CardText> */}
                  <CardText style={{ height: "96px" }}>
                    {res.description}
                  </CardText>
                </CardBody>
                <div className="card-footer">
                  <Button
                    color="info"
                    onClick={() => {
                      setRestaurantID(res.id);
                      console.log("SELECTED");
                    }}
                  >
                    {res.name}
                  </Button>
                </div>
              </Card>
            )}
          </>
        </Col>
      ));

    return (
      <Container>
        <h2>What type of food would you like to order?</h2>
        <div style={{ marginBottom: "20px" }}>{foodTypeList}</div>

        <div>
          {foodType === "Any" ? (
            <h2>List of restaurants:</h2>
          ) : (
            <h2>{`List of restaurants serving ${foodType} food`}</h2>
          )}
        </div>
        <Row xs="3">{restList}</Row>

        {/* {restID > 0 && <h2>List of dishes:</h2>} */}
        <Row xs="3" style={{ marginBottom: "20px" }}>
          {renderDishes(restaurantID)}
        </Row>
      </Container>
    );
  } else {
    return <h1> No Restaurants Found</h1>;
  }
}
export default RestaurantList;
