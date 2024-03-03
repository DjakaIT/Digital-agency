import React from "react"

export default function Reserved(){
    
    return(
        <div className="reservedPage">
            <p className="uspjesnaRezervacija">Uspješno ste rezervirali smještaj</p>
            <ul className="prikazPriUspjehu">
                <li className="elementiPriUspjehu"></li>
                <li className="elementiPriUspjehu"></li>
                <li className="elementiPriUspjehu"></li>
            </ul>
            <button className="vratiNaPocetak">Vrati se na pocetak</button>
        </div>
    )
}