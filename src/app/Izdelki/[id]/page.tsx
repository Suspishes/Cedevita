import { getIzdelek } from './getIzdelek'
import IzdelekDetailPage from './IzdelekDetailPage'

export default async function Page({ params }: { params: { id: string } }) {
  const izdelekId = Number.parseInt(params.id)
  const izdelek = await getIzdelek(izdelekId)

  if (!izdelek) {
    return <div>Izdelek not found</div>
  }

  return <IzdelekDetailPage izdelek={izdelek} />
}