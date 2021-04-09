import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Axios from "axios";


const Fav = React.memo((props) => {
    const [isRed, setIsRed] = React.useState(
        props.token ? (props.item.is_user_favourite ? true : false) : false
      );
    
      const toggleFav = (e, product_slug, isFav, color) => {
        if (props.token === undefined || props.token === null) {
          props.navigation.navigate("Login");
        } else {
          setIsRed(!isRed);
          Axios.get(
            `https://bellefu.com/api/user/product/favourite/${
              isFav ? "remove" : "add"
            }/${product_slug}`,
            {
              headers: {
                Authorization:
                  props.token !== undefined ? `Bearer ${props.token}` : "hfh",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
            .then((res) => {
            })
            .catch((error) => {
            });
        }
      };

      useEffect(() => {

      }, [isRed])
    
    return (
        <TouchableOpacity
        onPress={(e) =>
          toggleFav(e, props.item.slug, props.item.is_user_favourite)
        }
      >
        <MaterialCommunityIcons
          name="heart"
          size={25}
          color={isRed ? "#eb4034" : "#ffa500"}
        />
      </TouchableOpacity>
    )
})

export default Fav