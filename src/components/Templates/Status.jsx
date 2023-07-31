import { useState } from "react"

export default function Status({colors, status, data}){

    return(
        <div id="mt-all-requests">
            <ul className="mt-widget-requests">
                {Object.keys(data).map((key, index) => (
                    <li key={index} style={{ backgroundColor: colors[index], color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '11px', fontWeight:600}}>
                        {key} <span style={{float: "right"}}>{data[key].length}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}