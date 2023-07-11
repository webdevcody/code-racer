import React from "react"

interface cardResultProps {
    item: {
        title: string,
        value: string
    }
}

const CardResult: React.FC<cardResultProps> = ({ item }) => {
    return (
        <div className="w-48 bg-[#1E1E1E] rounded-lg ">
            <h2 className="text-sm p-2 font-semibold text-white">{item.title}</h2>
            <h1 className="text-[40px] font-bold text-white">{item.value}</h1>
        </div>
    )
}

export default CardResult