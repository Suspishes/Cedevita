import { db } from '~/server/db'
import { Izdelek } from 'src/app/kosarica/components/backend'

export async function getIzdelek(id: number) {
  const product = await db.izdelki.findUnique({
    where: { IzdelkiID: id },
  })
  if (!product) {
    return null;
  }

  const izdelek: Izdelek = {
    ...product,
    KolicinaNaZalogi: product.Kolicina,
    KolicinaVKosarici: 0,
    Opis: product.Opis ?? '',
  };

  return izdelek;
}