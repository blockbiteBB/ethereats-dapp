"use client";

import RestaurantDescription from "@/components/Restaurant/RestaurantDescription";
import RestaurantInfo from "@/components/Restaurant/RestaurantInfo";
import Cart from "@/components/Restaurant/Cart";
import { useState } from "react";
import { restaurants } from "@/app/utils/constants";
import { Food } from "@/app/utils/types";

const RestaurantPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [inSelection, setInSelection] = useState<Food | null>(null);

    const restaurant = restaurants[Number(id)];

    return (
        <>
            <div className="px-5 pt-11 font-chillax md:px-11">
                <RestaurantDescription
                    info={{
                        title: restaurant?.restaurant_name,
                        location: restaurant?.restaurant_location,
                    }}
                />
                <div className="mt-7 grid w-fit grid-cols-3 gap-2.5 md:gap-5 lg:gap-11">
                    {restaurant?.food.map((food: Food, index: number) => (
                        <img
                            onClick={() => (inSelection === food ? setInSelection(null) : setInSelection(food))}
                            key={index}
                            src={food.image}
                            className="aspect-square w-[255px] cursor-pointer rounded-full object-cover"
                            alt={`food image ${index}`}
                        />
                    ))}
                </div>
                <div className="mt-10 flex flex-col items-stretch gap-7 text-lg md:text-xl lg:flex-row xl:gap-11 xl:text-2xl">
                    <RestaurantInfo description={restaurant?.restaurant_description} food={inSelection} />
                    <Cart name={restaurant?.restaurant_name} />
                </div>
            </div>
        </>
    );
};

export default RestaurantPage;
