"use server"

import type { Izdelki, Narocila, Stranka } from "@prisma/client";
import { saveOrderAndCustomer } from "./serverside";
import type { AddressFormData } from "./frontend";
import { Decimal } from "@prisma/client/runtime/library";

export async function Vstavljanje_podatkov(customerData: AddressFormData, kosarica: Izdelki[], skupnaCena: number) {
    const stranka: Stranka = {
        Ime: customerData.name,
        Priimek: customerData.surname,
        Telefon: customerData.phone,
        Naslov: `${customerData.street}, ${customerData.postalCode} ${customerData.city}`,
        Email: customerData.email,
        StrankaID: 0 
    };

    const order: Narocila = {
        NarociloID: 0,
        StrankaID: 0,
        Datum: new Date(),
        Status: 'Plačano',
        Cena: new Decimal(skupnaCena),
    };

    const izdelki: Izdelki[] = kosarica.map(item => ({
        ...item,
        Kolicina: item.Kolicina,
    }));

    await saveOrderAndCustomer(stranka, order, izdelki);
}