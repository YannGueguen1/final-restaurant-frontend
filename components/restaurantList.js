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
  const [foodType, setFoodType] = useState("All");
  const [buttonColor, setButtonColor] = useState("blue");
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

  let buttonStyleBasic = {
    marginRight: "25px",
    backgroundColor: `#6c757d`,
  };
  let buttonStyleSelected = {
    marginRight: "25px",
    backgroundColor: `#0d6efd`,
  };

  const foodTypeList = ["All", "American", "Italian", "French", "Japanese"].map(
    (foodTypeItem) => (
      <>
        {foodTypeItem!==foodType &&
        <Button
        key={foodTypeItem.id}
        style={buttonStyleBasic}
        onClick={(event) => {
          setFoodType(foodTypeItem);
        }}
      >
        {foodTypeItem}
      </Button>
      }
        {foodTypeItem===foodType &&
        <Button
        key={foodTypeItem}
        style={buttonStyleSelected}
        onClick={(event) => {
          setFoodType(foodTypeItem);
        }}
      >
        {foodTypeItem}
      </Button>
      }
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

  if (searchQuery.length > 0) {
    const restList = searchQuery
      .filter((res, id) => {
        if (foodType !== "All") return res.foodType === foodType;
        if (foodType == "All") return res;
      })
      .map((res) => (
        <Col xs="6" sm="4" key={res.id}>
          <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
            <CardImg
              top={true}
              style={{ height: 200 }}
              src={
                process.env.NODE_ENV === "production"
                  ? res.image.url
                  : `${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`
              }
            />
            <CardBody>
              <CardText style={{ height: "72px" }}>{res.description}</CardText>
            </CardBody>
            <div className="card-footer">
              <Button color="info" onClick={() => setRestaurantID(res.id)}>
                {res.name}
              </Button>
            </div>
          </Card>
        </Col>
      ));

    return (
      <Container>
        <h2>Filter your cuisine preference:</h2>
        <div style={{ marginBottom: "20px" }}>{foodTypeList}</div>

        <div>
        {foodType === "All" ? (
          <h2>List of restaurants:</h2>
        ) : (
          <h2>{`List of restaurants serving ${foodType} food`}</h2>
        )}
        </div>
        <Row xs="3">{restList}</Row>

        {/* {restID > 0 && <h2>List of dishes:</h2>} */}
        <Row xs="3" style={{ marginBottom: "20px" }}>{renderDishes(restaurantID)}</Row>
      </Container>
    );
  } else {
    return <h1> No Restaurants Found</h1>;
  }
}
export default RestaurantList;
