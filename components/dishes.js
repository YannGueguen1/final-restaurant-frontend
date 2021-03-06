import {useRouter} from "next/router"
import {gql,useQuery} from '@apollo/client';
import {useState, useContext} from 'react'
import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col} from "reactstrap";
function Dishes({restId}){
  const [restaurantID, setRestaurantID] = useState()
  const {addItem} = useContext(AppContext)

const GET_RESTAURANT_DISHES = gql`
  query($id: ID!) {
    restaurant(id: $id) {
      id
      name
      dishes {
        id
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId},
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant;

  if (restId > 0){

    return (
      <>
          {restaurant.dishes.map((dish) => (
            <Col xs="6" sm="4" style={{ padding: 0}} key={dish.id}>
              <Card style={{ margin: "0 10px" }}>
                <CardImg
                  top={true}
                  style={{ height: 220, width:220, margin: "auto" }}
                  // src={`http://localhost:1337${dish.image.url}`}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${dish.image.url}`}
                />
                <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>Cost: ${dish.price}</CardText>
                </CardBody>
                <div className="card-footer">
                  <Button
                    outline
                    color="primary"
                    onClick = {()=> {
                      addItem(dish)
                    }}
                  >
                    + Add To Cart
                  </Button>
                  
                </div>
              </Card>
            </Col>
          ))}
        </>
        )}
        else{
          return <h2 style={{ marginLeft: "20px" }}> No Dishes</h2>
        }
    }
    export default Dishes