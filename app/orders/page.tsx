"use client";

import { useContractContext } from "@/contexts/ContractContext";
import { useModal } from "@/contexts/ModalContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";

const Orders = () => {
    const [{ orders, isDeliver, userWallet }] = useUserContext();
    const [{ contract }] = useContractContext();
    const [_, dispatchModal] = useModal();
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const confirmDelivery = async (orderId: string) => {
        try {
            const message = ethers.keccak256(ethers.toUtf8Bytes("Order Completed" + orderId));
            const signature = await userWallet?.signMessage(ethers.getBytes(message));
            const endpoint = `https://ethereatsbackend-production.up.railway.app/${orderId}/${signature}`;
            const response = await axios.post(endpoint);
            dispatchModal({ type: "OPEN_MOBILE_MODAL" });
            dispatchModal({ type: "UPDATE_CONTENT", content: <div className="text-green-600">Successfullu delivered!</div> });
        } catch (e) {
            console.log(e);
            dispatchModal({ type: "OPEN_MOBILE_MODAL" });
            dispatchModal({ type: "UPDATE_CONTENT", content: <div className="text-red-600">Error!</div> });
        }
    };

    const acceptOrder = async (orderId: string) => {
        try {
            await contract.acceptOrder(orderId);
            dispatchModal({ type: "OPEN_MOBILE_MODAL" });
            dispatchModal({ type: "UPDATE_CONTENT", content: <div className="text-green-600">Order Accepted!</div> });
        } catch (e) {
            console.log(e);
            dispatchModal({ type: "OPEN_MOBILE_MODAL" });
            dispatchModal({ type: "UPDATE_CONTENT", content: <div className="text-red-600">Error!</div> });
        }
    };

    return (
        <div className="px-3 md:px-11 xl:px-32">
            <div className="my-20 text-2xl">{isDeliver ? "All orders available" : "Your orders"}</div>
            <div className="mt-10 flex flex-col items-stretch gap-7 text-lg md:text-xl lg:flex-row xl:gap-11 xl:text-2xl">
                <div className="w-full rounded-[24px] bg-[#FFF8DC] px-5 py-8 pb-52 md:px-11 xl:w-3/5">
                    {orders?.map((order, i) => (
                        <div key={i}>
                            <div
                                onClick={() => (openMenu === i ? setOpenMenu(null) : setOpenMenu(i))}
                                className="mb-4 flex w-full items-center justify-between"
                            >
                                <div className="font-bold">order {i + 1}</div>
                                <div className={`${openMenu === i ? "rotate-90" : "-rotate-90"}`}>{"<"}</div>
                            </div>
                            {openMenu === i && (
                                <div className="my-3 rounded-xl bg-brand-black p-2">
                                    <div className="flex items-start justify-between text-white">
                                        <div>3 hamburger</div>
                                        <div>Mac Global</div>
                                    </div>
                                    <div className="mb-3 flex items-start justify-between">
                                        <div
                                            onClick={() => (isDeliver ? acceptOrder(order.id) : confirmDelivery(order.id))}
                                            className="mt-4 w-fit cursor-pointer rounded-full bg-[#FF914D] px-5 py-2 text-center text-base font-semibold text-brand-app-black lg:text-lg"
                                        >
                                            {!isDeliver ? "Confirm Deliver" : "Accept order"}
                                        </div>

                                        <div
                                            onClick={() => console.log("cancel order")}
                                            className="mt-4 w-fit cursor-pointer rounded-full bg-red-500 px-5 py-2 text-center text-base font-semibold text-brand-app-black lg:text-lg"
                                        >
                                            Cancel order
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* <div className="flex w-full flex-col justify-between rounded-[24px] bg-[#FFE4B5] px-6 py-9 pb-12 xl:w-2/5 xl:p-9">
                    <div className="flex items-center justify-between">
                        <div className="font-bold">asd</div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Orders;
