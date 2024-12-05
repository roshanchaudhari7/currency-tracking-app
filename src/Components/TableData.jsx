import React, { useState, useEffect } from 'react'

const TableData = () => {
    const [coinData, setCoinData] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const [sortBy, setSortBy] = useState('')
    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
            .then(responce => responce.json())
            .then(data => {
                
                console.log(data)
                setCoinData(data)
            })
    }, [])
    const filteredData = coinData.filter((coin) =>
        coin.name.toLowerCase().includes(searchValue.toLowerCase()) || coin.symbol.toLowerCase().includes(searchValue.toLowerCase())
    );
    const handleSearchValue = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSortBy = (type) => {
        let sortedCoins = [];
        if (type === 'market_cap') {
            sortedCoins = [...coinData].sort((a, b) => b.market_cap - a.market_cap);
        } else if (type === 'change_percentage') {
            sortedCoins = [...coinData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        }
        setCoinData(sortedCoins);
        setSortBy(type);
    };
    return (
        <div className='bg-black text-white flex flex-col items-center h-[100vh]'>
            <div className='flex flex-row mt-3'>
                <input
                    onChange={handleSearchValue}
                    type="text"
                    placeholder="Search By Name or Symbol"
                    value={searchValue}
                    className=" w-[400px] bg-transparent border bg-gray-800 py-3 pl-10 m-2"
                />
                <button className="block px-3 m-2 border text-white"
                    onClick={() => {
                        handleSortBy("market_cap")
                    }}>Sort By Mkt Cap</button>
                <button className="block px-3 m-2 border text-white"
                    onClick={() => {
                        handleSortBy("change_percentage")
                    }}>Sort by percentage</button>
            </div>
            <div>
                <table>
                    <tbody className='divide-y divide-gray-400'>
                        {
                            filteredData.map(coin => (
                                <tr key={coin.id} >
                                    <td>
                                        <img className='w-[30px]' src={coin.image} alt={coin.name} />
                                    </td>
                                    <td className='pl-3 py-4'>{coin.name}</td>
                                    <td className='pl-3 py-4'>{coin.symbol.toUpperCase()}</td>
                                    <td className='pl-8 py-4 text-right'>${coin.current_price}</td>
                                    <td className='pl-6 py-4 text-right'>${coin.total_volume.toLocaleString()}</td>
                                    <td className='pl-3 py-4 text-right' style={{ color: coin.price_change_percentage_24h < 0 ? 'red' : 'green' }}>
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </td>
                                    <td className='pl-3 py-4 text-right'>Mkt Cap:${coin.market_cap.toLocaleString()}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableData
